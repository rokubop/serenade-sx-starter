import fs from "fs-extra";
import sx, { Api } from "sx";
import os from "os";
import path from "path";

import "sx/user-data-api/apps/commands";
import "sx/user-data-api/bookmarks/commands";
import "sx/user-data-api/macros/commands";
import "sx/user-data-api/text/commands";
import "sx/user-data-api/mouse-positions/commands";
import "sx/generators/add-hotkey/commands";
import browser from "sx/browser";
import { npmRunBuild, openPathInVSCode } from "sx/utils";
import { getConfig } from "./config";

const { command } = sx.global();
const config = getConfig();

command(config["commands.general.openSerenadeLog"], async (api) => {
  const filePath = path.join(os.homedir(), ".serenade", "serenade.log");
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(filePath);
});

command(config["commands.general.buildCommands"], async (api) => {
  try {
    const childProcess = await npmRunBuild();
    await browser.displaySuccessHtml(`
    <codeblock>${childProcess.stdout}</codeblock>
    `);
  } catch (err: any) {
    await browser.displayErrorHtml(`
    ${err.stderr ? `<codeblock>${err.stderr}</codeblock>` : ""}
      <codeblock>${JSON.stringify(err, null, 2)}</codeblock>
      <command>open sereande.log</command>
    `);
  }
});

/**
 * Change {{placeholder}} to the value of the placeholder in the config.
 * Change {{placeholder[0]}} to the first value in the array of the placeholder in the config.
 * Change {{placeholder("argument")}} to the first value in the array of the placeholder in the config with the argument passed in.
 */
const replacePlaceholdersInMd = (markdownText: string) => {
  const regex = /\{\{(.+?)(\[(\d+)\])?(\(["'](.+?)["']\))?\}\}/g;
  const formattedMd = markdownText.replace(
    regex,
    (
      match,
      placeholder: string,
      brackets: string,
      iterator: string,
      parens: string,
      argument: string
    ) => {
      let command: string | string[] = placeholder;
      if (config[placeholder]) {
        if (typeof config[placeholder] === "function") {
          command = (config[placeholder] as any)(argument || "<name>");
        } else {
          command = config[placeholder] as string[];
          command = command.map((c) => {
            return c.replace(/<%.+%>/g, argument || "<name>");
          });
        }
      }
      if (iterator) {
        command = command[Number(iterator)];
      } else if (argument) {
        command = command[0];
      }
      return typeof command === "string" ? command : command.join(", ");
    }
  );

  return formattedMd;
};

async function showHelp(markdownText: string) {
  const formattedMd = replacePlaceholdersInMd(markdownText);
  await browser.displayMarkdown(formattedMd);
}

command(config["commands.help"], async (api) => {
  const md = await fs.readFile(
    path.join(process.env.ROOT_DIR, "sx", "help", "main.md"),
    "utf8"
  );
  await showHelp(md);
});

[
  ["app config", "app-config"],
  ["apps", "apps"],
  ["auto hotkey", "auto-hotkey"],
  ["bookmarks", "bookmarks"],
  ["browser", "browser-api"],
  ["commands", "commands"],
  ["clipboard", "clipboard-api"],
  ["git", "git"],
  ["hotkeys", "hotkeys"],
  ["json api", "json-api"],
  ["macros", "macros"],
  ["mouse positions", "mouse-positions"],
  ["overview", "overview"],
  ["text commands", "text-commands"],
  ["utils", "utils"],
].forEach(([phrase, fileName]) => {
  command(
    `show help ${phrase}`,
    async (api) => {
      const helpFile = path.join(
        process.env.ROOT_DIR,
        "sx",
        "help",
        `${fileName}.md`
      );
      try {
        const md = await fs.readFile(helpFile, "utf8");
        await showHelp(md);
      } catch (e) {
        await browser.displayFileNotFound(helpFile);
      }
    },
    { autoExecute: true }
  );
});
