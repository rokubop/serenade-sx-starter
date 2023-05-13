import * as dotenv from "dotenv";
dotenv.config();
import * as esbuild from "esbuild";
import path from "path";
import os from "os";
import fs from "fs";
const envConfig = dotenv.parse(fs.readFileSync(".env"));
const watch = process.argv.includes("--watch");
const logFile = path.join(os.homedir(), ".serenade", "serenade.log");
const outFile = path.join(os.homedir(), ".serenade", "scripts", "sx.min.js");

/**
 * Used for `npm run dev` and `npm run build`
 * sets `process.env.ROOT_DIR` to the current working directory
 * Transpiles and minifies to `~/.serenade/scripts/sx.min.js`
 */
const define = {
  "process.env.ROOT_DIR": JSON.stringify(process.cwd()),
};

for (const key in envConfig) {
  if (Object.prototype.hasOwnProperty.call(envConfig, key)) {
    define[`process.env.${key}`] = JSON.stringify(envConfig[key]);
  }
}

let config = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  minify: true,
  outfile: outFile,
  define,
};

const successMessage = () => {
  console.log(`Built: ${outFile}`);
  console.log(`Logs: ${logFile}`);
  console.log("");
  console.log("⚡ Done");
};

if (watch) {
  let ctx = await esbuild.context(config);
  await ctx.watch();
  successMessage();
  console.log("watching...");
} else {
  await esbuild
    .build(config)
    .then(() => {
      successMessage();
    })
    .catch(() => process.exit(1));
}
