import { releaseSource } from "../../_apps";
import { isFailure, latestRelease, notVisible } from "../../_release";
import { githubHeaders, problem, type Ctx, type GithubRelease } from "../../_shared";

/**
 * A public download for a private repository's release asset.
 *
 *   GET /api/download/<app>/<tag>/<asset name>
 *
 * GitHub serves neither a private repo's metadata nor its files without a token, and
 * a token cannot ship inside an app. So this swaps ours for GitHub's: it asks for
 * the asset with `redirect: manual`, GitHub answers 302 with a short-lived signed URL
 * carrying none of our credentials, and we hand that to the browser.
 *
 * The bytes never pass through here. Proxying a 200MB installer through a Worker
 * would be slower for the user and billed to us.
 *
 * The asset is found **by name in that release's own asset list** and fetched by the
 * id from it, so nothing a caller sends is interpolated into a GitHub path. There is
 * no way to point this at another repository or at anything but a release asset.
 */
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const parts = ([] as string[]).concat(ctx.params.path ?? []);
  if (parts.length !== 3) {
    return problem(400, "Expected /api/download/<app>/<tag>/<asset>.");
  }
  const [slug, tag, assetName] = parts;

  const source = releaseSource(slug);
  if (!source) return problem(404, `No app called "${slug}" publishes releases.`);

  // `latest` resolves to the same release `/api/version` just advertised, so a link
  // that says "latest" cannot drift to a different build between the two calls.
  let release: GithubRelease;
  if (tag === "latest") {
    const found = await latestRelease(ctx.env, source);
    if (isFailure(found)) return found.failure;
    release = found.release;
  } else {
    const byTag = await fetch(
      `https://api.github.com/repos/${source.repo}/releases/tags/${encodeURIComponent(tag)}`,
      {
        headers: githubHeaders(ctx.env, source.repo),
        cf: { cacheTtl: 300, cacheEverything: true },
      } as RequestInit,
    );
    if (byTag.status === 404 || byTag.status === 401) {
      return notVisible(ctx.env, source, "No release with that tag.");
    }
    if (!byTag.ok) return problem(502, `GitHub said ${byTag.status}.`);
    release = (await byTag.json()) as GithubRelease;
  }

  const asset = release.assets.find((candidate) => candidate.name === assetName);
  if (!asset) return problem(404, "That release has no asset by that name.");

  const signed = await fetch(
    `https://api.github.com/repos/${source.repo}/releases/assets/${asset.id}`,
    {
      headers: githubHeaders(ctx.env, source.repo, "application/octet-stream"),
      redirect: "manual",
    },
  );

  const location = signed.headers.get("location");
  if (signed.status >= 300 && signed.status < 400 && location) {
    return new Response(null, {
      status: 302,
      headers: {
        location,
        // The signed URL expires in minutes, so this must not be cached as though
        // it were a permanent address for the asset.
        "cache-control": "no-store",
        "access-control-allow-origin": "*",
      },
    });
  }

  // GitHub answered with bytes instead of a redirect. Rare, but passing them through
  // beats failing — the alternative is a download that works every time except the
  // one time GitHub changes its mind.
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
