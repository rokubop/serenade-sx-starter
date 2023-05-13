## AutoHotKey (Windows only) 

*show help* *page down* *page up* *down <num>* *up <num>*

AutoHotKey helps with missing serenade key combos or when serenade's pressKey is not working,
as well as other features for interacting with the system.

`sx` provides an `autoHotKey` api to interact with AutoHotKey

Download (Windows only): [https://www.autohotkey.com/](https://www.autohotkey.com/)

### Requirements
- Install AutoHotKey v2
- set your `AUTOHOTKEY_V2_EXE_PATH` in `.env` file

AutoHotKey has different syntax for v1 and v2 scripts.
You get two .exe files when you download AutoHotKey - v1 and v2
Be careful to use the right .exe for the right script.

```js
import { autoHotKey } from 'sx'

await autoHotKey.pressKey("Left", ["LWin", "Shift"]);
await autoHotKey.holdKey("RButton", ["Alt"], 1000);
await autoHotKey.click("left", ["Ctrl"], 2);
await autoHotKey.scroll("down", [], 6);
await autoHotKey.runAutoHotkeyScriptV2(path.join(process.env.ROOT_DIR, "src", "autoHotKey", "v2", "test.ahk"), ["param1", "param2"]);
await autoHotKey.runAutoHotkeyScriptV1(path.join(process.env.ROOT_DIR, "src", "autoHotKey", "v1", "test.ahk"), ["param1", "param2"]);
```

---

### Example:
Here is an example of a full file for sx AutoHotKey commands: [https://github.com/rokubop/serenade-sx-example/blob/main/src/global/autoHotkey.ts](https://github.com/rokubop/serenade-sx-example/blob/main/src/global/autoHotkey.ts)


---

| Function | Description |
| --- | --- |
| `autoHotKey.pressKey(key[, modifiers][, count])` | press a key |
| `autoHotKey.holdKey(key[, modifiers][, duration])` | hold a key |
| `autoHotKey.click(button[, modifiers][, count])` | click the mouse |
| `autoHotKey.scroll(direction[, modifiers][, count])` | scroll the mouse |
| `autoHotKey.runAutoHotkeyScriptV1(absolutePath: string, params: string[])` |  run a V1 version `.ahk` script file |
| `autoHotKey.runAutoHotkeyScriptV2(absolutePath: string, params: string[])` | run a V2 version `.ahk` script file

---

### Third party

You can also find AutoHotKey scripts online: [https://www.autohotkey.com/docs/v2/scripts/](https://www.autohotkey.com/docs/v2/scripts/)

---

### types 

```js
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
```