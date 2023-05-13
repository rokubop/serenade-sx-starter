import fs from "fs";
import sx from "sx";
import path from "path";
import launcher from "./launcher";
import {
  entriesOf,
  formatAsNameId,
  getActiveAppConfig,
  isVSCodeInPath,
  openPathInVSCode,
} from "sx/utils";
import { appsApi } from "./api";
import browser from "sx/browser";
import { appsDataPath, commandsPath } from "sx/file-paths";
import { AppConfig, getConfig } from "sx/config";
import { getOrCreateApp } from "sx/generators/generate-app/get-app-command-file";

const config = getConfig();
const { command } = sx.global();

command(config["commands.apps.register"], async (api, matches) => {
  const appNameId = formatAsNameId(matches.name);
  console.log("Registering app " + appNameId);
  const systemPath = await api.getActiveApplication();
  const systemName = path.basename(systemPath, path.extname(systemPath));

  const alreadyRegistered = entriesOf(appsApi.getAllSync()).find(
    ([appNameId, config]) => {
      return (
        config.path === systemPath ||
        config.systemName === systemName ||
        config.appNameId === formatAsNameId(matches.name) ||
        config.spokenName.includes(matches.name)
      );
    }
  );

  if (alreadyRegistered) {
    const [existingAppNameId, existingConfig] = alreadyRegistered;
    console.log("Error: Could not register app.");
    console.log(
      `App ${matches.name} already registered with path ${existingConfig.path}`
    );
    await browser.displayErrorHtml(`
      <h1>Could not register app.</h1>
      <p>App ${matches.name} already registered</p>
      <pre><code class="language-json">${JSON.stringify(
        existingConfig,
        null,
        2
      )}</code></pre>
      <br/>
      <p>Say <command>edit app config</command> to edit the config.</p> If you make manual changes, be sure to run <command>build commands</command> afterwards, or run <code>npm run dev</code>.
  `);
    return;
  }

  const DEFAULT_NEW_APP_CONFIG: AppConfig = {
    appNameId: appNameId,
    spokenName: [matches.name],
    searchName: systemName,
    systemName: systemName,
    path: path.normalize(systemPath),
    focusSettleTime: config["appConfig.defaultFocusDelay"],
    launchSettleTime: config["appConfig.defaultLaunchDelay"],
    launchType: config["appConfig.defaultLaunchType"],
    focusType: config["appConfig.defaultFocusType"],
  };

  await appsApi.add(matches.name, DEFAULT_NEW_APP_CONFIG, { sort: true });
  await browser.displaySuccessHtml(`
    <h1>Registered: <span class="text-2xl rainbow">${appNameId}</span></h1>
    <p><span class="font-semibold">Next steps:</span> Test that <command>open ${
      matches.name
    }</command>, <command>launch ${
    matches.name
  }</command>, and <command>focus ${matches.name}</command> work correctly. 
  <p>If something isn't working correctly or the name is wrong, then you can edit/customize the app config</p>
    <h2>App Config</h2>
    <codeblock>${JSON.stringify(DEFAULT_NEW_APP_CONFIG, null, 2)}</codeblock>
    <p class="flex gap-2"><command>${
      config["commands.apps.editCommands"]
    }</command><command>${
    config["commands.apps.editAppConfig"]
  }</command><command>show help app config</command></p>
    `);
});

entriesOf(appsApi.getAllSync()).forEach(([appNameId, appConfig]) => {
  appConfig.spokenName.forEach((name) => {
    command(
      config["commands.apps.focusOrLaunch"](name),
      async (api) => {
        await launcher[appNameId].focusOrLaunch(api);
      },
      { autoExecute: true }
    );

    if (config.focusCommandsEnabled) {
      command(
        config["commands.apps.focus"](name),
        async (api) => {
          await launcher[appNameId].focus(api);
        },
        { autoExecute: true }
      );
    }

    if (config.launchCommandsEnabled) {
      command(
        config["commands.apps.launch"](name),
        async (api) => {
          await launcher[appNameId].launch(api);
        },
        { autoExecute: true }
      );
    }
  });
});

command(config["commands.apps.showCommands"], async (api) => {
  const appConfig = await getActiveAppConfig(api);
  if (appConfig) {
    const dataPath = path.join(commandsPath, `${appConfig.appNameId}.json`);
    if (fs.existsSync(dataPath)) {
      await browser.displayCommands(appConfig.appNameId);
    } else {
      await browser.displayHtml(`
        <h1>No commands found for <rainbow>${appConfig.appNameId}</rainbow></h1>
        Say <command>edit app commands</command> to create a commands file.
        <hr />
        <h2>Already have commands?</h2>
        Link them to the app by saying <command>${config["commands.apps.editAppConfig"]}</command>
        <p class="mt-4"><code>appNameId</code> should match <code>src/apps/appNameId[.ts|.js]</code> and <code>sx.app("appNameId")</code></p>
        <hr />
        <p class="mt-4">Make sure to build your commands after you create them using <command>build commands</command> or <code>npm run build</code> or <code>npm run dev</code></p>
      `);
    }
  } else {
    await browser.displayWarningHtml(`
    <h3>Could not show app commands</h3>
    <h4>App not registered</h4>
    <div>
    Focus the app again, then say <command>register app <name></command> to register the app.
    </div>`);
  }
});

command(config["commands.apps.editCommands"], async (api) => {
  const appConfig = await getActiveAppConfig(api);
  if (!appConfig) {
    await browser.displayWarningHtml(`
    <h3>Could not edit app commands</h3>
    <h4>App not registered</h4>
    <div>
    Focus the app again, then say <command>register app <name></command> to register the app.
    </div>`);
    return;
  }
  const workspacePath = config.vsCodeWorkspacePath;
  await openPathInVSCode(workspacePath);
  const [filePath, createdNewFile] = await getOrCreateApp(appConfig);
  await openPathInVSCode(filePath);
});

command(
  config["commands.apps.showAllCommands"],
  async (api) => {
    await browser.displayCommands("all");
  },
  { autoExecute: true }
);

command(
  config["commands.apps.showGlobalCommands"],
  async (api) => {
    await browser.displayCommands("global");
  },
  { autoExecute: true }
);

command(
  config["commands.apps.editAppConfig"],
  async (api) => {
    await openPathInVSCode(config.vsCodeWorkspacePath);
    await openPathInVSCode(appsDataPath);
  },
  { autoExecute: true }
);

command(
  config["commands.apps.showAppConfig"],
  async (api) => {
    await browser.open(appsDataPath);
  },
  { autoExecute: true }
);
