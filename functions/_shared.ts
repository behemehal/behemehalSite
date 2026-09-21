/**
 * Shared bits for the release endpoints.
 *
 * These run as Cloudflare Pages Functions, which sit beside the static Astro build —
 * no SSR adapter, no change to how the site is built. Anything under `functions/` is
 * served at the matching path.
 */

export interface Env {
  /**
   * A GitHub fine-grained token with **Contents: read** on the release repositories,
   * and nothing else. Set as a Pages secret:
   *
   *   wrangler pages secret put GITHUB_TOKEN
   *
   * It never reaches the browser. Its whole job is to turn a private repository's
   * releases into something public, which is the only reason these endpoints exist.
   *
   * One token covers every repository it is scoped to, so most of the time this is
   * the only secret there is.
   */
  GITHUB_TOKEN?: string;

  /**
   * A token for one owner, when the default cannot cover it.
   *
   * A fine-grained PAT belongs to a single account or organisation and can only
   * reach repositories there. So the moment apps live under more than one owner —
   * say `ahmetcanaksu/QuicKV` and `behemehal/something` — one token is not enough.
   * `GITHUB_TOKEN_BEHEMEHAL` is used for repositories owned by `behemehal`, and the
   * default for everything else. No code changes when that day comes.
   */
  [perOwnerToken: string]: string | undefined;
}

/**
 * The token to use for a repository: the owner's, if one is set, else the default.
 *
 * `behemehal/site` looks for `GITHUB_TOKEN_BEHEMEHAL`. Anything not a letter or a
 * digit becomes an underscore, because a hyphenated owner cannot be an env var name.
 */
export function tokenFor(env: Env, repo: string): string | undefined {
  const owner = repo.split("/")[0] ?? "";
  const key = `GITHUB_TOKEN_${owner.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return env[key] ?? env.GITHUB_TOKEN;
}

export interface Ctx {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil(promise: Promise<unknown>): void;
}

/** GitHub rejects requests with no User-Agent, and wants an explicit API version. */
export function githubHeaders(
  env: Env,
  repo: string,
  accept = "application/vnd.github+json",
): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    "User-Agent": "behemehal.org-releases",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = tokenFor(env, repo);
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // The app polls this; anything else that wants it is welcome to.
      "access-control-allow-origin": "*",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

export function problem(status: number, message: string): Response {
  return json({ error: message }, { status });
}

/**
 * A semantic version as one comparable integer.
 *
 * The app compares numbers rather than parsing semver at the client, which keeps the
 * "is there something newer" decision to one `>`. Each part gets three digits, so
 * 0.2.1 is 2001 and 1.0.0 is 1_000_000 — the ordering only breaks past .999, which
 * no part of a version this shape reaches.
 */
export function versionCode(version: string): number {
  const [major = 0, minor = 0, patch = 0] = version
    .replace(/^v/, "")
    .split(/[.+-]/)
    .map((part) => Number.parseInt(part, 10) || 0);
  return major * 1_000_000 + minor * 1_000 + patch;
}

export interface GithubAsset {
  id: number;
  name: string;
  size: number;
  content_type: string;
  download_count: number;
}

export interface GithubRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  html_url: string;
  assets: GithubAsset[];
}
