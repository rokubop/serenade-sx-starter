// be careful about imports here. It can create a cyclic dependency
import { Config, UserConfig } from "sx/types";
import { defaultConfig } from "./sx-default-config";

let config: Config = defaultConfig;

const defineConfig = (userConfig: UserConfig) => {
  config = { ...defaultConfig, ...userConfig };
};

const getConfig = () => config;

export { defineConfig, getConfig };
export { Config, Api, AppConfig } from "sx/types";
