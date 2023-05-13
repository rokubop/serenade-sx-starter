import { commandMapTriggers } from "sx/sx";
import { Api } from "sx/types";

type Options = {
  exactMatch?: boolean;
};

/**
 * Safe version of api.runCommand
 *
 * `api.runCommand` can break serenade if passed arguments it doesnt recognize
 * such as punctuation, or if we try to execute a command that doesn't exist.
 *
 * - Will reject if command takes too long
 * - Will reject if exact match is set (`options.exactMatch`) and the command is not found
 */
export function runCommandSafe(
  api: Api,
  command: string,
  options: Options = { exactMatch: false }
) {
  return new Promise((resolve, reject) => {
    if (options.exactMatch && !commandMapTriggers["all"].has(command)) {
      console.log(`Command not found: ${command}`);
      resolve({
        message: `Exact match for command not found: ${command}`,
      });
      return;
    }
    api.runCommand(command).then(resolve).catch(reject);
    setTimeout(() => {
      reject(
        new Error(`Command timed out trying api.runCommand("${command}")`)
      );
    }, 1000);
  });
}
