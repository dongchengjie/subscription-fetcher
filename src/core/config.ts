import { resolve } from "path";
import { readFile } from "fs/promises";
import yaml from "js-yaml";
import Ajv from "ajv";
import AjvErrors from "ajv-errors";
import AjvFormats from "ajv-formats";
import schema from "schemas/subscription-fetcher.json";

export type Type = "url" | "post-url" | "github";

export type Target =
  | "qx"
  | "QX"
  | "QuantumultX"
  | "surge"
  | "Surge"
  | "SurgeMac"
  | "Loon"
  | "Clash"
  | "meta"
  | "clashmeta"
  | "clash.meta"
  | "Clash.Meta"
  | "ClashMeta"
  | "mihomo"
  | "Mihomo"
  | "uri"
  | "URI"
  | "v2"
  | "v2ray"
  | "V2Ray"
  | "json"
  | "JSON"
  | "stash"
  | "Stash"
  | "shadowrocket"
  | "Shadowrocket"
  | "ShadowRocket"
  | "surfboard"
  | "Surfboard"
  | "singbox"
  | "sing-box"
  | "egern"
  | "Egern";

export type Options = Record<string, unknown>;

export type Source = {
  name: string;
  fetcher: Type;
  target?: Target;
  output?: string;
  options?: Options;
  ua?: string;
};

export type Config = {
  sources: Source[];
  ua?: string;
};

export const getConfig = async (config: string): Promise<Config> => {
  const promise = config.startsWith("http")
    ? fetch(config).then((res) => res.text())
    : readFile(resolve(config), { encoding: "utf-8" });
  const content = await promise.catch(() => undefined);
  if (!content) throw new Error(`Config file not found: ${config}`);

  // Load the config file
  const obj = yaml.load(content);

  // Validate the config file
  const ajv = new Ajv({ strict: true, allErrors: true, useDefaults: true });
  AjvFormats(ajv);
  AjvErrors(ajv);
  const validate = ajv.compile(schema);
  if (validate(obj)) return obj as Config;

  const message = validate.errors
    ?.map((error) => JSON.stringify(error))
    .join("\n");
  throw new Error(`Invalid config file: ${message}`);
};
