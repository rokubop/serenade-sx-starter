<p align="center">
    <img width="600" src="https://i.imgur.com/qdvEs2C.png"/>
</p>

---

This is a starter template for your serenade custom scripts using **serenade-sx**, which includes 60+ power commands and utilities

## Prerequisites
You have installed [Serenade](https://serenade.ai)

## Features
- Say "Show help" to see all features and documentation
- Bookmarks, macros, shortcuts, mouse positions, JSON API, browser display, clipboard, AutoHotKey api, and more

## Install

Clone this repository anywhere on your machine to your preferred folder name.

> Do not clone this folder to `.serenade/scripts`. 
> That is the output folder

After cloning, run the following commands in the root folder of this project:
```bash
npm install
```

First time setup:
```bash
npm run setup
```

Done! Say "Show help" to get started.

<img src="https://i.imgur.com/Io5pRZm.png"/>

---

You can find serenade-sx example commands for VSCode, Chrome, AutoHotKey, git, npm, etc here:
[https://github.com/rokubop/serenade-sx-example](https://github.com/rokubop/serenade-sx-example/tree/main/src)

---

## What is SX?
`sx` is a drop-in replacement for `serenade` that will keep track of your
commands and find duplicates. The API is the same as [serenade](https://serenade.ai/docs/api#api-reference), but also allows for passing in 
an array like this:

```js
import sx from "sx";

sx.global().command(["hello", "hello world"], async (api, matches) => {
  await api.typeText("hello world");
});
```

There are many utilities included with sx that will speed up your custom voice commands.

<img src="https://i.imgur.com/4gbNMBA.png"/>

## Folder structure
| Folder | Description |
| --- | --- |
| `scripts` | Scripts for building/deploying |
| `src` | All user files should go in here |
| `src/apps` | All app specific files should go here. This uses the convention of `src/apps/<AppNameId>` |
| `src/main` | Entry file. All commands must be imported here. |
| `src/sx‑config.ts` | Configure SX commands or preferences |
| `sx` | Treat this as a `node_module`. Try not to edit this directory, so that you can pull updates easily. Contributions are welcome using `npm run build-starter` |
| `user‑data` | This is where all your user data is stored. This includes your commands, mouse positions, and hotkeys. This is ignored by git in `.gitignore` |

## First commands

First, start by focusing an application and registering the app using "register app <name>"

**Why register apps?**

It allows for:
- Configure how focus/launch/open commands work to make sure it opens reliably
- Access to "edit commands" and "show commands"
- create and update mouse positions, hotkeys
- able to define aliases for apps (e.g. "chrome" for "google chrome")

<img src="https://i.imgur.com/Le25Ndx.png"/>

## Building commands

You must build commands before they are active. This is done by running
`npm run dev` to actively watch for changes, or `npm run build` to build once.
This will output a minified file to `~/.serenade/scripts/sx.min.js`. You can also say
"build commands"

---

"Show commands"

<img src="https://i.imgur.com/7XFbTVU.png"/>

---

## Javascript or Typescript?
You can use `.js` for your files, but it is recommended to use `.ts`. 
Writing your commands in typescript will give you error checking BEFORE
compiling, so your running serenade application will never crash due to a
syntax error.

## Using with existing commands
If you have existing commands in `~/.serenade/scripts`, they can exist 
side-by-side with the `~/.serenade/scripts/sx.min.js` file that will be output.

However moving your commands serenade-sx is recommended. This will allow your commands to be counted, able to see if there are any duplicates, and 
work with "show commands" and "edit commands". 

To move your commands, replace all instances of `serenade` with `sx` and
add this to the top of every file
```js
import sx from "sx";
```

In `src/main.ts` you must import the commands.
```js
// ----------------------------------------
// add new imports here
import "apps/chrome";
import "apps/<AppNameId>";
import "global/example"
import "example";
// @sx-dynamic-app-import
```

 `/src/apps/<AppNameId>[.js|.ts]` and `sx.app("<AppNameId>")` must match the configurable `AppNameId` when you register apps.

`npm run dev` or `npm run build` will output `~/.serenade/scripts/sx.min.js` and trigger serenade to pick up the new commands. 
