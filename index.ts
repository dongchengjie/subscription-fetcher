import { getInputs } from "@/util/actions";
import { getConfig, type Source } from "@/core/config";
import fetchers from "@/core/fetchers";
import { resolve } from "path";
import { outputFile } from "fs-extra";

type Task = Promise<{ source: Source; content: string }>;

if (import.meta.main) {
  const { config, whitelist, blacklist } = getInputs();

  // Get configuration from file or URL
  const cfg = await getConfig(config);

  // Generate fetch tasks
  const tasks = cfg.sources.map(async (source) => {
    if (whitelist && whitelist.length > 0 && !whitelist.includes(source.name))
      return;
    if (blacklist && blacklist.length > 0 && blacklist.includes(source.name))
      return;

    const fetcher = fetchers[source.fetcher];
    if (fetcher) {
      const content = await fetcher(source, cfg).catch(() => undefined);
      return content ? { source, content } : undefined;
    }
  });

  // Wait for all tasks to complete
  const results = await Promise.all(tasks);

  // Commit the subscriptions to custom repository
  const subscriptions = results.filter((item) => item !== undefined);

  // Output the subscriptions
  if (subscriptions.length > 0) {
    const baseDir = process.env["GITHUB_WORKSPACE"] ? "/github/workspace" : "";
    const outputs = subscriptions
      .map((item) => {
        let output = item.source.output ?? `subscriptions/${item.source.name}`;
        return { path: resolve(baseDir, output), data: item.content };
      })
      .map((file) => outputFile(file.path, file.data));

    // Wait for all outputs to complete
    await Promise.all(outputs);
  }
}
