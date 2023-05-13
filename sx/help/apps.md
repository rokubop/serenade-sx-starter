## Apps

*show help* *page down* *page up* *down <num>* *up <num>*

### To register an app:
1. Focus an app
2. Say *{{commands.apps.register[0]}}*
3. Done! App config added to `user-data/apps.json`.

#### Next test that launch commands work as expected
Say *{{commands.apps.launch[0]}}*, *{{commands.apps.focus[0]}}* or *{{commands.apps.focusOrLaunch[0]}}*

If it is not working or you want to change something, then say *{{commands.apps.editAppConfig[0]}}*

*{{show help app config}}*

---

### To start editing / adding commands:
Say *{{commands.apps.editCommands[0]}}*

This will open `src/apps/<appNameId>[.ts|.js]` in VSCode if it exists. If it doesn't exist, it will create it for you.

> This requires 'code' in your PATH. In VSCode, open the command palette (CMD+Shift+P on Mac and CTRL+Shift+P on Windows) and run `Install 'code' command in PATH`

### To view all commands for current app:
Say *{{commands.apps.showCommands[0]}}*. This will display all commands for the current app in the browser.

| Command | Description
| --- | --- |
| *{{commands.apps.register}}* | Register the focused app. Creates an entry in `user-data/apps.json`. |
| *{{commands.apps.editAppConfig}}* | Edit the config for the focused app in the browser |
| *{{commands.apps.editCommands}}* | Edit the commands for the focused app in the browser |
| *{{commands.apps.focusOrLaunch}}* | Focus or launch the app |
| *{{commands.apps.focus}}* | Focus the app |
| *{{commands.apps.launch}}* | Launch the app |
| *{{commands.apps.showCommands}}* | Show the commands for the focused app in the browser |
| *{{commands.apps.showAllCommands}}* | Show all commands in the browser |
| *{{commands.apps.showGlobalCommands}}* | Show all global commands in the browser |