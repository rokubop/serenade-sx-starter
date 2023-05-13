import fs from "fs";
import path from "path";
import { formatAsKebabCase } from "sx/utils";
import { AppConfig } from "sx/types";

export const createAppCommandsFile = async (
  appConfig: AppConfig,
  filePath: string
) => {
  const templatePath = path.join(
    process.env.ROOT_DIR,
    "sx",
    "generators",
    "generate-app",
    "template.ts"
  );
  const template = fs.readFileSync(templatePath, "utf8");

  fs.writeFileSync(
    filePath,
    template
      .replace(/\/\/@ts-nocheck\s+/g, "")
      .replace(/__NAME__/g, appConfig.appNameId)
  );
  console.log(`File ${filePath} created`);

  await addImportToMainFile(appConfig);
};

const addImportToMainFile = async (appConfig: AppConfig) => {
  const filePath = path.join(process.env.ROOT_DIR, "src", "main.ts");

  const fileContent = fs.readFileSync(filePath, "utf8");
  const newLine = `import "apps/${appConfig.appNameId}";`;
  //check if the import already exists
  if (fileContent.includes(newLine)) {
    return;
  }
  const updatedContent = fileContent.replace(
    /(\/\/\s@sx-dynamic-app-import)/g,
    `${newLine}\n$1`
  );

  fs.writeFileSync(filePath, updatedContent);
  console.log(`File ${filePath} updated`);
};
