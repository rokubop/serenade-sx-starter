## Macros

*show help* *page down* *page up* *down <num>* *up <num>*

> Macros are an experimental feature and may not always work as expected.
> May not work for asynchronus actions.
> Cannot pick from options "one", "two", "three" etc, so you must say the command perfectly.

Say *{{commands.macros.record[0]}}* to start recording a macro.

- If you are on a URL, the macro will automatically be saved for that URL.
- If you are not on a URL, the macro will be saved in cache for playback. You can optionally save this macro.

### Example 1 - URL macro
1. While browser has focus
2. *{{commands.macros.record[0]}}*
3. *press tab twice*
4. *press tab ten times*
5. *press space*
6. *stop*
7. Macro saved to initial URL. You can now run the macro by saying *{{commands.macros.play[0]}}* or *{{commands.macros.play[1]}}* anytime you are on that page.

You can say *{{commands.macros.urlEdit[0]}}* to edit the macro.

### Example 2 - General macro
1. While VSCode has focus
2. *{{commands.macros.record[0]}}*
3. *start of line*
4. *select second word*
5. *copy*
6. *down 3*
7. *start of line*
8. *paste*
9. *stop*
10. Macro saved to cache. You can now run the macro by saying *{{commands.macros.play[0]}}* or *{{commands.macros.playXTimes[0]}}*.

| Command | Description |
| --- | --- |
| {{commands.macros.record}} | Record a macro |
| {{commands.macros.stop}} | Stop recording a macro |
| {{commands.macros.play}} | Play a macro |
| {{commands.macros.playXTimes}} | Play a macro x times |
| {{commands.macros.edit}} | Edit the macros in the browser |
| {{commands.macros.urlEdit}} | Edit the url macros in the browser |

### Example:
| while on a URL | General purpose |
| --- | --- |
| "{{commands.macros.record[0]}}" | "{{commands.macros.record[0]}}" |
| "press tab twice" | "select next word" |
| "press tab ten times" | "copy" |
| "press space" | "end of line" |
| "stop" | "paste" |
| | "stop" |

1. "{{commands.macros.record[0]}}"
2. "press tab twice"
3. "press tab ten times"
4. "press space"
5. "stop"

Anytime you are on that URL
1. "{{commands.macros.play}}"