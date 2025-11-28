import { type Config, type Source } from "@/core/config";
import { nanoid } from "nanoid";
import { addSub, addCollection, downloadCollection } from "@/apis/sub-store";
import { replaceDateMacros } from "@/util/macros";

export const fetchURL = async (source: Source, config: Config) => {
  const urls = ((source.options?.urls ?? []) as string[]).map(
    replaceDateMacros
  );

  // Add subscriptions
  let names = await Promise.all(
    urls.map(async (url) => {
      const name = nanoid();
      const sr = await addSub(name, url, { ua: source.ua || config.ua });
      return sr.status < 400 ? name : undefined;
    })
  );
  const subscriptions = names.filter((name) => name !== undefined);
  if (subscriptions.length === 0) return undefined;

  // Add them into a same collection
  const collection = nanoid();
  const cr = await addCollection(collection, subscriptions);
  if (!(cr.status < 400)) return undefined;

  const dr = await downloadCollection(collection, source.target);

  return dr ? dr : undefined;
};
