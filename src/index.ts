/**
 * @fileoverview Defines GitHub action.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";
import * as FS from "fs/promises";
import * as Feed from "./feed";
import * as Handlers from "./handlers";
import * as Format from "./format";
import * as API from "instagram-private-api";

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
    const password = Actions.getInput("password");
    const title = Actions.getInput("title");
    const pretty = Actions.getInput("pretty");

    const metadata = {
      title: title,
      timestamp: `${Date.now()}`,
      description: `Instagram posts of ${username}.`,
    } as Feed.Metadata;

    const ig = new API.IgApiClient();
    ig.state.generateDevice(username);
    const user = await ig.account.login(username, password);
    const feed = ig.feed.user(user.pk);
    const page = await feed.items();

    let items: Feed.Item[] | [] = [];
    for (const post of page) {
      try {
        items = [...items, Format.feed(post)];
      } catch (e) {
        Handlers.onWarning(e);
      }
    }

    if (!items.length) return;
    const json = generate(items, metadata);
    await FS.writeFile(file, JSON.stringify(json, null, 2));
    Actions.setOutput("STATUS", "success");
  } catch (e) {
    Handlers.onError(e);
  }
};

export default action();
