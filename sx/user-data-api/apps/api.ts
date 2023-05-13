/**
 * This file should be the API for interacting with the JSON.
 * - Define Types
 * - Validate JSON schema
 * - Make CRUD API
 */
import appsJson from "@/user-data/apps.json";
import createJsonCrudApi from "sx/json-api";
import { z } from "zod";
import { appsDataPath } from "sx/file-paths";
import { parseJson } from "sx/utils/zod-utils";

export const appConfigSchema = z.object({
  path: z.string(),
  appNameId: z.string(),
  spokenName: z.array(z.string()),
  searchName: z.string(),
  systemName: z.string(),
  focusSettleTime: z.number(),
  launchSettleTime: z.number(),
  launchType: z.string(),
  focusType: z.string(),
});

const AppsSchema = z.record(appConfigSchema);
parseJson(AppsSchema, appsJson, appsDataPath);

type OrAnyString = string & {};
export type AppConfig = z.infer<typeof appConfigSchema>;
export type AppNameId = keyof typeof appsJson | OrAnyString;
export type Apps = Record<AppNameId, AppConfig>;

export const appsApi = createJsonCrudApi<AppNameId, AppConfig>(
  appsDataPath,
  appsJson as Apps
);
export const AppNameId = Object.keys(appsJson) as AppNameId[];
export default appsApi;
