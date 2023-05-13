/**
 * This file should be the API for interacting with the JSON.
 * - Define Types
 * - Validate JSON schema
 * - Make CRUD API
 */
import macrosJson from "@/user-data/macros.json";
import urlMacrosJson from "@/user-data/url-macros.json";
import createJsonCrudApi from "sx/json-api";
import { macrosDataPath, urlMacrosDataPath } from "sx/file-paths";
import { parseJson } from "sx/utils/zod-utils";
import { z } from "zod";

const Macro = z.array(z.string());
const macroSchema = z.record(Macro);
// typescript error check
const validateUserJsonFileForMacros: z.infer<typeof macroSchema> = macrosJson;
parseJson(macroSchema, macrosJson, macrosDataPath);

export type Macro = z.infer<typeof Macro>;
export type Macros = z.infer<typeof macroSchema>;
export const macrosApi = createJsonCrudApi<Macro>(
  macrosDataPath,
  macrosJson as Macros
);

const Url = z.string().url();
const urlMacroSchema = z.record(Url, Macro);
// typescript error check
const validateUserJsonFileForUrlMacros: z.infer<typeof urlMacroSchema> =
  urlMacrosJson;
parseJson(urlMacroSchema, urlMacrosJson, urlMacrosDataPath);

type Url = z.infer<typeof Url>;
export type UrlMacros = z.infer<typeof urlMacroSchema>;
export const urlMacrosApi = createJsonCrudApi<Url, Macro>(
  urlMacrosDataPath,
  urlMacrosJson as UrlMacros
);
