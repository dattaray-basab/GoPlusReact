// src/config.ts

import configData from "./siteConfig.json";

interface ServerConfig {
  port: number;
  host: string;
}

interface Config {
  server1: ServerConfig;
  server2: ServerConfig;
}

const config: Config = configData;

export default config;
