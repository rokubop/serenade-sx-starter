import fs from "fs-extra";
import path from "path";
import git from "simple-git";

/**
 * Updates or creates ../serenade-sx-example-public to be ready
 * for a git commit to serenade-sx-example. Copies all relevent
 * files from this repository and omits all others.
 */
const currentDir = process.cwd();
const outDir = path.join(currentDir, "..", "serenade-sx-example-public");
fs.ensureDir(outDir);

const filesToFilter = (filePath) => {
  const parts = filePath.split(path.sep);
  return parts.some(
    (part) =>
      /^user-data/.test(filePath) ||
      filePath.includes("dev") ||
      filePath.includes("private") ||
      filePath.includes(".env")
  );
};

const emptyDirExceptGit = async (dir) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file !== ".git") {
      await fs.remove(path.join(dir, file));
    }
  }
};

await emptyDirExceptGit(outDir);

let jsonFiles = [];

const syncRepos = async () => {
  // Find all files in the private repository, excluding private files and folders
  const privateRepo = git(currentDir);
  const trackedFiles = await privateRepo.raw(["ls-files"]);
  const untrackedFiles = await privateRepo.raw([
    "ls-files",
    "--others",
    "--exclude=node_modules",
  ]);

  const filesToSync = [trackedFiles, untrackedFiles]
    .join("\n")
    .split("\n")
    .filter((filePath) => filePath && !filesToFilter(filePath));

  jsonFiles = filesToSync.filter((file) => {
    const ext = path.extname(file);
    return ext === ".json" && file.startsWith("src/");
  });

  for (const filePath of filesToSync) {
    const src = path.join(currentDir, filePath);
    const dest = path.join(outDir, filePath);

    if (fs.existsSync(src)) {
      await fs.ensureDir(path.dirname(dest));
      await fs.copy(src, dest);
    } else {
      console.error(`Error: ${src} does not exist`);
    }
  }
};

await syncRepos();

fs.mkdirSync(path.join(outDir, "user-data"), { recursive: true });
fs.mkdirSync(path.join(outDir, "src", "apps"), { recursive: true });

function removePrivateBlock() {
  const index = path.join(outDir, "src", "main.ts");

  fs.readFile(index, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const privateBlockRegex =
      /[\n\r]?\/\/ @private-start[\s\S]*?\/\/ @private-end[\n\r]*/;
    const exampleStart = /[\n\r]?\/\/ @example-start[\n\r]*/;
    const exampleEnd = /[\n\r]?\/\/ @example-end[\n\r]*/;
    const updatedData = data
      .replace(privateBlockRegex, "")
      .replace(exampleStart, "")
      .replace(exampleEnd, "");

    if (data === updatedData) {
      console.error("Unable to locate the private block");
      return;
    }

    fs.writeFile(index, updatedData, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

removePrivateBlock();

function replaceWithEmptySxConfig() {
  const sxConfigTemplate = path.join(
    currentDir,
    "sx",
    "templates",
    "sx-config-template.ts"
  );
  const outSxConfig = path.join(outDir, "src", "sx-config.ts");

  fs.copyFileSync(sxConfigTemplate, outSxConfig);
}

replaceWithEmptySxConfig();

function stripJsonFiles() {
  jsonFiles.forEach((file) => {
    const jsonData = JSON.stringify({});
    fs.writeFileSync(path.join(outDir, file), jsonData);
  });
}

stripJsonFiles();

console.log(`Successfully built public repo at ${outDir}`);
