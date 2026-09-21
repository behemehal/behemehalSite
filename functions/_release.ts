/**
 * Fetching a release, shared by the version and download endpoints so the two can
 * never disagree about which release is "the latest" for an app.
 */
import { githubHeaders, problem, tokenFor, versionCode, type Env, type GithubRelease } from "./_shared";
import type { ReleaseSource } from "./_apps";

export interface Found {
  release: GithubRelease;
}

export type Lookup = Found | { failure: Response };

export function isFailure(result: Lookup): result is { failure: Response } {
  return "failure" in result;
}

/** A 404 from GitHub means different things with and without a token; say which. */
export function notVisible(env: Env, source: ReleaseSource, what: string): Response {
  return tokenFor(env, source.repo)
    ? problem(404, `${what} Check the token can read ${source.repo}.`)
    : problem(
        503,
        `No GitHub token is configured for ${source.repo}, so a private repository looks like a missing one.`,
      );
}

export async function latestRelease(env: Env, source: ReleaseSource): Promise<Lookup> {
  const upstream = await fetch(
    `https://api.github.com/repos/${source.repo}/releases?per_page=20`,
    {
      headers: githubHeaders(env, source.repo),
      // Cloudflare's own cache, so a thousand clients are a handful of GitHub calls.
      cf: { cacheTtl: 300, cacheEverything: true },
    } as RequestInit,
  );

  if (upstream.status === 404 || upstream.status === 401) {
    return { failure: notVisible(env, source, "No such repository.") };
  }
  if (!upstream.ok) {
    return { failure: problem(502, `GitHub said ${upstream.status}.`) };
  }

  const releases = (await upstream.json()) as GithubRelease[];
  const release = releases
    .filter((r) => !r.draft && (source.allowPrerelease || !r.prerelease))
    .at(0);

  if (!release) {
    return { failure: problem(404, "No published release yet.") };
  }
  return { release };
}

/** The JSON body both `/api/version` and `/api/version/<slug>` return. */
export function describe(origin: string, source: ReleaseSource, release: GithubRelease) {
  const version = release.tag_name.replace(/^v/, "");
  const base = `${origin}/api/download/${source.slug}/${encodeURIComponent(release.tag_name)}`;
  return {
    available: true as const,
    app: source.slug,
    name: source.name,
    version,
    versionCode: versionCode(version),
    tag: release.tag_name,
    title: release.name ?? version,
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
  };
}
