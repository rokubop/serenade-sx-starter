import { cachedApi } from "sx";
import { Api } from "sx/types";
import appsApi from "@/user-data-api/apps/api";
import { entriesOf } from "./utils";

export async function getActiveAppConfig(api: Api = cachedApi) {
  const fullPathActiveApp = await api.getActiveApplication();
  const app = entriesOf(appsApi.getAllSync()).find(([appNameId, config]) => {
    return fullPathActiveApp.includes(config.systemName);
  });
  return app?.length ? app[1] : undefined;
}

export async function isAppActive(api: Api = cachedApi, name: string) {
  const fullPathActiveApp = await api.getActiveApplication();
  const isActive = entriesOf(appsApi.getAllSync()).some(
    ([appNameId, config]) => {
      if (
        config.appNameId === name ||
        config.systemName === name ||
        config.searchName?.includes(name)
      ) {
        return fullPathActiveApp.includes(config.systemName);
      }
    }
  );
  return isActive;
}
