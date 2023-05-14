import sx, { Api, cachedApi } from "sx";
import { macrosApi, urlMacrosApi } from "./api";
import browser from "sx/browser";
import { getConfig } from "sx/config";
import {
  selectivelyDisableCommands,
  selectivelyEnableCommands,
} from "sx/modes";
import {
  commandifyText,
  forEachKeyVal,
  isAppActive,
  openPathInVSCode,
  runCommandSafe,
  timesMap10,
} from "sx/utils";
import { macrosDataPath, urlMacrosDataPath } from "sx/file-paths";

const config = getConfig();
/**
 * Example 1
 * 1. "record macro"
 * 2. "up"
 * 3. "down"
 * 4. "left"
 * 5. "right"
 * 6. "start of block"
 * 7. "add parameter api"
 * 8. "delete api"
 * 9. "end of block"
 * 10. "stop recording"
 * --------------------
 * 11. "play macro"
 * --------------------
 * 12. "save macro <%name%>" (optional)
 *
 * Example 2
 * 1. "record page macro" (browser)
 * 2. "tab twice"
 * 3. "tab"
 * 4. "press space"
 * 5. "tab twice"
 * 6. "enter"
 * 7. "stop recording"
 * --------------------
 * 8. "play page macro" or "next page" (any time you are on that URL)
 *
 */
let currentMacro: string[] = [];
let currentMacroName: string | null = null;
let currentPageMacroUrl: string | undefined | null = undefined;

const onMacroStart = async (name?: string) => {
  console.log("starting macro");
  currentMacro = [];
  currentMacroName = name || null;
  sx.global().disable(startMacroCommand);
  sx.global().disable(playMacro);
  selectivelyEnableCommands(stopMacroCommand, config["commands.macros.stop"]);
  selectivelyEnableCommands(captureAnyCommand, "<%text%>");
};

const onMacroStop = async () => {
  console.log("stopping macro");
  selectivelyDisableCommands(captureAnyCommand, "<%text%>");
  selectivelyDisableCommands(stopMacroCommand, config["commands.macros.stop"]);
  sx.global().enable(startMacroCommand);
  sx.global().enable(playMacro);
  if (currentMacroName) {
    console.log(`recorded macro: ${currentMacroName}`);
    await macrosApi.update(currentMacroName, currentMacro);
  } else if (currentPageMacroUrl) {
    console.log(`recorded macro: ${currentMacroName}`);
    await urlMacrosApi.update(currentPageMacroUrl, currentMacro);
  }
  await browser.displaySuccessHtml(
    `
    <h1>Macro recorded to cache</h1>
    <codeblock>${currentMacro}</codeblock>
    <p>To playback the macro say <command>${
      config["commands.macros.play"][0]
    }</command> or <command>${config["commands.macros.playXTimes"](
      "&lt;num> times"
    )}</command></p>
    `,
    {
      commandRan: config["commands.macros.record"][0],
    }
  );
};

let startMacroCommand = sx.global().command(
  config["commands.macros.record"],
  async (api) => {
    if (await isAppActive(api, config.defaultBrowser)) {
      currentPageMacroUrl = await browser.getUrl(api);
    }
    await onMacroStart();
  },
  { autoExecute: true }
);

let stopMacroCommand = sx.global().command(
  config["commands.macros.stop"],
  async (api) => {
    await onMacroStop();
  },
  { autoExecute: true }
);
sx.global().disable(stopMacroCommand);

const captureAnyCommand = sx.global().command(
  "<%text%>",
  async (api, matches) => {
    console.log("macro: ", currentMacro);
    const literalCommand = commandifyText(matches.text);
    if (config["commands.macros.stop"].includes(literalCommand)) {
      void onMacroStop();
      return;
    }
    currentMacro.push(literalCommand);
    await preventInfiniteLoop();
    await runActualCommandInsteadOfCapture(api, literalCommand);
  },
  { autoExecute: true }
);
sx.global().disable(captureAnyCommand);

async function preventInfiniteLoop() {
  if (currentMacro.length > 30) {
    void onMacroStop();
    await browser.displayErrorHtml(
      `
      <p>There was an error trying to record the macro - stopping macro - sorry! Try again</p>
      <p><command>show help macros</command></p>
    `,
      { commandRan: config["commands.macros.record"][0] }
    );
    throw new Error(
      "infinite loop detected - stopping macro - sorry! Try again"
    );
  }
}

async function runActualCommandInsteadOfCapture(
  api: Api,
  literalCommand: string
) {
  sx.global().disable(captureAnyCommand);
  await api.delay(100);
  try {
    console.log("running command: ", literalCommand);
    await runCommandSafe(api, literalCommand);
  } catch (e) {
    await browser.displayErrorHtml(
      `<p>Error while trying to record macro. running command: <command>${literalCommand}</command>. Stopping macro.</p>
      <p><command>show help macros</command></p>`,
      { commandRan: config["commands.macros.record"][0] }
    );
    console.log("error: ", e);
    await onMacroStop();
  }
  await api.delay(100);
  sx.global().enable(captureAnyCommand);
}

let playUrlMacro = async (api: Api) => {
  const urlPath = await browser.getUrl(api);
  const macro = urlMacrosApi.getSync(urlPath);
  if (macro?.length) {
    for (const command of macro) {
      await runCommandSafe(api, command);
      await api.delay(50);
    }
  } else {
    await browser.displayErrorHtml(`
      <h2>Macro not found</h2>
      <p>There is no macro for URL: <code>${urlPath}</code></p>
      <p><command>show help macros</command></p>
    `);
    console.log(
      `Tried to run macro, but there is no macro for URL: \n${urlPath}\nUse 'record page macro' to record a macro for this URL.`
    );
  }
};

let playMacro = sx
  .global()
  .command(config["commands.macros.play"], async (api) => {
    if (await isAppActive(api, config.defaultBrowser)) {
      await playUrlMacro(api);
    } else {
      if (currentMacro?.length) {
        for (let command of currentMacro) {
          await runCommandSafe(api, command);
          await api.delay(100);
        }
      }
    }
  });

forEachKeyVal(timesMap10, (xTimes, num) => {
  sx.global().command(
    config["commands.macros.playXTimes"](xTimes),
    async (api) => {
      if (currentMacro?.length) {
        for (let i = 0; i < Number(num); i++) {
          for (let command of currentMacro) {
            await runCommandSafe(api, command);
            await api.delay(100);
          }
        }
      }
    }
  );
});

sx.global().command(config["commands.macros.edit"], async (api) => {
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(macrosDataPath);
});

sx.global().command(config["commands.macros.urlEdit"], async (api) => {
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(urlMacrosDataPath);
});

sx.global().command(config["commands.macros.show"], async (api) => {
  await browser.open(macrosDataPath);
});

sx.global().command(config["commands.macros.urlShow"], async (api) => {
  await browser.open(urlMacrosDataPath);
});
