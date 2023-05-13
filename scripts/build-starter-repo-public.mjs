import fs from "fs-extra";
import path from "path";
import git from "simple-git";

/**
 * Updates or creates ../serenade-sx-starter-public to be ready
 * for a git commit to serenade-sx-starter. Copies all relevent
 * files from this repository and omits all others.
 */
const currentDir = process.cwd();

const privateRepoPath = currentDir;
const publicRepoPath = path.join(
  currentDir,
  "..",
  "serenade-sx-starter-public"
);
fs.ensureDir(publicRepoPath);

const filesToFilter = (filePath) => {
  const parts = filePath.split(path.sep);
  return parts.some(
    (part) =>
      // any files in src/ except env.d.ts and main.ts
      /^src\/(?!env\.d\.ts$|main\.ts$).*/.test(filePath) ||
      /^user-data/.test(filePath) ||
      /^(references|\.vscode)/.test(filePath) ||
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

await emptyDirExceptGit(publicRepoPath);

let jsonFiles = [];

const syncRepos = async () => {
  // Find all files in the private repository, excluding private files and folders
  const privateRepo = git(privateRepoPath);
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
    const src = path.join(privateRepoPath, filePath);
    const dest = path.join(publicRepoPath, filePath);

    if (fs.existsSync(src)) {
      await fs.ensureDir(path.dirname(dest));
      await fs.copy(src, dest);
    } else {
      console.error(`Error: ${src} does not exist`);
    }
  }
};

await syncRepos();

fs.mkdirSync(path.join(publicRepoPath, "user-data"), { recursive: true });
fs.mkdirSync(path.join(publicRepoPath, "src", "apps"), { recursive: true });

function removePrivateBlock() {
  const index = path.join(publicRepoPath, "src", "main.ts");

  fs.readFile(index, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const privateBlockRegex =
      /[\n\r]?\/\/ @private-start[\s\S]*?\/\/ @private-end[\n\r]*/;
    const exampleBlockRegex =
      /[\n\r]?\/\/ @example-start[\s\S]*?\/\/ @example-end[\n\r]*/;

    const updatedData = data
      .replace(privateBlockRegex, "")
      .replace(exampleBlockRegex, "");

    fs.writeFile(index, updatedData, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

removePrivateBlock();

// function clearEnv() {
//   const envFile = path.join(currentDir, "..", "serenade-sx-public", ".env");
//   // Read the contents of the .env file
//   const envData = fs.readFileSync(envFile, "utf8");

//   // Replace the values in the key-value pairs with empty strings
//   const newEnvData = envData.replace(/=.*/g, "=");

//   // Write the new key-value pairs back to the .env file
//   fs.writeFileSync(envFile, newEnvData);
// }

// clearEnv();

function stripJsonFiles() {
  jsonFiles.forEach((file) => {
    const jsonData = JSON.stringify({});
    fs.writeFileSync(path.join(publicRepoPath, file), jsonData);
  });
}

stripJsonFiles();

console.log(`Successfully built public repo at ${publicRepoPath}`);
