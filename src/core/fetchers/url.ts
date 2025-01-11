import { type Config, type Source } from "@/core/config";
import subs from "@/sub-store/api/subs";
import collections from "@/sub-store/api/collections";
import download from "@/sub-store/api/download";
import { nanoid } from "nanoid";


export const fetchURL = async (source: Source, config: Config) => {
  const urls = (source.options?.urls ?? []) as string[];

  // Add subscriptions
  let names = await Promise.all(
    urls.map(async (url) => {
      const name = nanoid();
      const sr = await subs.add({ name, url, ua: source.ua || config.ua });
      return sr.ok ? name : undefined;
    })
  );
  const subscriptions = names.filter((name) => name !== undefined);
  if (subscriptions.length === 0) return undefined;

  // Add them into a same collection
  const collection = nanoid();
  const cr = await collections.add({ name: collection, subscriptions });
  if (!cr.ok) return undefined;

  const dr = await download.collection({
    name: collection,
    target: source.target,
  });

  return dr.ok ? await dr.text() : undefined;
};
