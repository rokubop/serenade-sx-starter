import sx, { Api, browser } from "sx";
import { addPressKeyCommand } from ".";
import { commandifyText, getActiveAppConfig, runCommandSafe } from "sx/utils";
import {
  selectivelyDisableCommands,
  selectivelyEnableCommands,
} from "sx/modes";
import { getConfig } from "sx/config";

const config = getConfig();

const { command } = sx.global();

let commandName: string | null;
let key: string | null;
let modifiers: string[] | null;
let iteration = 1;

function stop() {
  console.log("Stopping recording hotkey");
  iteration = 1;
  commandName = null;
  key = null;
  modifiers = null;
  selectivelyDisableCommands(captureAnyCommand, "<%text%>");
  sx.global().enable(addHotkeyCommand);
}

const captureAnyCommand = sx.global().command(
  "<%text%>",
  async (api, matches) => {
    if (config["commands.hotkeys.cancel"].includes(matches.text)) {
      stop();
      return;
    }
    if (iteration === 1) {
      // this iteration: user says the key combo e.g. "press shift a"
      iteration++;
      let pressKeyCommand = commandifyText(matches.text);
      console.log(`heard ${pressKeyCommand}`);
      const pattern = /^press .+$/i;
      if (pattern.test(pressKeyCommand)) {
        const keyCombo = pressKeyCommand.replace("press ", "");
        const keyComboParts = keyCombo.split(" ");
        key = keyComboParts[keyComboParts.length - 1];
        modifiers = keyComboParts.slice(0, keyComboParts.length - 1);
        await runActualCommandInsteadOfCapture(api, pressKeyCommand);
      } else {
        await browser.displayErrorHtml(
          `
          <h2>Could not record hotkey</h2>
          <h3>Command did not match <code>press *</code></h3>
          <p>Only simple hotkeys are supported that start with "press". modifiers like "shift", "command", etc. are OK too.</p>
          <command>show help hotkeys</command>
        `,
          {
            commandRan: config["commands.hotkeys.new"][0],
          }
        );
        console.log(
          `Could not record hotkey. To record a hotkey, say 
1. 'add hotkey' or 'add shortcut', 
2. 'press shift a' (example must include 'press'), 
3. 'name of command'
Only simple hotkeys are supported.`
        );
        stop();
        return;
      }
      selectivelyEnableCommands(captureAnyCommand, "<%text%>");
    } else if (iteration === 2) {
      // this iteration: user says "name of command"
      iteration++;
      commandName = commandifyText(matches.text);
      console.log(`heard ${commandName}`);
      if (commandName && key && modifiers) {
        await addPressKeyCommand(api, commandName, key, modifiers);
        console.log("Added hotkey. Say 'Edit commands' to view/edit it");
        stop();
      }
    } else {
      iteration++;
      stop();
    }
  },
  { autoExecute: true }
);
sx.global().disable(captureAnyCommand);

const addHotkeyCommand = command(
  config["commands.hotkeys.new"],
  async (api) => {
    const appConfig = await getActiveAppConfig(api);
    if (!appConfig) {
      await browser.displayErrorHtml(`
<h2>Cannot record hotkey because the app needs to be registered first.</h2>
<p>Focus the app then say <command>${config["commands.apps.register"]}</command> to register the app.</p>
<command>Show help apps</command>
      `);
      console.log(
        "Cannot save mouse position because the app needs to be registered first."
      );
      console.log(`Say "Register app <name>" to register the app.`);
      return;
    }
    console.log(
      'Recording hotkey. Say "stop" or "cancel" to stop. Next steps: Expecting "press shift a" (example), followed by "name of command"'
    );
    iteration = 1;
    commandName = null;
    key = null;
    modifiers = null;
    sx.global().disable(addHotkeyCommand);
    selectivelyEnableCommands(captureAnyCommand, "<%text%>");
  }
);

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
    console.log("error: ", e);
  }
  await api.delay(100);
  sx.global().enable(captureAnyCommand);
}
