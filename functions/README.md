# Release endpoints

Cloudflare Pages Functions that publish the releases of repositories the public
cannot see.

```
GET /api/version/<app>                  the latest release, as JSON
GET /api/version                        the same, for the default app
GET /api/download/<app>/<tag>/<asset>   that file, for anyone
GET /api/download/<app>/latest/<asset>  the same, without naming the tag
```

They sit beside the static Astro build — no SSR adapter, and `pnpm build` is
unchanged.

## Why they exist

GitHub serves neither a private repository's release metadata nor its files without
a token, and a token cannot ship inside a desktop app. So the token lives on the
server: `/api/download` asks GitHub for the asset with `redirect: manual`, GitHub
answers `302` with a short-lived signed URL carrying none of our credentials, and we
hand that to the browser.

The bytes never pass through the Worker. **The source stays private; the binaries do
not.**

## Adding an app

One line, in the catalog you already edit:

```ts
// src/data/apps.ts
{
  slug: "quickv",
  // …
  releases: { repo: "ahmetcanaksu/QuicKV" },
}
```

That is the whole change. `/api/version/quickv` starts answering, downloads appear at
`/api/download/quickv/…`, and the app's page shows the version and the download
buttons. No route to add, no environment variable, nothing in `functions/`.

Everything else about adding an app — the entry, the images, the screenshots — is in
[../docs/adding-an-app.md](../docs/adding-an-app.md).

`allowPrerelease: true` offers pre-releases while there is no stable one yet.

The un-slugged `/api/version` is an alias for `DEFAULT_RELEASE_SLUG` in that same
file. It exists because the first app shipped against a route with no slug in it. A
new app should use `/api/version/<slug>` and never rely on the alias.

## Versioning

### The release is the version

There is no version file anywhere on this site. **The GitHub release is the source
of truth**, and the tag is the version:

```
v0.1.0   →  0.1.0
0.1.0    →  0.1.0
v1.2.3   →  1.2.3
```

A leading `v` is stripped. Tag a release and it is published; nothing here needs
touching, and nothing needs redeploying.

"Latest" means the first release in the twenty most recent that is not a draft — and
not a pre-release either, unless the app sets `allowPrerelease`. Both endpoints
resolve it the same way, through the same function, so `/api/version` and
`/api/download/<app>/latest/…` can never disagree about which build they mean.

### Version codes

Every response carries a `versionCode` alongside the string:

```
versionCode = major × 1_000_000 + minor × 1_000 + patch

0.1.0  →      1_000
0.2.1  →      2_001
1.0.0  →  1_000_000
```

It exists so a client decides "is there something newer" with one `>` instead of
parsing semver. **An app must compute its own code with the same arithmetic** — the
QuicKV copy is in `src/lib/update.ts` and is deliberately identical — or the two
sides can disagree about which of two releases is newer, which is the one bug this
whole path cannot afford.

The ordering holds while every part stays under 1000. Nothing versioned this way
comes close, and a four-part or date-based scheme would need a different formula, so
do not introduce one without changing both sides.

Anything after the first `-` or `+` is ignored: `1.2.3-beta.2` and `1.2.3` are the
same code. Pre-release *ordering* is not expressed. If you need two pre-releases to
be distinguishable, give them distinct patch numbers.

### What a release should look like

- **Tag** `vMAJOR.MINOR.PATCH`.
- **Title and body** are shown to the user as-is. The body is the release notes; it
  reaches the app verbatim, so write it for the person reading it in a dialog.
- **Asset names should be stable across releases** — `QuicKV-0.1.0-macos-arm64.dmg`
  changes every release and cannot be linked to in advance, while a page can only
  offer `…/latest/<name>` if it knows the name. Either keep the version out of the
  file name, or let the client read the asset list from `/api/version` and use the
  `url` it is handed. The site's own download buttons do the latter.
- **One asset per platform and architecture.** The page lists them all; there is no
  platform detection.

### The response

```jsonc
GET /api/version/quickv

{
  "available": true,
  "app": "quickv",
  "name": "QuicKV",
  "version": "0.1.0",
  "versionCode": 1000,
  "tag": "v0.1.0",
  "title": "…",           // release name, or the version
  "notes": "…",           // release body, verbatim
  "prerelease": false,
  "publishedAt": "2026-09-21T…",
  "assets": [
    {
      "name": "QuicKV-0.1.0-macos-arm64.dmg",
      "size": 8123456,
      "contentType": "application/x-apple-diskimage",
      "downloads": 0,
      // Ours, not GitHub's. A github.com asset URL on a private repo is a 404 to
      // anyone without access.
      "url": "https://behemehal.org/api/download/quickv/v0.1.0/QuicKV-0.1.0-macos-arm64.dmg"
    }
  ]
}
```

Anything else is a non-2xx with `{ "error": "…" }`:

| Status | Means |
| --- | --- |
| `404` | No such app, or the app publishes no releases, or there is no published release yet |
| `404` | With a token configured: the repository is not visible to it |
| `503` | No token is configured for that repository, so a private repo is indistinguishable from a missing one |
| `502` | GitHub answered with something unusable |

`access-control-allow-origin: *` on everything. The app polls it; anything else is
welcome to.

### What a client should do

1. Fetch `/api/version/<slug>` on launch, if the user has left that on.
2. Treat **any** non-2xx, and any network failure, as "no answer" and say nothing.
   Offline is the common case and is not worth a dialog.
3. Compare `versionCode` with its own. Newer means tell the user, once, quietly.
4. Never install anything by itself. Reporting a version and installing a binary are
   different features, and the second one needs signed artefacts.

QuicKV's implementation is `src/lib/update.ts` in its repo, and is the reference for
a new app. Note that it also names `behemehal.org` in its CSP `connect-src` — a
locked-down webview cannot reach this endpoint otherwise.

## The token

A **fine-grained personal access token**, with as little as it can have:

- *Repository access* → **Only select repositories** → the release repositories.
- *Permissions* → *Repository permissions* → **Contents: Read-only**. Nothing else.
  Release metadata and assets are both under Contents.
- No account permissions.

Then, once:

```sh
npx wrangler pages secret put GITHUB_TOKEN
```

Adding an app later means **editing the token's repository list**, not making a new
token. One token covers every repository it can see.

### More than one owner

A fine-grained token belongs to one account or organisation and cannot reach outside
it. So the day an app lives under `behemehal` while another is under
`ahmetcanaksu`, one token stops being enough. Add a second, named for the owner:

```sh
npx wrangler pages secret put GITHUB_TOKEN_BEHEMEHAL
```

`GITHUB_TOKEN_<OWNER>` is used for repositories owned by `<OWNER>` — uppercased, with
anything that is not a letter or a digit replaced by `_` — and `GITHUB_TOKEN` for
everything else. No code changes.

### Rotating it

Put the new one in with the same command and redeploy; secrets are read per request,
so nothing caches the old value beyond the five-minute response cache.

## Running them locally

```sh
pnpm build
npx wrangler pages dev dist
```

`.dev.vars` holds local values and is not committed:

```
GITHUB_TOKEN=github_pat_…
```

Without a token the endpoints still work against **public** repositories, which is
enough to exercise the routes. Against a private one they return `503` and say that
the token is missing rather than `404` — a private repository and a missing one look
identical to an anonymous caller, and the difference is the whole problem.

## What is cached

`/api/version` responses are cached for five minutes, at the edge and in the browser.
A release is visible almost immediately and an app checking on launch never troubles
GitHub's rate limits. The `302` from `/api/download` is `no-store`, because the URL
it points at expires in minutes.
