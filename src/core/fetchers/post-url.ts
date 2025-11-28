import { type Config, type Source } from "@/core/config";
import { fetchURL } from "@/core/fetchers/url";
import axios from "axios";
import { replaceDateMacros } from "@/util/macros";

export const fetchPostURL = async (source: Source, config: Config) => {
  const urls = ((source.options?.urls ?? []) as string[]).map(
    replaceDateMacros
  );
  const func = (source.options?.function ?? "(str) => [str]") as string;

  // Fetch the contents of the URLs
  const fetches = urls.map(async (url) => {
    try {
      const res = await axios.request({
        url,
        method: "GET",
        timeout: 30 * 1000,
      });
      return res.status === 200 ? res.data : undefined;
    } catch (err) {
      console.error(`[fetchPostURL]: Error fetching ${url}: ${err}`);
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

  let finalUrls = results
    .filter((content) => content !== undefined)
    .map(parser)
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter((url) => url !== undefined);
  finalUrls = [...new Set(finalUrls)].sort();
  console.log(`post-urls: ${JSON.stringify(finalUrls, null, 2)}`);

  // @ts-ignore Replace the URLs with the extracted URLs
  source.options.urls = finalUrls;

  return fetchURL(source, config);
};
