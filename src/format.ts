/**
 * @fileoverview Defines format.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";
import Instagram  from "instagram-web-api";
import * as Feed from "./feed";
import * as Handlers from "./handlers";
import * as Clean from "./clean";

const truncate = (value: string): string => {
  const split = value.split(/(\.|\n|!)/)[0];
  let trimmed = split.substring(0, 50);
  if (split.length > trimmed.length) trimmed += "…";
  return trimmed.trim();
};

const title = (values: string[]): string => {
  const first = values[0];
  return first ? truncate(first) : "";
};

const content = (values: string[], isHTML = false): string => {
  if (values.length > 0)
    return values.map((line) => {
      if (isHTML)
        return `<p>${line}</p>`;
      return line;
    }).join("");
  return "";
}

const sidecar = ({ edges }: Instagram.EdgeSideCar): string => {
  return edges
    .map((item: Instagram.Edge) => item.node)
    .reduce(
      (str: string, item: Instagram.Node) =>
        (str += item.is_video ? video(item) : image(item)),
      ""
    );
};

const image = ({
  display_url,
  edge_sidecar_to_children,
}: {
  display_url: string;
  edge_sidecar_to_children: Instagram.EdgeSideCar;
}): string => {
  if (edge_sidecar_to_children) return sidecar(edge_sidecar_to_children);
  return `<p><img src="${display_url}" alt="" /></p>`;
};

const video = ({
  video_url,
  display_url,
  edge_sidecar_to_children,
}: {
  video_url: Instagram.Node["video_url"];
  display_url: Instagram.Node["display_url"];
  edge_sidecar_to_children: Instagram.Node["edge_sidecar_to_children"];
}): string => {
  if (edge_sidecar_to_children) return sidecar(edge_sidecar_to_children);
  return `<p><video src="${video_url}" poster="${display_url}" type="video/mp4">Sorry, your browser doesn't support embedded videos.</video></p>`;
}

const caption = (
  obj: Instagram.Node["edge_media_to_caption"],
  pretty: boolean
): string[] => {
  const caption = obj.edges.map((item) => item.node).map((item) => item.text);
  if (pretty && caption && caption.length > 0)
    return caption.reduce((lines: string[], line) => {
      let formatted = Clean.emoji(line);
      if (formatted) formatted = Clean.hashtags(formatted);
      if (formatted) formatted = formatted.trim();
      if (formatted) lines = [...lines, ...formatted];
      return lines;
    }, []);
  return caption;
};

export const feed = (
  feed: Instagram.Feed,
  target: string,
  pretty: boolean
): Feed.Item[] | [] => {
  if (!feed.user) {
    Handlers.onWarning(
      `Failed to fetch Instagram feed for ${target}. The username is incorrect or the Instagram API has ratelimited this request.`
    );
    return [];
  }

  const posts = feed.user.edge_owner_to_timeline_media.edges.map(
    (item) => item.node
  );
  Actions.info(`Fetched posts for @${target}.`);

  return posts.map((p) => {
    const cap = caption(p.edge_media_to_caption, pretty);
    const media = p.is_video ? video(p) : image(p);
    return {
      title: title(cap),
      link: `https://instagram.com/p/${p.shortcode}`,
      pubDate: new Date(p.taken_at_timestamp * 1000).toUTCString(),
      creator: target,
      content: content(cap),
      contentSnippet: `<p>@${target}</p>${content(cap, true)}${media}`,
      guid: p.id,
      isoDate: new Date(p.taken_at_timestamp * 1000).toISOString(),
    };
  });
};
