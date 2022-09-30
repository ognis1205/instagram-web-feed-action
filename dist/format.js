"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feed = void 0;
const Clean = __importStar(require("./clean"));
const clean = (value) => {
    let cleaned = Clean.emoji(value);
    if (cleaned)
        cleaned = Clean.hashtags(cleaned);
    if (cleaned)
        return cleaned;
    return "";
};
const feed = (post) => {
    var _a, _b, _c, _d;
    const title = clean((_a = post.caption) === null || _a === void 0 ? void 0 : _a.text);
    const link = `https://www.instagram.com/p/${post.code}/`;
    const pubDate = new Date(post.taken_at * 1000).toUTCString();
    const creator = (_b = post.user) === null || _b === void 0 ? void 0 : _b.username;
    const content = clean((_c = post.caption) === null || _c === void 0 ? void 0 : _c.text);
    const contentSnippet = (_d = post.caption) === null || _d === void 0 ? void 0 : _d.text;
    const guid = post.id;
    const isoDate = new Date(post.taken_at * 1000).toISOString();
    let imgSrc = "";
    if (post.carousel_media) {
        const l = post.carousel_media[0].image_versions2.candidates.length;
        imgSrc = post.carousel_media[0].image_versions2.candidates[l - 1].url;
    }
    else {
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
    };
};
exports.feed = feed;
