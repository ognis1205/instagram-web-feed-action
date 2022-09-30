/**
 * @fileoverview Defines clean.
 * @copyright Shingo OKAWA 2022
 */
import EmojiRegex from "emoji-regex";

export const emoji = (value: string | undefined): string | undefined => {
  if (!value) return;
  const regex = EmojiRegex();
  let ret = value;
  let match;
  while ((match = regex.exec(value))) {
    const emoji = match[0];
    ret = ret.replace(emoji, "");
  }
  return ret;
};

export const hashtags = (value: string): string =>
  value
    .split(/\s+/gm)
    .filter((w) => !w.startsWith("#"))
    .join(" ");
