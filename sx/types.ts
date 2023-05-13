export type Api = serenade.Api;

export type AppConfig = {
  path: string;
  appNameId: string;
  spokenName: string[];
  searchName: string;
  systemName: string;
  focusSettleTime: number;
  launchSettleTime: number;
  launchType: string;
  focusType: string;
  [key: string]: any;
};

export type LaunchType = (api: Api, appConfig: AppConfig) => Promise<void>;
export type FocusType = LaunchType;

export type LaunchTypes = {
  default: LaunchType;
  [type: string]: LaunchType;
};

export type FocusTypes = {
  default: FocusType;
  [type: string]: FocusType;
};

type NamedTrigger =
  | `${string}<%name%>${string}`
  | `${string}<%name%>${string}`[];

export type Trigger = string | string[];

export type Config = {
  userDataPath: string;
  appCommandsDataPath: string;
  vsCodeWorkspacePath: string;
  "commands.apps.register": NamedTrigger;
  "commands.apps.focusOrLaunch": (name: string) => Trigger;
  "commands.apps.focus": (name: string) => Trigger;
  "commands.apps.launch": (name: string) => Trigger;
  "commands.apps.editAppConfig": Trigger;
  "commands.apps.showAppConfig": Trigger;
  "commands.apps.editCommands": Trigger;
  "commands.apps.showCommands": Trigger;
  "commands.apps.showAllCommands": Trigger;
  "commands.apps.showGlobalCommands": Trigger;
  "commands.bookmarks.add": NamedTrigger;
  "commands.bookmarks.update": (name: string) => Trigger;
  "commands.bookmarks.open": (name: string) => Trigger;
  "commands.bookmarks.edit": Trigger;
  "commands.bookmarks.show": Trigger;
  "commands.help": Trigger;
  "commands.hotkeys.new": Trigger;
  "commands.hotkeys.cancel": Trigger;
  "commands.mousePosition.addOrUpdate": NamedTrigger;
  "commands.mousePosition.addOrUpdateGlobalScope": NamedTrigger;
  "commands.mousePosition.goTo": (name: string) => Trigger;
  "commands.mousePosition.goToAndClick": (name: string) => Trigger;
  "commands.mousePosition.edit": Trigger;
  "commands.mousePosition.show": Trigger;
  "commands.macros.record": Trigger;
  "commands.macros.play": Trigger;
  "commands.macros.playXTimes": (xTimes: string) => Trigger;
  "commands.macros.stop": Trigger;
  "commands.macros.edit": Trigger;
  "commands.macros.show": Trigger;
  "commands.macros.urlEdit": Trigger;
  "commands.macros.urlShow": Trigger;
  "commands.text.newOrUpdate": NamedTrigger;
  "commands.text.edit": Trigger;
  "commands.text.show": Trigger;
  "commands.text.execute": (name: string) => Trigger;
  "commands.run.newOrUpdate": NamedTrigger;
  "commands.run.execute": (name: string) => Trigger;
  "commands.run.edit": Trigger;
  "commands.run.show": Trigger;
  "commands.general.openSerenadeLog": Trigger;
  "commands.general.buildCommands": Trigger;
  "appConfig.defaultLaunchType": string;
  "appConfig.defaultFocusType": string;
  "appConfig.defaultFocusDelay": number;
  "appConfig.defaultLaunchDelay": number;
  "appConfig.launchTypes": LaunchTypes;
  "appConfig.focusTypes": FocusTypes;
  focusCommandsEnabled: boolean;
  launchCommandsEnabled: boolean;
  defaultBrowser: string;
  [key: string]: unknown;
};

export type UserConfig = Partial<Config>;
