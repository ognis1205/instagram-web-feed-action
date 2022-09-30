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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview Defines GitHub action.
 * @copyright Shingo OKAWA 2022
 */
const Actions = __importStar(require("@actions/core"));
const FS = __importStar(require("fs/promises"));
const Handlers = __importStar(require("./handlers"));
const Format = __importStar(require("./format"));
const API = __importStar(require("instagram-private-api"));
const generate = (posts, metadata) => {
    return Object.assign(Object.assign({ version: "https://jsonfeed.org/version/1.1" }, metadata), { items: posts });
};
const action = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = Actions.getInput("file");
        const username = Actions.getInput("username");
        const password = Actions.getInput("password");
        const title = Actions.getInput("title");
        const pretty = Actions.getInput("pretty");
        const metadata = {
            title: title,
            description: `Instagram posts of ${username}.`,
        };
        const ig = new API.IgApiClient();
        ig.state.generateDevice(username);
        const user = yield ig.account.login(username, password);
        const feed = ig.feed.user(user.pk);
        const page = yield feed.items();
        let items = [];
        for (const post of page) {
            try {
                items = [...items, Format.feed(post)];
            }
            catch (e) {
                Handlers.onWarning(e);
            }
        }
        if (!items.length)
            return;
        const json = generate(items, metadata);
        yield FS.writeFile(file, JSON.stringify(json, null, 2));
        Actions.setOutput("STATUS", "success");
    }
    catch (e) {
        Handlers.onError(e);
    }
});
exports.default = action;
