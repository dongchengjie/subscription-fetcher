import { type Config, type Source } from "@/core/config";
import { fetchURL } from "@/core/fetchers/url";

export const fetchPostURL = async (source: Source, config: Config) => {
  const urls = (source.options?.urls ?? []) as string[];
  const func = (source.options?.function ?? "(str) => [str]") as string;

  // Fetch the contents of the URLs
  const fetches = urls.map(async (url) => {
    try {
      const res = await fetch(url);
      return res.ok ? await res.text() : undefined;
    } catch {
      return undefined;
    }
  });
  // Wait for all fetches to complete
  const results = await Promise.all(fetches);

  // Extract URLs from the contents
  const parser: (str: string) => string[] = (str: string) => {
    try {
      return eval(func)(str);
    } catch {
      return [];
    }
  };

  const finalUrls = results
    .filter((content) => content !== undefined)
    .map(parser)
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter((url) => url !== undefined);

  // @ts-ignore Replace the URLs with the extracted URLs
  source.options.urls = [...new Set(finalUrls)];

  return fetchURL(source, config);
};
