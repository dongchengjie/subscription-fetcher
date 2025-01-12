import { type Config, type Source } from "@/core/config";
import { fetchURL } from "@/core/fetchers/url";
import { getOctokit } from "@actions/github";
import ms from "ms";
import { getInputs } from "@/util/actions";

export const fetchGithub = async (source: Source, config: Config) => {
  // Get the owner and repo
  const repository = source.options?.repository as string;
  const [owner, repo] = repository
    .replace(/.*github.com\/(.*)$/, "$1")
    .split("/");
  if (!owner || !repo) return;

  // Get the GitHub token
  const { token } = getInputs();
  if (!token) return;
  const octokit = getOctokit(token);

  // Get the commits
  const span = source.options?.span as string;
  const duration = ms(span);
  const commits = await listCommits(
    octokit,
    owner,
    repo,
    new Date(Date.now() - duration).toISOString()
  );

  // Get the details of the commits
  let details = await Promise.all(
    commits.map(async (commit) => {
      try {
        const res = await octokit.rest.repos.getCommit({
          owner: owner,
          repo: repo,
          ref: commit.sha,
        });
        return res.data;
      } catch {
        return undefined;
      }
    })
  );

  // Get file list
  const latest = Boolean(source.options?.latest);
  let fileList: NonNullable<NonNullable<(typeof details)[number]>["files"]> =
    [];
  details = details.sort((d1, d2) => {
    const cd1 = d1?.commit.author?.date || d1?.commit.committer?.date;
    const cd2 = d2?.commit.author?.date || d2?.commit.committer?.date;
    const t1 = new Date(cd1 ?? 0).getTime();
    const t2 = new Date(cd2 ?? 0).getTime();
    return t2 - t1;
  });
  for (const detail of details) {
    const files = detail?.files;
    if (!files || files.length === 0) continue;

    for (let file of files) {
      if (file.status !== "added" && file.status !== "modified") continue;
      // Fetch the latest version of the files
      if (!latest || !fileList.some((f) => f.filename === file.filename)) {
        fileList.push(file);
      }
    }
  }

  // Filter the files
  const extensions = source.options?.extensions as string[];
  fileList = fileList.filter((file) =>
    extensions.some((ext) => file.filename.endsWith(ext))
  );

  // Get raw url of the files
  const rawUrls = fileList.map((file) => file.raw_url);

  // @ts-ignore Replace the URLs with raw URLs
  source.options.urls = [...new Set(rawUrls)];

  return fetchURL(source, config);
};

type Octokit = ReturnType<typeof getOctokit>;

const listCommits = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  since: string
) => {
  let commits: Awaited<
    ReturnType<Octokit["rest"]["repos"]["listCommits"]>
  >["data"] = [];
  try {
    const per_page = 100;
    for (let page = 1; ; page++) {
      const results = await octokit.rest.repos.listCommits({
        owner,
        repo,
        since,
        per_page,
        page,
      });
      commits = commits.concat(results.data);
      if (results.data.length !== per_page) break;
    }
  } catch {
    // Ignore
  }
  return commits;
};
