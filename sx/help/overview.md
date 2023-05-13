# Serenade-SX Overview

*show help* *page down* *page up* *down <num>* *up <num>*

## What is SX?
`sx` is a drop-in replacement for `serenade` that will keep track of your
commands. The API is the same as [serenade](https://serenade.ai/docs/api#api-reference), but also allows for passing in 
an array like this:

```js
import sx from "sx";

sx.global().command(["hello", "hello world"], async (api, matches) => {
  await api.typeText("hello world");
});
```

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

First, start by focusing an application and registering the app using *{{commands.apps.register}}*

**Why register apps?**

It allows for:
- Configure how focus/launch/open commands work to make sure it opens reliably
- Access to *{{commands.apps.editCommands[0]}}* and *{{commands.apps.showCommands[0]}}*
- create and update mouse positions, hotkeys
- able to define aliases for apps (e.g. "chrome" for "google chrome")

## Building commands

You must build commands before they are active. This is done by running
`npm run dev` to actively watch for changes, or `npm run build` to build once.
This will output a minified file to `~/.serenade/scripts/sx.min.js`. You can also say
*build commands*

## Javascript or Typescript?
You can use `.js` for your files, but it is recommended to use `.ts`. 
Writing your commands in typescript will give you error checking BEFORE
compiling, so your running serenade application will never crash due to a
syntax error.

## Using with existing commands
If you have existing commands in `~/.serenade/scripts`, they can exist 
side-by-side with the `~/.serenade/scripts/sx.min.js` file that will be output.

However moving your commands serenade-sx is recommended. This will allow your commands to be counted, able to see if there are any duplicates, and 
work with *show commands* and *edit commands*. 

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

*show help*