/**
 * Serenade API
 *
 * @see https://serenade.ai/docs/api
 */
declare namespace serenade {
  export interface Options {
    autoExecute?: boolean;
    chainable?: "none" | "any" | "firstOnly" | "lastOnly" | true;
  }

  export type Modifiers =
    | "alt"
    | "command"
    | "commandOrControl"
    | "control"
    | "ctrl"
    | "function"
    | "meta"
    | "option"
    | "shift"
    | "win"
    | "windows";

  export interface Api {
    /**
     * Trigger a mouse click.
     *
     * https://serenade.ai/docs/api/#clickbutton-count
     */
    click(button: "left" | "right" | "middle", count?: number): Promise<void>;
    /**
     * Click a native system button matching the given text. Currently macOS only.
     *
     * https://serenade.ai/docs/api/#clickbuttonbutton
     *
     */
    clickButton(button: string): Promise<void>;
    /**
     * @param timeout milliseconds
     */
    delay(timeout: number): Promise<void>;
    /**
     * Currently available only in Chrome. Remove keyboard focus from the first DOM element matching the given CSS selector string.
     *
     * https://serenade.ai/docs/api/#domblurselector
     */
    domBlur(selector: string): Promise<void>;
    /**
     * Currently available only in Chrome. Click on the first DOM element matching the given CSS selector string.
     *
     * https://serenade.ai/docs/api/#domclickselector
     */
    domClick(selector: string): Promise<void>;
    /**
     * Currently available only in Chrome. Copy to the clipboard all of the text contained within the first DOM element matching the given CSS selector string.
     *
     * https://serenade.ai/docs/api/#domcopyselector
     */
    domCopy(selector: string): Promise<void>;
    /**
     * Currently available only in Chrome. Give keyboard focus the first DOM element matching the given CSS selector string.
     *
     * https://serenade.ai/docs/api/#domfocusselector
     */
    domFocus(selector: string): Promise<void>;
    /**
     * Currently available only in Chrome. Scrolls to the first DOM element matching the given CSS selector string.
     *
     * https://serenade.ai/docs/api/#domscrollselector
     */
    domScroll(selector: string): Promise<void>;
    /**
     * Currently available only on VS Code. Evaluate a command inside of a plugin. On VS Code, the command argument is passed to vscode.commands.executeCommand.
     *
     * https://serenade.ai/docs/api/#evaluateinplugincommand
     */
    evaluateInPlugin(command: string): Promise<any>;
    /**
     * Bring an application to the foreground.
     *
     * https://serenade.ai/docs/api/#focusapplicationapplication
     */
    focusApplication(application: string): Promise<void>;
    /**
     * Should focus or launch an application. Not included in docs.
     */
    focusOrLaunchApplication(application: string): Promise<void>;
    /**
     * Get the path of the currently-active application.
     *
     * https://serenade.ai/docs/api/#getactiveapplication
     */

    getActiveApplication(): Promise<string>;
    /**
     * Get a list of all of the buttons that can currently be clicked (i.e., are visible in the active application). Currently macOS only.
     *
     * https://serenade.ai/docs/api/#getclickablebuttons
     */
    getClickableButtons(): Promise<string[]>;
    /**
     * Get a list of applications installed on the system.
     *
     * https://serenade.ai/docs/api/#getinstalledapplications
     */
    getInstalledApplications(): Promise<string[]>;
    /**
     * Get the current mouse coordinates.
     *
     * https://serenade.ai/docs/api/#getmouselocation
     */
    getMouseLocation(): Promise<{ x: number; y: number }>;
    /**
     * Get a list of currently-running applications
     *
     * https://serenade.ai/docs/api/#getrunningapplications
     */
    getRunningApplications(): Promise<string[]>;
    /**
     * Launch an application.
     *
     * https://serenade.ai/docs/api/#launchapplicationapplication
     */
    launchApplication(application: string): Promise<void>;
    /**
     * Press the mouse down.
     *
     * https://serenade.ai/docs/api/#mousedownbutton
     */
    mouseDown(button: "left" | "right" | "middle"): Promise<void>;
    /**
     * Release a mouse press.
     *
     * https://serenade.ai/docs/api/#mouseupbutton
     */
    mouseUp(button: "left" | "right" | "middle"): Promise<void>;
    /**
     * Press a key on the keyboard, optionally while holding down other keys.
     *
     * https://serenade.ai/docs/api/#presskeykey-modifierscount
     */
    pressKey(
      key: string,
      modifiers?: Modifiers[],
      count?: number
    ): Promise<void>;
    /**
     * Quit an application.
     *
     * https://serenade.ai/docs/api/#quitapplicationapplication
     */
    quitApplication(application: string): Promise<void>;
    /**
     * Execute a voice command.
     *
     * https://serenade.ai/docs/api/#runcommandcommand
     */
    runCommand(command: string): Promise<void>;
    /**
     * Run a command at the shell.
     *
     * https://serenade.ai/docs/api/#runshellcommand-argsoptionscallback
     */
    runShell(
      command: string,
      args?: string[],
      options?: RunShellOptions,
      callback?: (stdout: string, stderr: string) => void
    ): Promise<{ stdout: string; stderr: string }>;
    /**
     * Move the mouse to the given coordinates, with the origin at the top-left of the screen.
     *
     * https://serenade.ai/docs/api/#setmouselocationx-y
     */
    setMouseLocation(x: number, y: number): Promise<void>;
    /**
     * Type a string of text.
     *
     * https://serenade.ai/docs/api/#typetexttext
     */
    typeText(text: string): Promise<void>;
  }

  interface StdioOptionsArray extends Array<StdioOptions> {}

  type StdioOptions =
    | StdioOptionsArray
    | "inherit"
    | "ignore"
    | "pipe"
    | null
    | undefined;

  export interface RunShellOptions {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    stdio?: StdioOptions;
    detached?: boolean;
    shell?: boolean | string;
    [key: string]: any;
  }

  type Matches<T extends string> = Record<ExtractPlaceholders<T>, string>;

  type Brand<T, B> = T & { __brand: B };

  /**
   * Serenade command ID
   *
   * Use `as CommandID` if something should be a command ID.
   */
  type CommandID = Brand<string, "CommandId">;

  export interface CommandCallback<T extends string> {
    (api: Api, matches: Matches<T>): void;
  }

  export type Transform =
    | "inline"
    | "argument"
    | "argument"
    | "attribute"
    | "catch"
    | "class"
    | "decorator"
    | "element"
    | "else"
    | "else_if"
    | "entry"
    | "enum"
    | "extends"
    | "finally"
    | "function"
    | "import"
    | "method"
    | "parameter"
    | "return_value"
    | "ruleset"
    | "statement"
    | "tag";

  export type ExtractPlaceholders<T extends string> =
    T extends `${infer Before}<%${infer Name}%>${infer After}`
      ? ExtractPlaceholders<Before> | Name | ExtractPlaceholders<After>
      : never;

  export interface Command {
    <T extends string>(
      trigger: T,
      callback: (
        api: Api,
        matches: Record<ExtractPlaceholders<T>, string>
      ) => unknown,
      options?: Options
    ): CommandID;
  }

  export interface Snippet {
    (templated: string, generated: string, transform?: Transform): CommandID;
  }

  export interface Builder {
    /**
     * https://serenade.ai/docs/api#commandtrigger-callbackoptions
     */
    command: Command;
    disable(ids: CommandID | CommandID[]): void;
    enable(ids: CommandID | CommandID[]): void;
    key(
      trigger: string,
      key: string,
      modifiers?: Modifiers[],
      options?: Options
    ): CommandID;
    hint(word: string): CommandID;
    pronounce(before: string, after: string, disabled?: boolean): CommandID;
    snippet: Snippet;
    text(trigger: string, text: string, options?: Options): CommandID;
  }

  export interface Serenade {
    app(application: string | string[]): Builder;
    global(): Builder;
    language(language: string | string[]): Builder;
    extension(extension: string | string[]): Builder;
    url(url: string | string[]): Builder;
    word(word: string): Builder;
    hint(hint: string): Builder;
  }

  export function app(application: string | string[]): Builder;
  export function global(): Builder;
  export function language(language: string | string[]): Builder;
  export function extension(extension: string | string[]): Builder;
  export function url(url: string | string[]): Builder;
  export function word(word: string): Builder;
  export function hint(hint: string): Builder;
}
