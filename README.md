# behemehal.org

The Behemehal site: the games, the apps, the support pages, and the endpoints that
publish releases for apps whose source is not public.

Astro 5 with Preact islands and Tailwind 3. It builds to static files and deploys to
Cloudflare Pages. A handful of Pages Functions sit beside that build to serve
releases — there is no SSR adapter, and `pnpm build` does not know they exist.

## Commands

```sh
pnpm install
pnpm dev                    # astro dev, no functions
pnpm build                  # static build into dist/
npx wrangler pages dev dist # the build *and* the functions, locally
pnpm deploy                 # wrangler pages deploy dist
```

`pnpm dev` does not run anything under `functions/`. If you are touching the release
endpoints, build first and use `wrangler pages dev`, or `/api/…` will 404 in a way
that has nothing to do with your change.

## Where things are

```
src/data/apps.ts        The app catalog. One entry per app or game, and the source
                        of truth for every app page, the home page bands and the
                        release endpoints.
src/pages/              index, ahmetcan, support, 404
src/pages/apps/         /apps, and the generated /apps/<slug> and <slug>/privacy
src/components/         Astro and Preact components. ReleaseInfo is an island.
src/policies/           <slug>.privacy.md, rendered by the privacy page
src/styles/             The Tailwind entry and the bits Tailwind cannot express
public/img/apps/<slug>/ Icons, feature graphic and screenshots for that app
functions/              Cloudflare Pages Functions: the release endpoints
docs/                   The long-form guides below
```

## Adding an app

One entry in `src/data/apps.ts` and a folder of images. The detail page, the privacy
page, the home page tile and the release endpoints all come from that entry. There is
no route to add and nothing to register.

**[docs/adding-an-app.md](docs/adding-an-app.md)** is the whole recipe, including how
the desktop screenshots are taken — a Tauri window cannot be screenshotted on a build
machine, so they are rendered rather than captured.

## Releases and versions

`/api/version/<slug>` reports the latest release of an app and
`/api/download/<slug>/…` hands out its files, both for repositories the public cannot
see. That is how a closed-source app gets public downloads and an update check.

**[functions/README.md](functions/README.md)** covers the endpoints, the GitHub
token, the version scheme and what a client does with it.

## Deploying

`pnpm deploy`, or a push if the Pages project is connected to this repository.
Secrets are not part of a deploy — they are set once with
`wrangler pages secret put`, and `functions/README.md` says which ones exist.
