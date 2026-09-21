import { DEFAULT_RELEASE_SLUG, releaseSource } from "../_apps";
import { describe, isFailure, latestRelease } from "../_release";
import { json, problem, type Ctx } from "../_shared";

/**
 * The latest release of the default app.
 *
 * Kept because the first app shipped pointing at the un-slugged route. Anything new
 * should ask for `/api/version/<slug>`.
 */
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const source = releaseSource(DEFAULT_RELEASE_SLUG);
  if (!source) return problem(500, "The default app publishes no releases.");

  const found = await latestRelease(ctx.env, source);
  if (isFailure(found)) return found.failure;

  return json(describe(new URL(ctx.request.url).origin, source, found.release), {
    headers: { "cache-control": "public, max-age=300" },
  });
}
