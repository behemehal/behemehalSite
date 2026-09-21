import { useEffect, useState } from "preact/hooks";

interface Asset {
  name: string;
  size: number;
  url: string;
}

interface Release {
  available: true;
  version: string;
  title: string;
  prerelease: boolean;
  publishedAt: string;
  assets: Asset[];
}

type State =
  | { kind: "loading" }
  | { kind: "released"; release: Release }
  | { kind: "none" };

/**
 * The latest release of an app, fetched in the browser.
 *
 * The site is static, so the version cannot be baked in without redeploying every
 * time one is published. It comes from `/api/version/<slug>` instead — the same
 * endpoint the app itself uses, so the page and the app can never disagree about
 * what the latest version is.
 *
 * Anything other than a real release renders as "coming soon": a 404 because
 * nothing is published yet, a 503 because the token is not configured, and a failed
 * fetch all mean the same thing to a visitor, which is that there is nothing to
 * download. The distinction matters to whoever deployed it, and they can read the
 * endpoint.
 */
export default function ReleaseInfo({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const stop = new AbortController();
    fetch(`/api/version/${slug}`, { signal: stop.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) =>
        setState(body?.available ? { kind: "released", release: body } : { kind: "none" }),
      )
      .catch(() => setState({ kind: "none" }));
    return () => stop.abort();
  }, [slug]);

  if (state.kind === "loading") {
    return (
      <span class="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 px-5 py-3 rounded-md">
        <span class="material-symbols-outlined animate-spin" style={{ fontSize: "18px" }}>
          progress_activity
        </span>
        Checking for a release…
      </span>
    );
  }

  if (state.kind === "none") {
    return (
      <span class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 px-5 py-3 rounded-md">
        <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>
          hourglass_top
        </span>
        Coming soon
      </span>
    );
  }

  const { release } = state;
  const downloads = rank(release.assets);

  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        {downloads.slice(0, 4).map(({ asset, label }) => (
          <a
            href={asset.url}
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 transition-colors text-white px-5 py-3 rounded-md"
          >
            <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>
              download
            </span>
            <span>
              {label}
              <span class="text-white/70 text-xs ml-2">{megabytes(asset.size)}</span>
            </span>
          </a>
        ))}
      </div>

      <p class="text-white/60 text-sm">
        Version {release.version}
        {release.prerelease ? " (pre-release)" : ""} · released {when(release.publishedAt)}
        {downloads.length > 4 ? ` · ${downloads.length} downloads in total` : ""}
      </p>
    </div>
  );
}

/**
 * Things that live in a release but are not downloads: checksums, signatures and
 * manifests. Showing "TXT — 2 KB" as the first button ahead of the installer is how
 * a release page wastes its most important row.
 */
const NOT_A_DOWNLOAD = /(\.sha\d*|\.sig|\.asc|\.pem|\.txt|\.json|checksums?)$/i;

/** Roughly how much somebody wants this file. Installers first, archives last. */
function usefulness(name: string): number {
  if (/\.dmg$/i.test(name)) return 0;
  if (/\.(msi|exe)$/i.test(name)) return 1;
  if (/\.appimage$/i.test(name)) return 2;
  if (/\.deb$/i.test(name)) return 3;
  if (/\.rpm$/i.test(name)) return 4;
  return 9;
}

/** The platform this browser is on, as the asset names spell it. */
function thisPlatform(): "mac" | "windows" | "linux" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Mac|iPhone|iPad/.test(ua)) return "mac";
  if (/Win/.test(ua)) return "windows";
  if (/Linux|Android|X11/.test(ua)) return "linux";
  return "other";
}

function platformOf(name: string): "mac" | "windows" | "linux" | "other" {
  if (/\.dmg$/i.test(name)) return "mac";
  if (/\.(msi|exe)$/i.test(name)) return "windows";
  if (/\.(appimage|deb|rpm)$/i.test(name)) return "linux";
  return "other";
}

/**
 * The assets worth offering, best first.
 *
 * Yours first — somebody on a Mac should not have to read past three Linux packages
 * to find the .dmg — then by how installable the file is.
 */
function rank(assets: Asset[]): { asset: Asset; label: string }[] {
  const mine = thisPlatform();
  const sorted = assets
    .filter((asset) => !NOT_A_DOWNLOAD.test(asset.name))
    .map((asset) => ({ asset, label: labelFor(asset.name) }))
    .sort((a, b) => {
      const aMine = platformOf(a.asset.name) === mine ? 0 : 1;
      const bMine = platformOf(b.asset.name) === mine ? 0 : 1;
      return aMine - bMine || usefulness(a.asset.name) - usefulness(b.asset.name);
    });

  // One button per label. Two files that read the same to a visitor are one choice
  // with a coin flip attached — and a release that ships the same build twice in
  // different archives should not push the other platforms off the row.
  const seen = new Set<string>();
  return sorted.filter(({ label }) => !seen.has(label) && seen.add(label));
}

/**
 * What a file is for, from its name.
 *
 * The architecture matters as much as the platform: a release with three Windows
 * builds in it and one label between them is three buttons nobody can choose from.
 * Apple's two are named the way Apple names them; everywhere else the plain
 * architecture is what people look for.
 */
function labelFor(name: string): string {
  const platform = platformOf(name);
  const arm = /aarch64|arm64/i.test(name);
  const intel = /x64|x86_64|amd64/i.test(name);
  const x86 = /i?[36]86|_386/i.test(name);

  if (platform === "mac") {
    return `macOS${arm ? " (Apple silicon)" : intel ? " (Intel)" : ""}`;
  }

  const arch = arm ? " (ARM64)" : intel ? " (x64)" : x86 ? " (x86)" : "";
  if (platform === "windows") return `Windows${arch}`;
  if (/\.appimage$/i.test(name)) return `Linux AppImage${arch}`;
  if (/\.deb$/i.test(name)) return `Linux .deb${arch}`;
  if (/\.rpm$/i.test(name)) return `Linux .rpm${arch}`;

  const extension = name.split(".").pop();
  return extension ? extension.toUpperCase() : name;
}

function megabytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "recently";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
