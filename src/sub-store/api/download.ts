import { server } from "@/sub-store/env";

const sub = async (option: { name: string; target?: string }) => {
  const url = option.target
    ? `${server}/download/${option.name}/${option.target}`
    : `${server}/download/${option.name}`;
  return await fetch(url, { method: "GET" });
};

const collection = async (option: { name: string; target?: string }) => {
  const url = option.target
    ? `${server}/download/collection/${option.name}/${option.target}`
    : `${server}/download/collection/${option.name}`;
  return await fetch(url, { method: "GET" });
};

const download = {
  collection,
};

export default download;
