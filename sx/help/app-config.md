## App Config help

*show help* *show help apps* *show help app config*

| Key | Description
| --- | --- |
| `path` | serenade's `api.getActiveApplication()` |
| `appNameId` | primary ID - used for `src/apps/<appNameId>` and `sx.app("<appNameId>").` Should match. |
| `spokenName` | Used for *launch <name>*, *focus <name>*, *open <name>* |
| `searchName` | used if `launchType` is set to `"search"` |
| `systemName` | The actual name sent to `serenade.app()` |
| `focusSettleTime` | Additional delay added to `await launcher.<appNameId>.focus()` for user commands. |
| `launchSettleTime` | Additional delay added to `await launcher.<appNameId>.launch()` or `launcher.<appNameId>.focusOrLaunch()` for user commands. |
| `launchType` | Defaults are `default` or `search` (Windows only). You can add your own custom launchers in `sx-config.ts`. |
| `focusType` | Defaults to `default`. You can add your own custom launchers in `sx-config.ts`. |