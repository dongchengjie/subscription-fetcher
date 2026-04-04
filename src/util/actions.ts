import { getInput } from "@actions/core";

export type Inputs = {
  config: string;
  whitelist?: string[];
  blacklist?: string[];
  token?: string;
};

const getInputVal = (name: string, required: boolean = false) => {
  return (
    process.env[name] ??
    process.env[name.toUpperCase()] ??
    process.env[name.toLocaleLowerCase()] ??
    getInput(name, { required })
  );
};

export const getInputs = (): Inputs => {
  return {
    config: getInputVal("config", true),
    whitelist: getInputVal("whitelist")
      ? getInputVal("whitelist").split(",").filter(Boolean)
      : [],
    blacklist: getInputVal("blacklist")
      ? getInputVal("blacklist").split(",").filter(Boolean)
      : [],
    token: getInputVal("token") || process.env.GITHUB_TOKEN,
  };
};
