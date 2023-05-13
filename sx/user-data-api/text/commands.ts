import sx from "sx";
import { getClipboard } from "sx/clipboard";
import { textCommandsData, runCommandsData } from "./api";
import { forEachKeyVal, openPathInVSCode } from "sx/utils";
import { getConfig } from "sx/config";
import { runCommandsDataPath, textCommandsDataPath } from "sx/file-paths";

const config = getConfig();
const { command } = sx.global();

command(config["commands.text.newOrUpdate"], async (api, matches) => {
  await api.pressKey("c", ["commandOrControl"]);
  const command = await getClipboard();
  await textCommandsData.add(matches.name, command);
});

command(config["commands.run.newOrUpdate"], async (api, matches) => {
  await api.pressKey("c", ["commandOrControl"]);
  const command = await getClipboard();
  await runCommandsData.add(matches.name, command);
});

command(config["commands.text.edit"], async (api) => {
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(textCommandsDataPath);
});

command(config["commands.run.edit"], async (api) => {
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(runCommandsDataPath);
});

forEachKeyVal(runCommandsData.getAllSync(), (trigger, text) => {
  command(trigger, async (api) => {
    await api.typeText(text);
    await api.pressKey("enter");
  });
});

forEachKeyVal(textCommandsData.getAllSync(), (trigger, text) => {
  command(trigger, async (api) => {
    await api.typeText(text);
  });
});
