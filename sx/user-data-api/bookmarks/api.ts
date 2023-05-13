/**
 * This file should be the API for interacting with the JSON.
 * - Define Types
 * - Validate JSON schema
 * - Make CRUD API
 */
import bookmarksJson from "@/user-data/bookmarks.json";
import createJsonCrudApi from "sx/json-api";
import { bookmarksDataPath } from "sx/file-paths";
import { z } from "zod";
import { parseJson } from "sx/utils/zod-utils";

const Url = z.string().url();
const bookmarksSchema = z.record(Url);

// typescript error check
const validateUserJsonFileForBookmarks: z.infer<typeof bookmarksSchema> =
  bookmarksJson;
parseJson(bookmarksSchema, bookmarksJson, bookmarksDataPath);

export const bookmarksApi = createJsonCrudApi(bookmarksDataPath, bookmarksJson);
export default bookmarksApi;
