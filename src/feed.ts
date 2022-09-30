/**
 * @fileoverview Defines feed.
 * @copyright Shingo OKAWA 2022
 */
export type Metadata = {
  title: string;
  description: string;
};

export type Item = {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  imgSrc: string;
};

export type Json = {
  version: string;
  title: string;
  description: string;
  items: Item[];
};
