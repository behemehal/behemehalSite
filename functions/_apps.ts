/**
 * Which repository an app's releases come from.
 *
 * Read from the site's own catalog rather than from a map kept in here, so adding an
 * app stays what it has always been: one entry in `src/data/apps.ts`. Pages bundles
 * functions with the rest of the project, so the import is an ordinary one.
 */
import { APPS, DEFAULT_RELEASE_SLUG } from "../src/data/apps";

export interface ReleaseSource {
  slug: string;
  name: string;
  repo: string;
  allowPrerelease: boolean;
}

export function releaseSource(slug: string): ReleaseSource | null {
  const app = APPS.find((candidate) => candidate.slug === slug);
  if (!app?.releases) return null;
  return {
    slug: app.slug,
    name: app.name,
    repo: app.releases.repo,
    allowPrerelease: app.releases.allowPrerelease ?? false,
  };
}

export { DEFAULT_RELEASE_SLUG };
