/**
 * This file should be the API for interacting with the JSON.
 * - Define Types
 * - Validate JSON schema
 * - Make CRUD API
 */
import createJsonCrudApi from "sx/json-api";
import mousePositionsJson from "@/user-data/mouse-positions.json";
import { AppNameId } from "@/user-data-api/apps/api";
import { parseJson } from "sx/utils/zod-utils";
import { mousePositionsDataPath } from "sx/file-paths";
import { z } from "zod";
import browser from "sx/browser";

const coordsSchema = z.object({
  x: z.number(),
  y: z.number(),
});
const mousePositionsSchema = z.record(coordsSchema);
const appMousePositionSchema = z.record(mousePositionsSchema);

export type Coords = z.infer<typeof coordsSchema>;
export type MousePositions = z.infer<typeof mousePositionsSchema>;
export type AppMousePositions = Record<AppNameId, MousePositions>;

// typescript error check
const validateUserJsonFileMousePositions: z.infer<
  typeof appMousePositionSchema
> = mousePositionsJson;
parseJson(appMousePositionSchema, mousePositionsJson, mousePositionsDataPath);

const crud = createJsonCrudApi<AppNameId, MousePositions>(
  mousePositionsDataPath,
  mousePositionsJson as unknown as AppMousePositions
);

export const mousePositionsApi = {
  get: async (
    appNameId: AppNameId,
    positionName: string
  ): Promise<Coords | undefined> => {
    const data = await crud.getAll();
    const pos = data?.[appNameId]?.[positionName];
    if (!pos) {
      await browser.displayWarningHtml(`
        <h2>Mouse position ${positionName} for app ${appNameId} not found.</h2>
        <p><command>show help mouse positions</command></p>
      `);
      console.log(
        `Mouse position ${positionName} for app ${appNameId} not found.`
      );
      return;
    }
    return { x: Number(pos.x), y: Number(pos.y) };
  },
  getAll: crud.getAll,
  getAllSync: crud.getAllSync,
  update: async (
    appNameId: AppNameId,
    positionName: string,
    position: Coords
  ) => {
    if (appNameId && positionName && position) {
      const json = await crud.getAll();
      if (!json[appNameId]) json[appNameId] = {};
      json[appNameId]![positionName] = position;
      await crud.updateAll(json);
    }
  },
};

export default mousePositionsApi;
