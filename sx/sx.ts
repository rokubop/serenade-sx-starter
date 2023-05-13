import { appsApi, AppNameId } from "sx/user-data-api/apps/api";
import { CommandID, IsUnion, OrAnyString } from "sx/utils";
import { Api } from "sx/types";

interface Sx extends serenade.Serenade {
  global(): SxBuilder;
  app(appNameId: AppNameId | OrAnyString): SxBuilder;
  language(lang: string): SxBuilder;
}

type SxAnyScope = AppNameId | "global" | "all" | OrAnyString;

interface SxOptions extends serenade.Options {}

let cachedApi: Api;
let lastCommand: string;

const apps = appsApi.getAllSync();

/**
 * sx - serenade extended
 *
 * sx: drop in replacement for `serenade` that adds:
 * - allows for string | string[] as triggers
 * - reliable app launcher management
 * - apis for managing json files
 * - logs duplicate command warnings to serenade.log
 * - behaves the same as serenade - api is just a passthrough to serenade's api
 * @see https://serenade.ai/docs/api
 */
const sx: Sx = {
  ...serenade,
  global() {
    return sxBuilder("global", serenade.global());
  },
  app(appNameId) {
    return sxBuilder(
      appNameId,
      serenade.app(apps[appNameId] ? apps[appNameId].systemName : appNameId)
    );
  },
  language(lang) {
    return sxBuilder(lang, serenade.language(lang));
  },
};

type CommandMapItem = {
  trigger: string;
  scopeName: SxAnyScope;
  isEnabled: boolean;
  isSupended: boolean;
};

/**
 * map of all commands registered through sx
 */
const commandMap: Record<CommandID, CommandMapItem> = {};

/**
 * sets of all registered triggers
 *
 * use commandMap instead for full data of command+trigger
 */
const commandMapTriggers: {
  [appOrScopeName: string]: Map<string, CommandID>;
} = {
  /**
   * "all" category is flat map of all commands so that
   * we can check for duplicate commands across apps
   * when registering a "global" command
   */
  all: new Map(),
  global: new Map(),
};

const builders: {
  [appOrScopeName: string]: SxBuilder;
} = {};

interface SxCommand extends serenade.Command {
  <T extends string>(
    triggers: T | T[],
    callback: (
      api: Api,
      matches: Record<serenade.ExtractPlaceholders<T>, string>
    ) => void,
    options?: SxOptions
  ): IsUnion<T> extends true ? CommandID[] : CommandID;
}

interface SxSnippets extends serenade.Snippet {
  (triggers: string | string[], snippet: string, transform?: SxTransform):
    | CommandID
    | CommandID[];
}

interface SxBuilder extends serenade.Builder {
  /**
   * @param triggers voice trigger(s)
   * @param callback Function to be executed when the specified trigger is heard.
   * @param options Options for how this command is executed.
   *   - `autoExecute` - Whether to automatically execute the command when it is heard.
   *   - `chainable` - Whether to allow this command to be chained with other commands.
   * @returns The command ID.
   *
   * @see https://serenade.ai/docs/api#commandtrigger-callbackoptions
   */
  command: SxCommand;
  /**
   *
   * @param triggers command(s) with <%newline%>, <%cursor%>, <%mytext%> placeholders
   * @param snippet string output
   * @param transform - specify how to apply snippet (may not work)
   *
   * @example
   * sx.language("javascript").snippet("my snippet <%name%>",
   *    'sx.app("<%cursor%>").command("<%name%>", async (api,matches) => {<%newline%>});'
   * );
   *
   * @see
   * https://serenade.ai/docs/api#snippets
   */
  snippet: SxSnippets;
}

type SxTransform = serenade.Transform;

function wrappedCallback<
  TCallback extends serenade.CommandCallback<Trigger>,
  Trigger extends string
>(trigger: Trigger, callback: TCallback) {
  return async function (api: Api, matches: serenade.Matches<Trigger>) {
    cachedApi = api;
    lastCommand = trigger;
    return callback(api, matches);
  };
}

function checkDuplicateInScope(
  id: CommandID,
  trigger: string,
  scopeName: SxAnyScope
) {
  let hasDuplicate = commandMapTriggers[scopeName]?.has(trigger);
  if (hasDuplicate) {
    const foundId = commandMapTriggers[scopeName].get(trigger) as CommandID;
    if (
      id === foundId ||
      !commandMap[foundId].isEnabled ||
      commandMap[foundId].isSupended
    ) {
      hasDuplicate = false;
    }
  }
  return hasDuplicate;
}

function checkForDuplicateCommands(
  id: CommandID,
  trigger: string,
  scopeName: SxAnyScope
) {
  let check;

  if (scopeName === "global") {
    // rule: a global command should not have any duplicates
    check = checkDuplicateInScope(id, trigger, "all");
  } else {
    // rule: command should not have duplicate in its own scope
    // rule: command should not exist in both local scope and global scope
    check = checkDuplicateInScope(id, trigger, scopeName);
    check = check || checkDuplicateInScope(id, trigger, "global");
  }
  if (check) {
    console.log(
      `Warning: Duplicate command: "${trigger}" in scope: "${scopeName}"`
    );
  }
}

function sxBuilder(scopeName: SxAnyScope, serenadeBuilder: serenade.Builder) {
  if (!commandMapTriggers[scopeName]) {
    commandMapTriggers[scopeName] = new Map();
  }

  if (!builders[scopeName]) {
    builders[scopeName] = {
      ...serenadeBuilder,
      command: function (triggers, callback, opts: SxOptions) {
        let id = "" as CommandID;
        let ids: CommandID[] = [];

        if (typeof triggers === "string") {
          triggers = [triggers];
        }

        triggers.forEach((trigger) => {
          id = serenadeBuilder.command(
            trigger,
            wrappedCallback(trigger, callback),
            opts
          );
          ids.push(id);
          checkForDuplicateCommands(id, trigger, scopeName);
          commandMap[id] = {
            trigger,
            scopeName,
            isEnabled: true,
            isSupended: false,
          };
          commandMapTriggers[scopeName].set(trigger, id);
          commandMapTriggers["all"].set(trigger, id);
        });
        return ids?.length > 1 ? ids : id;
      },

      snippet: function (triggers, generated, transform) {
        let id = "" as CommandID;
        let ids: CommandID[] = [];
        if (typeof triggers === "string") {
          triggers = [triggers];
        }
        // TODO
        triggers.forEach((n) => {
          id = serenadeBuilder.snippet(n, generated, transform);
          ids.push(id);
        });
        return ids?.length > 1 ? ids : id;
      },

      enable: function (ids: CommandID | CommandID[]) {
        serenadeBuilder.enable(ids);

        if (typeof ids === "string") {
          ids = [ids];
        }

        ids.forEach((id) => {
          checkForDuplicateCommands(
            id,
            commandMap[id].trigger,
            commandMap[id].scopeName
          );
          commandMap[id].isEnabled = true;
        });
      },

      disable: function (ids: CommandID | CommandID[]) {
        serenadeBuilder.disable(ids);

        if (typeof ids === "string") {
          ids = [ids];
        }

        ids.forEach((id) => {
          commandMap[id].isEnabled = false;
        });
      },
    } as SxBuilder;
  }

  return builders[scopeName] as SxBuilder;
}

export default sx;
export type { SxBuilder, Sx, SxCommand, SxTransform, SxAnyScope };
export { commandMap, commandMapTriggers, cachedApi, lastCommand };
