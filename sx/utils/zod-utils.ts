import { z } from "zod";

/**
 * Parse/Validate a json file against a zod schema
 *
 * Logs errors to serenade.log if validation fails
 */
export function parseJson<TSchema, TJson>(
  schema: z.ZodSchema<TSchema>,
  json: TJson,
  jsonFilePath: string
) {
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.log(`Error parsing ${jsonFilePath}:`);
    console.log(
      `Resolution: Update the corresponding api's validation schema to match the json data`
    );
    console.log(parsed.error.issues);
  }
}
