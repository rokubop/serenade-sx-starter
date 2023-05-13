## Utils

*show help* *page down* *page up* *down <num>* *up <num>*

```js
import { ... } from "sx/utils";
```

| Command | Description |
| --- | --- |
| commandifyText | Convert <%text%> back to the literal spoken text. So that it can be run back into `api.runCommand(...)` |
| debounce | Debounce a function so that it can only be called once every `delay` milliseconds |
| entriesOf | Type safe version of `Object.entries` |
| escapeText | Convert <%text%> to format that can be used for passing back into `api.runCommand("system ...")` |
| forEachKeyVal | For iterating object key/values with type safety |
| formatAsCamelCase | Convert a string to camel case. For example, "My App" becomes "myApp" |
| formatAsKebabCase | Convert a string to kebab case. For example, "My App" becomes "my-app" |
| formatAsNameId | Convert a string to AppNameId. For example, "My App" becomes "myapp" |
| formatAsOneWordLowerCase | Convert a string to one word lower case. For example, "My App" becomes "myapp" |
| formatForFileName | Format text so that it can be used as a file name |
| getActiveAppConfig | Get the active app config |
| isAppActive | Check if an app is active |
| isLinux | Check if the OS is Linux |
| isMac | Check if the OS is Mac |
| isWindows | Check if the OS is Windows |
| keysOf | Type safe version of `Object.keys` |
| npmRunBuild | Programatically run `npm run build` to build `~/.serenade/scripts/sx.min.js` |
| openPathInVSCode | Open a path in VSCode |
| removeNewlineChars | Remove newline characters from text |
| runCommandSafe | A safer version of `api.runCommand` that will timeout after 1 second |
| systemTypeCapitalSentence |  converts `matches.text` from `<%text%>` to "Sentence text" that can be typed anywhere. |
| systemTypeSentence | converts `matches.text` from `<%text%>` to "sentence text" that can be typed anywhere. |
