import {
  DEFAULT_REPO,
  githubHeaders,
  problem,
  type Ctx,
  type GithubRelease,
} from "../../_shared";

/**
 * A public download for a private repository's release asset.
 *
 *   GET /api/download/<tag>/<asset name>
 *
 * GitHub will not serve a private repo's asset without a token, and a token cannot
 * ship inside a desktop app. So this swaps ours for GitHub's: it asks for the asset
 * with `redirect: manual`, GitHub answers 302 with a short-lived signed URL that
 * carries no credentials of ours, and we hand that straight to the browser.
 *
 * The bytes never pass through here — the redirect is the point. Proxying a 200MB
 * installer through a Worker would be slower for the user and would bill us for the
 * privilege.
 *
 * The asset is looked up **by name in the release's own asset list**, and the id
 * from that list is what gets used. Nothing the caller sends is ever interpolated
 * into a GitHub path, so there is no way to point this at another repository or at
 * anything that is not a release asset.
 */
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const { env } = ctx;
  const parts = ([] as string[]).concat(ctx.params.path ?? []);
  if (parts.length !== 2) {
    return problem(400, "Expected /api/download/<tag>/<asset>.");
  }
  const [tag, assetName] = parts;

  const repo = env.RELEASES_REPO ?? DEFAULT_REPO;
  const byTag = await fetch(
    `https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`,
    { headers: githubHeaders(env), cf: { cacheTtl: 300, cacheEverything: true } } as RequestInit,
  );
  if (byTag.status === 404 || byTag.status === 401) {
    // Same reasoning as /api/version: without the secret a private repo is
    // indistinguishable from one that does not exist, so say which is likelier.
    return problem(
      env.GITHUB_TOKEN ? 404 : 503,
      env.GITHUB_TOKEN
        ? "No release with that tag."
        : "No GITHUB_TOKEN is set, so a private repository looks like a missing one.",
    );
  }
  if (!byTag.ok) return problem(502, `GitHub said ${byTag.status}.`);

  const release = (await byTag.json()) as GithubRelease;
  const asset = release.assets.find((candidate) => candidate.name === assetName);
  if (!asset) return problem(404, "That release has no asset by that name.");

  const signed = await fetch(`https://api.github.com/repos/${repo}/releases/assets/${asset.id}`, {
    headers: githubHeaders(env, "application/octet-stream"),
    redirect: "manual",
  });

  const location = signed.headers.get("location");
  if (signed.status >= 300 && signed.status < 400 && location) {
    return new Response(null, {
      status: 302,
      headers: {
        location,
        // The signed URL expires in minutes, so this must not be cached as if it
        // were a permanent address for the asset.
        "cache-control": "no-store",
        "access-control-allow-origin": "*",
      },
    });
  }

  // GitHub answered with the bytes instead of a redirect. Rare, but passing them
  // through is better than failing — the alternative is a download that works
  // everywhere except the one time GitHub changes its mind.
  if (signed.ok) {
    return new Response(signed.body, {
      status: 200,
      headers: {
        "content-type": asset.content_type || "application/octet-stream",
        "content-disposition": `attachment; filename="${asset.name}"`,
        "cache-control": "public, max-age=3600",
        "access-control-allow-origin": "*",
      },
    });
  }

  return problem(502, `GitHub said ${signed.status} for that asset.`);
}
