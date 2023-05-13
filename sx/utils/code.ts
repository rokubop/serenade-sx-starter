import { execa } from "execa";
import { isLinux, isMac, isWindows } from "./utils";
import browser from "sx/browser";

export async function isVSCodeInPath() {
  try {
    const command = process.platform === "win32" ? "where" : "which";
    const { stdout } = await execa(command, ["code"]);
    return stdout.includes("code");
  } catch {
    return false;
  }
}

export async function openPathInVSCode(path: string) {
  const hasCode = await isVSCodeInPath();

  if (!hasCode) {
    await browser.displayWarningHtml(`
        <h1>Could not find VS Code in PATH</h1>
        <div>
            <p>In VSCode, open the command palette (CMD+Shift+P on Mac and CTRL+Shift+P on Windows) and run <code>Install 'code' command in PATH</code></p>
        </div>
    `);
    return;
  }

  if (isWindows()) {
    await execa("code", [path]);
  } else if (isMac()) {
    await execa("open", ["-a", "Visual Studio Code", path]);
  } else if (isLinux()) {
    await execa("code", [path]);
  } else {
    await browser;
    throw new Error(
      "Opening file in VS Code for OS not implemented. Do you have 'code' command installed?"
    );
  }
}
