import { execa } from "execa";
import { debounce, isLinux, isMac, isWindows } from "./utils";

/**
 * equivalent to `npm run build` in the root directory
 *
 * call this after making any file changes programatically
 */
export async function npmRunBuild() {
  await debounce(async () => {
    console.log('Running "npm run build" in the root directory');
    if (isWindows()) {
      void execa("powershell.exe", [
        "npm",
        "--prefix",
        process.env.ROOT_DIR,
        "run",
        "build",
      ]);
    } else {
      void execa("bash", [
        "-c",
        `npm --prefix ${process.env.ROOT_DIR} run build`,
      ]);
    }
  }, 100);
}
