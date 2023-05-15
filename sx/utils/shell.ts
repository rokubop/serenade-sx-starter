import { execa, ExecaReturnValue } from "execa";
import { debounce, isLinux, isMac, isWindows } from "./utils";

/**
 * equivalent to `npm run build` in the root directory
 *
 * call this after making any file changes programatically
 */
export async function npmRunBuild(): Promise<ExecaReturnValue<string>> {
  const childProcess = await debounce(async () => {
    console.log('Running "npm run build" in the root directory');
    if (isWindows()) {
      return await execa("powershell.exe", [
        "npm",
        "--prefix",
        process.env.ROOT_DIR,
        "run",
        "build",
      ]);
    } else {
      return await execa("bash", [
        "-c",
        `npm --prefix ${process.env.ROOT_DIR} run build`,
      ]);
    }
  }, 100);

  return childProcess;
}
