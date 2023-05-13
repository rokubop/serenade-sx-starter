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
command(config["commands.bookmarks.add"], async (api, matches) => {
  const url = await browser.getUrl(api);
  await bookmarksApi.add(matches.name, url);
});

forEachKeyVal(bookmarksApi.getAllSync(), (name, url) => {
  command(config["commands.bookmarks.update"](name), async (api, matches) => {
    const url = await browser.getUrl(api);
    await bookmarksApi.update(name, url);
  });
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

command(config["commands.bookmarks.edit"], async (api) => {
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(bookmarksDataPath);
});

command(config["commands.bookmarks.show"], async (api) => {
  await browser.open(bookmarksDataPath);
});
