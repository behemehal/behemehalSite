import {
  DEFAULT_REPO,
  githubHeaders,
  json,
  problem,
  versionCode,
  type Ctx,
  type GithubRelease,
} from "../_shared";

/**
 * The latest release of a **private** repository, described publicly.
 *
 * This is the whole trick behind "a public URL for a private repo's releases":
 * GitHub will not serve either the metadata or the files without a token, and a
 * token cannot be shipped in a desktop app. So the token lives here, on the server,
 * and this endpoint publishes only the parts that are meant to be public — a version
 * number, release notes, and links back through `/api/download`.
 *
 * The source stays private. The binaries do not.
 *
 *   GET /api/version              latest stable release
 *   GET /api/version?prerelease=1 the newest release even if it is a pre-release
 */
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const { env } = ctx;
  const repo = env.RELEASES_REPO ?? DEFAULT_REPO;
  const url = new URL(ctx.request.url);
  const wantPrerelease = url.searchParams.get("prerelease") === "1";

  // The whole list rather than /releases/latest: `latest` skips pre-releases, and we
  // want to be able to offer them on request rather than run two code paths.
  const upstream = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=20`, {
    headers: githubHeaders(env),
    // Cloudflare's own cache, so a thousand clients are a handful of GitHub calls.
    cf: { cacheTtl: 300, cacheEverything: true },
  } as RequestInit);

  if (upstream.status === 404 || upstream.status === 401) {
    // A private repo is a 404 to an anonymous caller, so the likeliest cause of this
    // is the missing secret rather than a missing repository. Say which, because
    // "not found" sends whoever deployed it looking in the wrong place.
    return problem(
      env.GITHUB_TOKEN ? 404 : 503,
      env.GITHUB_TOKEN
        ? `The token cannot see ${repo}. It needs Contents: read on that repository.`
        : "No GITHUB_TOKEN is set, so a private repository looks like a missing one.",
    );
  }
  if (!upstream.ok) {
    return problem(502, `GitHub said ${upstream.status}.`);
  }

  const releases = (await upstream.json()) as GithubRelease[];
  const release = releases
    .filter((r) => !r.draft && (wantPrerelease || !r.prerelease))
    .at(0);

  if (!release) {
    return json(
      { available: false, reason: "No published release yet." },
      { headers: { "cache-control": "public, max-age=300" } },
    );
  }

  const version = release.tag_name.replace(/^v/, "");
  const base = `${url.origin}/api/download/${encodeURIComponent(release.tag_name)}`;

  return json(
    {
      available: true,
      version,
      versionCode: versionCode(version),
      tag: release.tag_name,
      name: release.name ?? version,
      notes: release.body ?? "",
      prerelease: release.prerelease,
      publishedAt: release.published_at,
      assets: release.assets.map((asset) => ({
        name: asset.name,
        size: asset.size,
        contentType: asset.content_type,
        downloads: asset.download_count,
        // Ours, not GitHub's: a github.com asset URL on a private repo is a 404 to
        // anyone without access.
        url: `${base}/${encodeURIComponent(asset.name)}`,
      })),
    },
    {
      // Five minutes is short enough that a release is visible almost at once and
      // long enough that an app checking on launch never troubles GitHub's limits.
      headers: { "cache-control": "public, max-age=300" },
    },
  );
}
