/**
 * This file should be the API for interacting with the JSON.
 * - Define Types
 * - Validate JSON schema
 * - Make CRUD API
 */
import createJsonCrudApi from "sx/json-api";
import textCommandsJson from "@/user-data/text-commands.json";
import runCommandsJson from "@/user-data/run-commands.json";
import { textCommandsDataPath, runCommandsDataPath } from "sx/file-paths";
import { parseJson } from "sx/utils/zod-utils";
import { z } from "zod";

const textCommandsSchema = z.record(z.string());
// typescript error check
const validateUserJsonFileTextCommands: z.infer<typeof textCommandsSchema> =
  textCommandsJson;
parseJson(textCommandsSchema, textCommandsJson, textCommandsDataPath);
export const textCommandsData = createJsonCrudApi(
  textCommandsDataPath,
  textCommandsJson
);

const runCommandsSchema = z.record(z.string());
// typescript error check
const validateUserJsonFileForRunCommands: z.infer<typeof runCommandsSchema> =
  runCommandsJson;
parseJson(runCommandsSchema, runCommandsJson, runCommandsDataPath);
export const runCommandsData = createJsonCrudApi(
  runCommandsDataPath,
  runCommandsJson
);
