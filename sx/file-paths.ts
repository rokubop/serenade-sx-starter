import path from "path";
import { getConfig } from "./config";
const config = getConfig();

const userDataPath = config.userDataPath;
export const appsDataPath = path.join(userDataPath, "apps.json");
export const bookmarksDataPath = path.join(userDataPath, "bookmarks.json");
export const macrosDataPath = path.join(userDataPath, "macros.json");
export const mousePositionsDataPath = path.join(
  userDataPath,
  "mouse-positions.json"
);
export const textCommandsDataPath = path.join(
  userDataPath,
  "text-commands.json"
);
export const runCommandsDataPath = path.join(userDataPath, "run-commands.json");
export const urlMacrosDataPath = path.join(userDataPath, "url-macros.json");
export const commandsPath = path.join(userDataPath, "commands");
export const messagePath = path.join(userDataPath, "message.json");
