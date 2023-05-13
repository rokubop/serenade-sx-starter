import path from "path";
import fs from "fs-extra";
import { commandMapTriggers } from "sx";
import { writeJsonFile } from "sx/json-api";
import { commandsPath } from "sx/file-paths";

export default async function onCommandsRegistered() {
  let numCommands = 0;

  const allCommands = {} as {
    [scopeName: string]: string[];
  };

  fs.emptyDirSync(commandsPath);

  Object.entries(commandMapTriggers).forEach(([scopeName, triggers]) => {
    const scopePath = path.join(commandsPath, `${scopeName}.json`);
    const justCommands = [...triggers.keys()].sort();

    if (scopeName !== "all") {
      // all contains a flat list of all commands
      // and doesn't represent true length of commands
      numCommands += justCommands.length;
    }
    allCommands[scopeName] = justCommands;

    void writeJsonFile(scopePath, justCommands, { silent: true });
  });

  console.log(`Registered ${numCommands} custom commands\n`);
}
