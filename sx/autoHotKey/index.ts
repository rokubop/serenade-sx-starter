import { execa } from "execa";
import path from "path";
import browser from "sx/browser";

const autoHotkeyScripts = path.join(process.env.ROOT_DIR, "sx", "autoHotKey");

const v1ScriptsDir = path.join(autoHotkeyScripts, "v1");
const v2ScriptsDir = path.join(autoHotkeyScripts, "v2");
const pressKeyAhkScript = path.join(v2ScriptsDir, "pressKey.ahk");
const holdKeyAhkScript = path.join(v2ScriptsDir, "holdKey.ahk");

export const click = async (
  key: "left" | "right" | "middle",
  modifiers: Modifiers[] = [],
  count = 1,
  delayInterval = 0
) => {
  const mappedKey =
    key === "left" ? "LButton" : key === "right" ? "RButton" : "MButton";
  const mappedModifiers = mapModifiers(modifiers);
  const args = [
    mappedKey,
    String(count),
    String(delayInterval),
    ...mappedModifiers,
  ];
  await runAutoHotkeyScriptV2(pressKeyAhkScript, args);
};

export const pressKey = async (
  key: Key,
  modifiers: Modifiers[] = [],
  count = 1,
  delayInterval = 0
) => {
  const mappedModifiers = mapModifiers(modifiers);
  const args = [key, String(count), String(delayInterval), ...mappedModifiers];
  await runAutoHotkeyScriptV2(pressKeyAhkScript, args);
};

export const holdKey = async (
  key: Key,
  modifiers: Modifiers[] = [],
  duration = 1000
) => {
  const mappedModifiers = mapModifiers(modifiers);
  const delayInterval = "0";
  const args = [key, String(duration), ...mappedModifiers];
  await runAutoHotkeyScriptV2(holdKeyAhkScript, args);
};

export const scroll = async (
  direction: "up" | "down",
  modifiers: Modifiers[] = [],
  count = 1
) => {
  const key = direction === "up" ? "WheelUp" : "WheelDown";
  const mappedModifiers = mapModifiers(modifiers);
  const delayInterval = "30";
  const args = [key, String(count), delayInterval, ...mappedModifiers];
  await runAutoHotkeyScriptV2(pressKeyAhkScript, args);
};

async function runAutoHotkeyScript(
  exePath: string,
  fileName: string,
  params: string[] = [],
  options?: any
) {
  if (exePath && fileName) {
    await execa(exePath, [`${fileName}`, ...params], options);
  } else {
    await browser.displayErrorHtml(`
      <h2>Tried to run AutoHotkey script but could not find exe or path.</h2>
      <command>show help autoHotKey</command>
    `);
    console.log(
      "Tried to run AutoHotkey script but could not find exe or path."
    );
  }
}

export async function runAutoHotkeyScriptV1(
  filePath: string,
  params: string[] = [],
  options?: any
) {
  const exePath = process.env.AUTOHOTKEY_V1_EXE_PATH as string;
  await runAutoHotkeyScript(exePath, filePath, params, options);
}

export async function runAutoHotkeyScriptV2(
  filePath: string,
  params: string[] = [],
  options?: any
) {
  const exePath = process.env.AUTOHOTKEY_V2_EXE_PATH as string;
  await runAutoHotkeyScript(exePath, filePath, params, options);
}

const modifiers = [
  "LWin",
  "RWin",
  "Control",
  "Ctrl",
  "Alt",
  "Shift",
  "LControl",
  "LCtrl",
  "RControl",
  "RCtrl",
  "LShift",
  "RShift",
  "LAlt",
  "RAlt",
  "CapsLock",
] as const;

const mouse = [
  "LButton",
  "MButton",
  "RButton",
  "WheelDown",
  "WheelUp",
] as const;

const numpad = [
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "NumpadDot",
  "NumpadDiv",
  "NumpadMult",
  "NumpadSub",
  "NumpadAdd",
  "NumpadEnter",
  "NumLock",
] as const;

const fKeys = [
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
] as const;

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const keys = [
  ...modifiers,
  ...mouse,
  ...numpad,
  ...fKeys,
  ...letters,
  ...numbers,
  "Space",
  "Tab",
  "Enter",
  "Esc",
  "Escape",
  "Backspace",
  "ScrollLock",
  "Delete",
  "Insert",
  "Home",
  "End",
  "PgUp",
  "PgDn",
  "Up",
  "Down",
  "Left",
  "Right",
  "PrintScreen",
  "Pause",
  "AppsKey",
  "Sleep",
] as const;

export type Modifiers =
  | (typeof modifiers)[number]
  | Lowercase<(typeof modifiers)[number]>
  | "Win"
  | "win";
export type Key = (typeof keys)[number] | Lowercase<(typeof keys)[number]>;

const mapModifiers = (modifiers: Modifiers[]) => {
  return modifiers.map((m) => {
    if (m === "win" || m === "Win") {
      return "LWin";
    }
    return m;
  });
};

export default {
  pressKey,
  holdKey,
  click,
  scroll,
  runAutoHotkeyScriptV1,
  runAutoHotkeyScriptV2,
};
