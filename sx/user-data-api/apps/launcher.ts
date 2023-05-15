import { appsApi, AppNameId } from "@/user-data-api/apps/api";
import { Api, AppConfig, LaunchType } from "sx/types";
import { entriesOf } from "sx/utils";
import { getConfig } from "sx/config";
import browser from "sx/browser";

const config = getConfig();

export interface AppCommands {
  launch: (api: Api) => Promise<void>;
  focus: (api: Api) => Promise<void>;
  /**
   * @returns boolean - isNewWindow - true if app was launched, false if app was already active
   */
  focusOrLaunch: (api: Api) => Promise<boolean>;
}

async function isAppActive(api: Api, systemName: string) {
  const app = await api.getActiveApplication();
  return app && app.includes(systemName) ? true : false;
}

async function waitUntilActive(api: Api, systemName: string) {
  await (async function waitUntilActiveLoop(attempt = 0) {
    if (attempt > 6) return;
    await api.delay(500);
    if (!(await isAppActive(api, systemName))) {
      await waitUntilActiveLoop(attempt + 1);
    }
  })();
}

const defaultCommands = (appConfig: AppConfig): AppCommands => {
  const commands = {
    launch: async (api: Api) => {
      let launchCommand = config["appConfig.launchTypes"][appConfig.launchType];
      if (launchCommand === undefined) {
        launchCommand = config["appConfig.launchTypes"].default;
        await browser.displayErrorHtml(`
          <h2>Launch type ${appConfig.launchType} not found for app ${appConfig.appNameId}.</h2>
          <p>Check your <code>src/sx-config.ts</code> or <code>user-data/apps.json</code> file to make sure you have a valid launch type.</p>
          <command>${config["commands.apps.editAppConfig"]}</command>
        `);
        console.log(
          `Launch type ${appConfig.launchType} not found for app ${appConfig.appNameId}. 
            Check your src/sx-config.ts or user-data/apps.json file to make sure you have a valid launch type.`
        );
      }
      await launchCommand(api, appConfig);
      await waitUntilActive(api, appConfig.systemName);

      if (appConfig.launchSettleTime) {
        await api.delay(appConfig.launchSettleTime);
      }
    },
    focus: async (api: Api) => {
      let focusCommand = config["appConfig.focusTypes"][appConfig.focusType];
      if (focusCommand === undefined) {
        focusCommand = config["appConfig.focusTypes"].default;
        await browser.displayErrorHtml(`
          <h2>Focus type ${appConfig.launchType} not found for app ${appConfig.appNameId}.</h2>
          <p>Check your <code>src/sx-config.ts</code> or <code>user-data/apps.json</code> file to make sure you have a valid launch type.</p>
          <command>${config["commands.apps.editAppConfig"]}</command>
        `);
        console.log(
          `Focus type ${appConfig.focusType} not found for app ${appConfig.appNameId}.
          Check your src/sx-config.ts or user-data/apps.json file to make sure you have a valid focus type.
          `
        );
      }
      await focusCommand(api, appConfig);
      if (appConfig.focusSettleTime) {
        await api.delay(appConfig.focusSettleTime);
      }
    },
    focusOrLaunch: async (api: Api) => {
      await commands.focus(api);
      let isNewWindow = false;

      if (!(await isAppActive(api, appConfig.systemName))) {
        isNewWindow = true;
        await commands.launch(api);
      }

      return isNewWindow;
    },
  };
  return commands;
};

let launcher = {} as Record<AppNameId, AppCommands>;

entriesOf(appsApi.getAllSync()).forEach(([appAlias, appConfig]) => {
  launcher[appAlias] = defaultCommands(appConfig);
});

export default launcher;
