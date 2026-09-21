# Adding an app

Everything about an app — its page, its privacy page, its tile on the home page, and
whether it publishes releases — comes from one entry in `src/data/apps.ts` and one
folder of images. There is no route to add, no component to write, and nothing to
register anywhere else.

This guide is in the order you would actually do it.

---

## 1. Pick a slug

```
/apps/<slug>          the page
/apps/<slug>/privacy  the policy, when there is one
/api/version/<slug>   the latest release, when the app publishes any
public/img/apps/<slug>/
```

**The slug is a public URL and never changes.** Renaming one breaks every link ever
shared, including the update check inside a shipped app.

The one game in the catalog uses its Android package id (`com.behemehal.laser`),
because that is what its store links were built from. Anything that is not a Play app
should use a short name instead: `quickv`, not `com.quickv.desktop`. `packageName` is
a separate field and keeps the real id.

## 2. Write the catalog entry

Append to `APPS` in `src/data/apps.ts`. The type is documented field by field at the
top of that file; this is the shape, with the fields worth thinking about called out.

```ts
{
  slug: "quickv",
  packageName: "com.quickv.desktop",
  name: "QuicKV",
  tagline: "One line, the store's short description.",
  kind: "app",                       // "app" | "game" — which home page band it joins,
                                     // via the GAMES / TOOLS exports at the foot
                                     // of the file
  category: "Developer tools",
  developer: "Behemehal",
  tags: ["Desktop", "Local-first", "No account"],

  icon: "/img/apps/quickv/icon.webp",
  iconPng: "/img/apps/quickv/icon.png",
  featureGraphic: "/img/apps/quickv/feature.webp",

  platforms: ["macOS", "Windows", "Linux"],   // defaults to ["Android"]
  orientation: "landscape",                   // defaults to portrait
  releases: { repo: "ahmetcanaksu/QuicKV" },  // see step 6

  playUrl: null,                     // null reads as "coming soon" for a phone app
  links: [],                         // source, website, itch — each with an icon

  screenshots: [{ src: "…", caption: "…" }],  // caption is also the alt text
  about: ["Opening paragraphs."],
  sections: [{ heading: "…", items: ["…"] }],
  stats: [{ value: "…", label: "…" }],        // or { icon, label }

  contentRating: { label: "…", detail: "…" },
  dataSafety: [{ icon: "…", title: "…", body: "…" }],
  info: [{ label: "…", value: "…" }],
  hasPrivacyPolicy: true,
  supportEmail: "support@behemehal.org",
}
```

Three fields decide how the page looks rather than what it says:

- **`platforms`** defaults to `["Android"]`. It drives the JSON-LD, and it decides
  whether a missing `playUrl` reads as "coming soon to Google Play" or as nothing at
  all. A desktop app with no `platforms` claims to be an Android app.
- **`orientation`** defaults to portrait. A desktop app is `"landscape"`, or its
  screenshots get cropped into a 9:16 phone frame and most of the screen is thrown
  away.
- **`releases`** is the only place a repository is ever named. Setting it is what
  turns on `/api/version/<slug>` and the download buttons.

`stats` takes either a `value` or an `icon`, not both.

Icons are [Material Symbols](https://fonts.google.com/icons) names.

## 3. Drop the images in

```
public/img/apps/<slug>/
  icon.webp                256x256   the page and tile icon
  icon.png                 512x512   og:image fallback, and the store-style header
  feature.webp             1024x500  banner behind the title, optional
  feature.png              1024x500  the og:image when a feature graphic exists
  screenshots/NN-name.webp           9:16 for phones, 16:10 for desktop
```

Number the screenshots — `01-keys.webp`, `02-namespaces.webp` — so the folder reads
in the order the page shows them. The catalog controls the real order; the numbers
are so a human editing the folder can tell.

Desktop screenshots go in at **1600x1000**, downscaled from a 2x render. Phone ones
keep their native portrait size.

## 4. Take the pictures

A phone game is screenshotted on a phone. A desktop app is the awkward case: a Tauri
window cannot be captured on a build machine, and cropping a photo of a laptop is
worse than no screenshot at all.

So the desktop shots are **rendered, not captured** — the app's real frontend, built
exactly as it ships, running in headless Chromium against a mocked backend. This is
the same harness the app repo uses to check its own UI, which is the point: the
pictures are the real build, not a mockup that will drift.

### The method

**1. Build the app's frontend.** In the app repo:

```sh
pnpm exec vite build
```

**2. Copy `dist/` somewhere else.** Never serve from `dist/` itself — the next step
injects a script that fakes the backend, and it must be impossible for that to end up
in a shipped build.

```sh
mkdir -p /tmp/shots && cp -R dist/. /tmp/shots/
```

**3. Write a mock backend.** For Tauri, one file defining
`window.__TAURI_INTERNALS__.invoke`, referenced from `<head>` **before** the bundle:

```js
// /tmp/shots/mock.js
(() => {
  const handlers = {
    list_connections: () => [{ id: "p1", name: "orders-prod", host: "redis-01.internal" }],
    scan_keys: () => ({ keys: [/* … */], cursor: "18432", done: false }),
    // …one per command the screens you want actually call
  };
  window.__TAURI_INTERNALS__ = {
    invoke: (cmd, args) => Promise.resolve(handlers[cmd] ? handlers[cmd](args ?? {}) : null),
    transformCallback: (cb) => { const id = Math.random(); window[`_${id}`] = cb; return id; },
  };
})();
```

```sh
sed -i '' 's|<head>|<head><script src="/mock.js"></script>|' /tmp/shots/index.html
```

Two rules for the fixtures:

- **Match the real return shapes exactly.** A mock that lies about a shape defeats
  the whole exercise: you get a photograph of a bug that does not exist, or you miss
  one that does.
- **Make the data plausible and fake.** These end up on a public page. No real
  hostnames, no real keys, no real customer data. Invented names that look like
  production are what you want.

**4. Serve it and shoot.** Anything static will do:

```sh
npx serve -l 8745 /tmp/shots &
node docs/shoot.mjs "$(which chromium)" "http://127.0.0.1:8745/?s=1#keys" 01-keys.png
```

`docs/shoot.mjs` is in this repo. It renders at 1440x900 with
`deviceScaleFactor: 2`, so each file lands at 2880x1800.

Two traps, both of which have cost real time here:

- **Never use `--virtual-time-budget`.** It starves `ResizeObserver`. Any layout that
  measures itself — split panes, virtualised lists — comes out collapsed, which looks
  exactly like a broken app. The script drives Chrome with real waits instead.
- **A hash-only navigation fires no `load` event.** If you drive screens from
  `location.hash`, give every shot a **distinct query string** too (`?s=1`, `?s=2`),
  or every picture is of whatever was already showing. This one is silent: the files
  differ in name and not in content, and it is easy not to notice for an hour.

**5. Downscale to what the site serves.**

```sh
magick 01-keys.png -resize 1600x1000 -quality 82 \
  public/img/apps/<slug>/screenshots/01-keys.webp
```

**6. Look at every one of them before committing.** The harness has produced a
convincing wrong answer twice — once from virtual time, once from a wait that was too
short and caught a pre-load frame. A screenshot that disagrees with what the app does
is worse than none.

### The feature graphic

Same trick: an HTML page at exactly 1024x500, rendered with the same script.

```sh
node docs/shoot.mjs "$(which chromium)" "file:///tmp/feature.html" feature.png 1024 500
# 2x again, so that file is 2048x1000 — both sizes are wanted here, because the
# .png is the og:image and the .webp is the banner.
magick feature.png -resize 1024x500 public/img/apps/<slug>/feature.png
magick feature.png -resize 1024x500 -quality 88 public/img/apps/<slug>/feature.webp
```

Put `<meta charset="utf-8">` in that page. Without it every dash and quote comes out
as `â€"`, and it is only visible once the file is a PNG and too late to be obvious.

### The icon

From whatever the app's own icon source is, so the site and the app cannot drift:

```sh
magick icon-source.png -resize 512x512 public/img/apps/<slug>/icon.png
magick icon-source.png -resize 256x256 -quality 90 public/img/apps/<slug>/icon.webp
```

## 5. The privacy policy

If the app needs one, write `src/policies/<slug>.privacy.md` and set
`hasPrivacyPolicy: true`. The page at `/apps/<slug>/privacy` renders it. Leave the
flag off and the link does not appear.

## 6. Turn on releases

One line in the entry:

```ts
releases: { repo: "ahmetcanaksu/QuicKV" },
```

That is the whole change. `/api/version/<slug>` starts answering, downloads appear at
`/api/download/<slug>/…`, and the page shows the current version and a button per
asset. The repository may be private — publishing the binaries of a closed-source app
is the reason those endpoints exist.

Add `allowPrerelease: true` to offer pre-releases while there is no stable one.

If the repository is private, or belongs to an owner the existing token cannot reach,
read **[../functions/README.md](../functions/README.md)** — it covers the token, the
per-owner fallback, and the version scheme the app is expected to follow.

## 7. Check it

```sh
pnpm build
npx wrangler pages dev dist
```

Then look at, in this order:

- `/apps/<slug>` — the header, the screenshots at the right shape, the stats strip,
  the release block if the app has one.
- `/apps` — the tile.
- `/` — the apps or games band, depending on `kind`.
- The page source, for `og:image` — a missing `feature.png` falls back to `icon.png`,
  which is square and looks wrong in a link preview.
