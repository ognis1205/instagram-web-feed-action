/**
 * @fileoverview Defines GitHub action.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";
import * as FS from "fs/promises";
import * as Feed from "./feed";
import * as Handlers from "./handlers";
import * as Format from "./format";
import Instagram  from "instagram-web-api";

const generate = (posts: Feed.Item[], metadata: Feed.Metadata): Feed.Json => {
  return {
    version: "https://jsonfeed.org/version/1.1",
    ...metadata,
    items: posts,
  };
};

const action = async (): Promise<void> => {
  try {
    const file = Actions.getInput("file");
    const username = Actions.getInput("username");
    const targets = Actions.getInput("targets").split(",");
    const title = Actions.getInput("title");
    const pretty = Actions.getInput("pretty");

    const client = new Instagram({ username });
    const metadata = {
      title: title,
      description: `Instagram posts of ${targets.join(", ")}.`,
    } as Feed.Metadata;

    let feeds: Feed.Item[] | [] = [];
    for (const target of targets) {
      try {
        const posts = await client.getPhotosByUsername({ username: target });
        const formatted = Format.feed(posts, target, pretty === "true");
        if (formatted) feeds = [...feeds, ...formatted];
      } catch (e) {
        Handlers.onWarning(e);
      }
    }

    if (!feeds.length) return;
    const json = generate(feeds, metadata);
    await FS.writeFile(file, JSON.stringify(json, null, 2));
    Actions.setOutput("RSS_STATUS", "success");
  } catch (e) {
    Handlers.onError(e);
  }
};

export default action;
