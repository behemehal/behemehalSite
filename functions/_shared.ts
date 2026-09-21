/**
 * Shared bits for the release endpoints.
 *
 * These run as Cloudflare Pages Functions, which sit beside the static Astro build —
 * no SSR adapter, no change to how the site is built. Anything under `functions/` is
 * served at the matching path.
 */

export interface Env {
  /**
   * A GitHub fine-grained token with **Contents: read** on the release repository,
   * and nothing else. Set as a Pages secret:
   *
   *   wrangler pages secret put GITHUB_TOKEN
   *
   * It never reaches the browser. Its whole job is to turn a private repository's
   * releases into something public, which is the only reason this endpoint exists.
   */
  GITHUB_TOKEN?: string;
  /** `owner/repo`. Overridable so a fork or a rename needs no code change. */
  RELEASES_REPO?: string;
}

export interface Ctx {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil(promise: Promise<unknown>): void;
}

export const DEFAULT_REPO = "ahmetcanaksu/QuicKV";

/** GitHub rejects requests with no User-Agent, and wants an explicit API version. */
export function githubHeaders(env: Env, accept = "application/vnd.github+json"): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    "User-Agent": "behemehal.org-releases",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
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
