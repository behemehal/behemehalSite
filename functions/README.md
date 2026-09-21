# Release endpoints

Two Cloudflare Pages Functions that publish the releases of repositories the public
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

`allowPrerelease: true` offers pre-releases while there is no stable one yet.

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
