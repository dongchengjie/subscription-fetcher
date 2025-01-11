import { fetchURL } from "@/core/fetchers/url";
import { fetchPostURL } from "@/core/fetchers/post-url";
import { type Type, type Source, type Config } from "@/core/config";

export type Fetchers = {
  [key in Type]: (
    source: Source,
    config: Config
  ) => Promise<string | undefined>;
};

const fetchers: Fetchers = {
  url: fetchURL,
  "post-url": fetchPostURL,
};

export default fetchers;
