import { releaseSource } from "../../_apps";
import { describe, isFailure, latestRelease } from "../../_release";
import { json, problem, type Ctx } from "../../_shared";

/**
 * The latest release of one app.
 *
 *   GET /api/version/quickv
 *
 * The app is looked up in the site's own catalog, so publishing releases for a new
 * app is a `releases: { repo }` line in `src/data/apps.ts` — no route, no env var,
 * and no change here.
 */
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const slug = String(ctx.params.slug ?? "");
  const source = releaseSource(slug);
  if (!source) {
    return problem(404, `No app called "${slug}" publishes releases.`);
  }

  const found = await latestRelease(ctx.env, source);
  if (isFailure(found)) return found.failure;

  return json(describe(new URL(ctx.request.url).origin, source, found.release), {
    // Short enough that a release appears almost at once, long enough that an app
    // checking on launch never troubles GitHub's rate limits.
    headers: { "cache-control": "public, max-age=300" },
  });
}
