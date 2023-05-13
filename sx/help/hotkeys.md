## Hotkeys

*show help* *show help macros*

1. Focus the application you want to record a hotkey for.
2. Say *{{commands.hotkeys.new[0]}}* to start recording a hotkey.
3. Say the command, such as *press g* or *press control b*. Commands must start with "press". Modifier keys are supported. 
4. Next say the name of command, such as *paint* or *toggle sidebar*
5. You've finished recording the hotkey. It has been appended to your app's commands file. 

You can edit the command by saying *{{commands.apps.editCommands}}*.
   
To cancel in the middle of a recording say *{{commands.hotkeys.cancel}}*.

| Command | Description |
| --- | --- |
| *{{commands.hotkeys.new}}* | Record a hotkey |
| *{{commands.hotkeys.cancel}}* | Stop recording a hotkey |

You can change these commands in `sx-config.ts`