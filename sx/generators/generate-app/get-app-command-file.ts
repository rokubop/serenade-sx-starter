import fs from "fs-extra";
import path from "path";
import { AppConfig } from "sx/types";
import { createAppCommandsFile } from ".";
import { getConfig } from "sx/config";
const config = getConfig();

export async function getOrCreateApp(appConfig: AppConfig) {
  let filePath = "";
  let createdNewFile = false;
  let appNameId = appConfig.appNameId;
  if (appNameId) {
    const appCommandsPath = path.join(config.appCommandsDataPath, appNameId);
    filePath = `${appCommandsPath}.ts`;

    try {
      await fs.access(filePath);
    } catch (error: any) {
      try {
        filePath = `${appCommandsPath}.js`;
        await fs.access(filePath);
      } catch (error: any) {
        if (error.code === "ENOENT") {
          filePath = `${appCommandsPath}.ts`;
          await fs.ensureFile(filePath);
          await createAppCommandsFile(appConfig, filePath);
          createdNewFile = true;
        } else {
          throw error;
        }
      }
    }
  }

  return [filePath, createdNewFile] as [
    filePath: string,
    createdNewFile: boolean
  ];
}
