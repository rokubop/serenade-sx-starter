## Commands

*show help* *page down* *page up* *down <num>* *up <num>*

`sx` is a drop-in replacement for `serenade` - uses the same API, but also allows for an array of commands to be passed in and checks your commands for duplicates.

### Examples
```js
import sx from 'sx'
```
---
```js
sx.global().command(["hello world"], async (api) => {
  await api.typeText("Hello world");
});
```
---
```js
sx.global().command(["select all"], async (api) => {
  await api.pressKey("a", ["commandOrControl"]);
});
```

modifiers are: `"alt"`, `"command"`, `"commandOrControl"`, `"control"`, `"ctrl"`, `"function"`, `"meta"`, `"option"`, `"shift"`, `"win"`, `"windows"`

---
```js
sx.global().command(["wait"], async (api) => {
  await api.delay(1000);
  await api.typeText("waited 1 second");
});
```

---

```js
sx.global().command(["pick <%color%>"], async (api, matches) => {
  await api.typeText(`picked ${matches.color}`);
});
```

---

For VSCode commands
```js
sx.app("code").command(["sort lines"], async (api) => {
  await api.evaluateInPlugin("editor.action.sortLinesAscending");
});
```

This string `"editor.action.sortLinesAscending"` can be found by opening "Preferences: Open Keyboard Shortcuts" from the command palette, right clicking on a command, and selecting "Copy Command ID".

---
Display in browser *show help browser*
```js
import { browser } from 'sx'
```
---
```js
sx.global().command(["hello world"], async (api) => {
  await browser.displayHtml(`
<h1>Hello world</h1>
<div class="flex mt-4">Limited tailwind classes supported</div>
This is a <command>command</command> and this is <rainbow>Rainbow text</rainbow>
  `)
});
```
---
```js
sx.global().command(["hello world"], async (api) => {
  await browser.displayMarkdown(`
# Hello world
This is a *command*
Mostly all markdown syntax supported.
  `)
});
```
---
```js
sx.global().command(["open netflix"], async (api) => {
  await browser.open("https://netflix.com")
});
```

---
For windows users only (requires AutoHotKey v2) *show help autoHotKey*
```js
import { autoHotKey } from 'sx'
```
---
```js
sx.global().command(["hello world"], async (api) => {
  await autoHotKey.pressKey("win", ["shift", "ctrl"])
});
```
---

You can find serenade-sx example commands for VSCode, Chrome, AutoHotKey, git, npm, etc here:
[https://github.com/rokubop/serenade-sx-example](https://github.com/rokubop/serenade-sx-example/tree/main/src)

*show help* *show help browser*  *show help autoHotKey* *show help clipboard* *show help json api* *show help utils*

[https://serenade.ai/docs](https://serenade.ai/docs)

[https://serenade.ai/docs/api](https://serenade.ai/docs/api)