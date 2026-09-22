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

/**
 * How long a GitHub answer is reused. Long enough that a burst of clients is one
 * call; short enough that a new release shows up while you are still looking at the
 * page you published it from.
 */
const FRESH_FOR = 300;

/**
 * How long a *stale* answer may still be served when GitHub will not talk to us.
 *
 * A day, because the alternative is worse. GitHub's rate limit is per account and
 * shared by every token that account owns, so something else entirely — a CI job, a
 * script, an editor extension — can exhaust it and take the download page down with
 * it. The last known release is almost certainly still the latest release.
 */
const STALE_FOR = 86_400;

/**
 * The releases of one repository, through the edge cache.
 *
 * The previous version asked Cloudflare to cache the GitHub request itself, with
 * `cf: { cacheEverything: true }`. That never did anything: Cloudflare does not cache
 * a response to a request carrying an `Authorization` header, and every one of ours
 * does. So every single client request became a GitHub API call, and the first time
 * the account's hourly quota went the endpoint returned 502 to everybody.
 *
 * This caches our own derived answer instead, under a key we control.
 */
export async function recentReleases(
  env: Env,
  source: ReleaseSource,
): Promise<GithubRelease[] | { failure: Response }> {
  const cache = (caches as unknown as { default: Cache }).default;
  // A URL rather than the real request: the cache key must not vary by client, and
  // `https://` plus a made-up host keeps it out of the way of real routes.
  const key = new Request(`https://releases.invalid/${source.repo}`);

  const hit = await cache.match(key);
  const cached = hit ? ((await hit.json()) as { at: number; releases: GithubRelease[] }) : null;
  const age = cached ? (Date.now() - cached.at) / 1000 : Infinity;
  if (cached && age < FRESH_FOR) return cached.releases;

  const upstream = await fetch(`https://api.github.com/repos/${source.repo}/releases?per_page=20`, {
    headers: githubHeaders(env, source.repo),
  });

  if (!upstream.ok) {
    // Serve what we had rather than nothing. An answer from an hour ago beats a
    // download page that cannot say what the current version is.
    if (cached && age < STALE_FOR) return cached.releases;

    if (upstream.status === 404 || upstream.status === 401) {
      return { failure: notVisible(env, source, "No such repository.") };
    }
    if (upstream.status === 403 && upstream.headers.get("x-ratelimit-remaining") === "0") {
      const reset = Number(upstream.headers.get("x-ratelimit-reset") ?? 0);
      const seconds = Math.max(1, Math.round(reset - Date.now() / 1000));
      // 429, not 5xx. A zone proxying this one replaces a 5xx body with its own
      // error page, so the reason never reaches the caller — and this is a "come
      // back later", which is what 429 is for.
      return {
        failure: problem(429, `GitHub's hourly rate limit for this account is spent. It resets in ${seconds}s.`, {
          "retry-after": String(seconds),
        }),
      };
    }
    console.warn(`github ${upstream.status} for ${source.repo}`);
    return { failure: problem(502, `GitHub said ${upstream.status}.`) };
  }

  const body = await upstream.json();
  const releases = Array.isArray(body) ? (body as GithubRelease[]) : [];
  await cache.put(
    key,
    new Response(JSON.stringify({ at: Date.now(), releases }), {
      headers: { "content-type": "application/json", "cache-control": `max-age=${STALE_FOR}` },
    }),
  );
  return releases;
}

export async function latestRelease(env: Env, source: ReleaseSource): Promise<Lookup> {
  const releases = await recentReleases(env, source);
  if ("failure" in releases) return releases;

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
