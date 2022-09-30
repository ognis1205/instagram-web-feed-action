/**
 * @fileoverview Defines format.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";
import * as API from "instagram-private-api";
import * as Feed from "./feed";
import * as Handlers from "./handlers";
import * as Clean from "./clean";

const clean = (value: string | undefined): string => {
  let cleaned = Clean.emoji(value);
  if (cleaned) cleaned = Clean.hashtags(cleaned);
  if (cleaned) return cleaned;
  return "";
};

export const feed = (post: API.UserFeedResponseItemsItem): Feed.Item => {
  const title =  clean(post.caption?.text);
  const link = `https://www.instagram.com/p/${post.code}/`;
  const pubDate = new Date(post.taken_at * 1000).toUTCString();
  const creator = post.user?.username;
  const content = clean(post.caption?.text);
  const contentSnippet = post.caption?.text;
  const guid = post.id;
  const isoDate = new Date(post.taken_at * 1000).toISOString();
  let imgSrc = "";
  if (post.carousel_media) {
    const l = post.carousel_media[0].image_versions2.candidates.length;
    imgSrc = post.carousel_media[0].image_versions2.candidates[l - 1].url;
  } else {
    const l = post.image_versions2.candidates.length;
    imgSrc = post.image_versions2.candidates[l - 1].url;
  }
  return {
    title: title,
    link: link,
    pubDate: pubDate,
    creator: creator,
    content: content,
    contentSnippet: contentSnippet,
    guid: guid,
    isoDate: isoDate,
    imgSrc: imgSrc,
  } as Feed.Item;
};
