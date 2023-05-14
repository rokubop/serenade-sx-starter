import sx from "sx";
import bookmarksApi from "./api";
import { forEachKeyVal, openPathInVSCode } from "sx/utils";
import browser from "sx/browser";
import { bookmarksDataPath } from "sx/file-paths";
import { getConfig } from "sx/config";

const config = getConfig();

const { command } = sx.global();

/**
 * Example:
 *
 * While on browser page:
 * "add bookmark netflix"
 *
 * "open netflix"
 *
 * "show bookmarks"
 */
command(
  config["commands.bookmarks.add"],
  async (api, matches) => {
    const url = await browser.getUrl(api);
    if (url) {
      await bookmarksApi.add(matches.name, url);
    } else {
      await browser.displayErrorHtml(
        `<p>Could not get url</p>
        <p><command>show help bookmarks</command></p>`
      );
    }
  },
  { autoExecute: true }
);

forEachKeyVal(bookmarksApi.getAllSync(), (name, url) => {
  command(
    config["commands.bookmarks.update"](name),
    async (api, matches) => {
      const url = await browser.getUrl(api);
      if (url) {
        await bookmarksApi.update(name, url);
      } else {
        await browser.displayErrorHtml(
          `<p>Could not get url</p><p><command>show help bookmarks</command></p>`
        );
      }
    },
    { autoExecute: true }
  );
});

forEachKeyVal(bookmarksApi.getAllSync(), (title, url) => {
  command(
    config["commands.bookmarks.open"](title),
    async (api) => {
      await browser.open(url);
    },
    { autoExecute: true }
  );
});

command(
  config["commands.bookmarks.edit"],
  async (api) => {
    await openPathInVSCode(config.vsCodeWorkspacePath);
    await openPathInVSCode(bookmarksDataPath);
  },
  { autoExecute: true }
);

command(
  config["commands.bookmarks.show"],
  async (api) => {
    await browser.open(bookmarksDataPath);
  },
  { autoExecute: true }
);
