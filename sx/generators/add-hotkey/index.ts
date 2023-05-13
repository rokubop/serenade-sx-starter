import fs from "fs-extra";
import path from "path";
import { getActiveAppConfig, npmRunBuild } from "sx/utils";
import { getOrCreateApp } from "sx/generators/generate-app/get-app-command-file";
import browser from "sx/browser";
import { getConfig } from "sx/config";
const config = getConfig();

const templatePath = path.join(
  process.env.ROOT_DIR,
  "sx",
  "generators",
  "add-hotkey",
  "template.ts"
);
const templateCommand = fs.readFileSync(templatePath, "utf8");

export async function addPressKeyCommand(
  api: any,
  trigger: string,
  key: string,
  modifiers: string[]
) {
  const appConfig = await getActiveAppConfig(api);

  if (appConfig) {
    const keyAndModifiers = `"${key}"${
      modifiers.length
        ? ", [" + modifiers.map((val) => `"${val}"`).join(", ") + "]"
        : ""
    }`;

    const newCommand = templateCommand
      .replace(/\/\/@ts-nocheck\s+/g, "\n")
      .replace("__COMMAND_NAME__", trigger)
      .replace("__KEY_AND_MODIFIERS__", keyAndModifiers);

    const [appCommandsPath, createdNewFile] = await getOrCreateApp(appConfig);

    fs.appendFileSync(appCommandsPath, newCommand);

    await browser.displaySuccessHtml(`
      <h1>Command added</h1>
      ${createdNewFile ? "<h2>New commands file created</h2>" : ""}
      <table>
        <tr>
          <th>Command name</th>
          <th>Key and modifiers</th>
        </tr>
        <tr>
          <td>${trigger}</td>
          <td>${keyAndModifiers}</td>
        </tr>
      </table>
      <command>${config["commands.apps.editCommands"][0]}</command>
    `);

    console.log(`Added command to ${appCommandsPath}`);

    void npmRunBuild();
  }
}
