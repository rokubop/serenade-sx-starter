// be careful about imports here. It can create a cyclic dependency
import os from "os";
import path from "path";
import { Api, AppConfig, Config } from "./types";

export const defaultConfig: Config = {
  userDataPath: path.join(process.env.ROOT_DIR, "user-data"),
  appCommandsDataPath: path.join(process.env.ROOT_DIR, "src", "apps"),
  vsCodeWorkspacePath:
    process.env.VSCODE_WORKSPACE_PATH || path.join(process.env.ROOT_DIR),
  "commands.apps.register": ["register app <%name%>"],
  "commands.apps.focusOrLaunch": (name) => [`open ${name}`],
  "commands.apps.focus": (name) => [`focus ${name}`],
  "commands.apps.launch": (name) => [`launch ${name}`],
  "commands.apps.editCommands": ["edit commands"],
  "commands.apps.editAppConfig": ["edit app config"],
  "commands.apps.showAppConfig": ["show app config"],
  "commands.apps.showCommands": ["show commands"],
  "commands.apps.showAllCommands": ["show all commands"],
  "commands.apps.showGlobalCommands": ["show global commands"],
  focusCommandsEnabled: true,
  launchCommandsEnabled: true,
  "commands.bookmarks.add": ["add bookmark <%name%>", "new bookmark <%name%>"],
  "commands.bookmarks.update": (name) => [`update bookmark ${name}`],
  "commands.bookmarks.open": (name) => [`open ${name}`],
  "commands.bookmarks.edit": ["edit bookmarks"],
  "commands.bookmarks.show": ["show bookmarks", "open bookmarks"],
  "commands.help": ["show help"],
  "commands.hotkeys.new": [
    "record hot key",
    "record shortcut",
    "new hot key",
    "new shortcut",
  ],
  "commands.hotkeys.cancel": ["stop", "cancel"],
  "commands.mousePosition.addOrUpdate": [
    "new mouse position <%name%>",
    "new position <%name%>",
  ],
  "commands.mousePosition.addOrUpdateGlobalScope": [
    "new global mouse position <%name%>",
    "new global position <%name%>",
  ],
  "commands.mousePosition.goTo": (name) => [`mouse ${name}`],
  "commands.mousePosition.goToAndClick": (name) => [`click ${name}`],
  "commands.mousePosition.edit": ["edit mouse positions"],
  "commands.mousePosition.show": ["show mouse positions"],
  "commands.macros.record": ["record macro", "start recording"],
  "commands.macros.stop": ["stop", "cancel", "stop macro", "stop recording"],
  "commands.macros.play": ["play macro", "next page"],
  "commands.macros.playXTimes": (xTimes) => [`play macro ${xTimes}`],
  "commands.macros.edit": ["edit macros"],
  "commands.macros.show": ["show macros"],
  "commands.macros.urlEdit": ["edit url macros"],
  "commands.macros.urlShow": ["show url macros"],
  "commands.text.newOrUpdate": ["new text command <%name%>"],
  "commands.text.edit": ["edit text commands"],
  "commands.text.show": ["show text commands"],
  "commands.text.execute": (textCommand) => [`${textCommand}`],
  "commands.run.newOrUpdate": ["new run command <%name%>"],
  "commands.run.execute": (runCommand) => [`${runCommand}`],
  "commands.run.edit": ["edit run commands"],
  "commands.run.show": ["show run commands"],
  "commands.general.openSerenadeLog": [
    "open serenade dot log",
    "open serenade log",
  ],
  "commands.general.buildCommands": ["build commands", "rebuild commands"],
  "appConfig.defaultLaunchType":
    os.platform() === "win32" ? "search" : "default",
  "appConfig.defaultFocusType": "default",
  "appConfig.defaultFocusDelay": 100,
  "appConfig.defaultLaunchDelay": 1000,
  "appConfig.launchTypes": {
    search: async (api: Api, appConfig: AppConfig) => {
      await api.pressKey("win");
      await api.delay(100);
      await api.typeText(appConfig.searchName);
      await api.delay(50);
      await api.pressKey("enter");
    },
    default: async (api: Api, appConfig: AppConfig) => {
      await api.launchApplication(appConfig.systemName);
    },
  },
  "appConfig.focusTypes": {
    default: async (api: Api, appConfig: AppConfig) => {
      await api.focusApplication(appConfig.systemName);
    },
  },
  defaultBrowser: "chrome",
};
