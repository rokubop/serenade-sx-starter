import sx, { browser } from "sx";
import { forEachKeyVal, getActiveAppConfig, openPathInVSCode } from "sx/utils";
import mousePositionsApi from "./api";
import { mousePositionsDataPath } from "sx/file-paths";
import { getConfig } from "sx/config";

const config = getConfig();
const { command } = sx.global();
/**
 * Prerequisite: You have registered the current
 *   app with "register app <%name%>"
 *
 * Example:
 * Hover your mouse over the top left "File" in VSCode
 * "new position file"
 *
 * Now you can do: (for current app)
 * "mouse file" - to move the mouse there
 * "click file" - to click there
 */
command(config["commands.mousePosition.addOrUpdate"], async (api, matches) => {
  const positionName = matches.name;
  const appConfig = await getActiveAppConfig(api);
  if (!appConfig) {
    await browser.displayErrorHtml(`
<h2>Cannot save mouse position because the app needs to be registered first.</h2>
<p>Focus the app then say <command>${config["commands.apps.register"]}</command> to register the app.</p>
<command>Show help apps</command>
    `);
    console.log(
      "Cannot save mouse position because the app needs to be registered first."
    );
    console.log(`Say "Register app <name>" to register the app.`);
    return;
  }
  const pos = await api.getMouseLocation();
  await mousePositionsApi.update(appConfig.appNameId, positionName, pos);
});

command(
  config["commands.mousePosition.addOrUpdateGlobalScope"],
  async (api, matches) => {
    const positionName = matches.name;
    const pos = await api.getMouseLocation();
    await mousePositionsApi.update("global", positionName, pos);
  }
);

forEachKeyVal(mousePositionsApi.getAllSync(), (appNameId, positions) => {
  forEachKeyVal(positions, (positionName, position) => {
    const scope = appNameId === "global" ? sx.global() : sx.app(appNameId);
    scope.command(
      config["commands.mousePosition.goTo"](positionName),
      async (api) => {
        await api.setMouseLocation(position.x, position.y);
      },
      { autoExecute: true }
    );

    scope.command(
      config["commands.mousePosition.goToAndClick"](positionName),
      async (api) => {
        const pos = await mousePositionsApi.get(appNameId, positionName);
        if (!pos) return;
        await api.setMouseLocation(position.x, position.y);
        await api.delay(100);
        await api.click("left");
      },
      { autoExecute: true }
    );
  });
});

command(config["commands.mousePosition.edit"], async (api) => {
  await openPathInVSCode(config.vsCodeWorkspacePath);
  await openPathInVSCode(mousePositionsDataPath);
});

command(
  config["commands.mousePosition.show"],
  async (api) => {
    await browser.open(mousePositionsDataPath);
  },
  { autoExecute: true }
);
