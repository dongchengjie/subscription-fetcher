import actions from "@actions/core";

export type Inputs = {
  config: string;
  whitelist?: string[];
  blacklist?: string[];
  token?: string;
};

const getInput = (name: string, required: boolean = false) => {
  return (
    process.env[name] ??
    process.env[name.toUpperCase()] ??
    process.env[name.toLocaleLowerCase()] ??
    actions.getInput(name, { required })
  );
};

export const getInputs = (): Inputs => {
  return {
    config: getInput("config", true),
    whitelist: getInput("whitelist")
      ? getInput("whitelist").split(",").filter(Boolean)
      : [],
    blacklist: getInput("blacklist")
      ? getInput("blacklist").split(",").filter(Boolean)
      : [],
    token: getInput("token") || process.env.GITHUB_TOKEN,
  };
};
