import { isLinux, isMac, isWindows, sleep } from "sx/utils";
import { execa } from "execa";
import { cachedApi } from "sx";

async function getClipboard() {
  if (isWindows()) {
    const { stdout } = await execa("powershell.exe", ["Get-Clipboard"]);
    return stdout || "";
  } else if (isMac()) {
    const { stdout } = await execa("pbpaste");
    return stdout || "";
  } else if (isLinux()) {
    const { stdout } = await execa("xclip", ["-selection", "clipboard", "-o"]);
    return stdout || "";
  } else {
    throw new Error("Clipboard for OS not implemented");
  }
}

async function setClipboard(value: string, options = { stringify: true }) {
  const val = options.stringify ? JSON.stringify(value) : value;
  if (isWindows()) {
    await execa("powershell.exe", ["Set-Clipboard", "-Value", val]);
  } else if (isMac()) {
    await execa("pbcopy", {
      input: val,
    });
  } else if (isLinux()) {
    await execa("xclip", ["-selection", "clipboard", "-i"], {
      input: val,
    });
  } else {
    throw new Error("Clipboard for OS not implemented");
  }
}

async function copy() {
  await cachedApi?.pressKey("c", ["commandOrControl"]);
}

async function paste() {
  await cachedApi?.pressKey("v", ["commandOrControl"]);
}

async function clipboardInjectAndPaste(
  currentValue: string,
  options = { stringify: false }
) {
  const prevVal = await getClipboard();
  await setClipboard(currentValue, options);
  await sleep(300);
  await paste();
  await setClipboard(prevVal);
}

export { getClipboard, setClipboard, clipboardInjectAndPaste, copy, paste };
export default {
  getClipboard,
  setClipboard,
  clipboardInjectAndPaste,
  copy,
  paste,
};
