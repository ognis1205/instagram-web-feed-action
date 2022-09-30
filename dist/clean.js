"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashtags = exports.emoji = void 0;
/**
 * @fileoverview Defines clean.
 * @copyright Shingo OKAWA 2022
 */
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const emoji = (value) => {
    if (!value)
        return;
    const regex = (0, emoji_regex_1.default)();
    let ret = value;
    let match;
    while ((match = regex.exec(value))) {
        const emoji = match[0];
        ret = ret.replace(emoji, "");
    }
    return ret;
};
exports.emoji = emoji;
const hashtags = (value) => value
    .split(/\s+/gm)
    .filter((w) => !w.startsWith("#"))
    .join(" ");
exports.hashtags = hashtags;
