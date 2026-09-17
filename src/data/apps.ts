/**
 * Behemehal app catalog.
 *
 * One entry per published (or upcoming) application — games and regular apps
 * alike. The store-style detail page at /apps/<slug> and the privacy page at
 * /apps/<slug>/privacy are both generated from this data, so adding an app is
 * a matter of appending an entry here plus dropping:
 *
 *   public/img/apps/<slug>/icon.webp        (256x256, page icon)
 *   public/img/apps/<slug>/icon.png         (512x512, og:image fallback)
 *   public/img/apps/<slug>/feature.webp     (1024x500, optional banner/og)
 *   public/img/apps/<slug>/screenshots/*    (9:16 webp)
 *   src/policies/<slug>.privacy.md      (privacy policy, optional)
 */

export type AppKind = "game" | "app";

export interface AppScreenshot {
  src: string;
  /** Short caption — also used as the alt text. */
  caption: string;
}

/** A bullet group in the "About" body, e.g. "Mechanics that stack". */
export interface AppSection {
  heading: string;
  items: string[];
}

/** One cell of the Play-style strip under the install buttons. */
export interface AppStat {
  /** Optional because `icon` replaces it — which is what the renderer already did,
   *  while the type still insisted on both. */
  value?: string;
  label: string;
  /** Material Symbols name, used instead of `value` when set. */
  icon?: string;
}

export interface AppLink {
  label: string;
  href: string;
  /** Material Symbols name. */
  icon: string;
}

/** A row of the "Data safety" card. */
export interface DataSafetyRow {
  icon: string;
  title: string;
  body: string;
}

export interface AppEntry {
  /** URL segment under /apps. Kept stable forever — it is a public link. */
  slug: string;
  /** The real store package id. Used to build store URLs. */
  packageName: string;
  name: string;
  /** One line under the title, the store's "short description". */
  tagline: string;
  kind: AppKind;
  /** Store category, e.g. "Puzzle", "Productivity". */
  category: string;
  developer: string;
  /** Extra chips next to the category. */
  tags: string[];

  icon: string;
  iconPng: string;
  featureGraphic?: string;

  /**
   * What it runs on. Defaults to Android, which is everything here shipped to before
   * QuicKV. Drives the JSON-LD and decides whether a missing store link should read
   * as "coming soon to Google Play" or as nothing at all.
   */
  platforms?: string[];
  /**
   * The shape of the screenshots. Phone apps are portrait; a desktop app is not, and
   * cropping one into a 9:16 frame throws away the screen.
   */
  orientation?: "portrait" | "landscape";

  /** Google Play listing URL. `null` while the app is not public yet. */
  playUrl: string | null;
  /** Anything else worth linking: source, website, itch, App Store… */
  links: AppLink[];

  screenshots: AppScreenshot[];

  /** Opening paragraphs of "About this game/app". */
  about: string[];
  sections: AppSection[];
  stats: AppStat[];

  /** Content rating, as answered in the store questionnaire. */
  contentRating: { label: string; detail: string };
  dataSafety: DataSafetyRow[];
  /** Rows of the "App info" table. */
  info: { label: string; value: string }[];
  /** Set when src/policies/<slug>.privacy.md exists. */
  hasPrivacyPolicy: boolean;
  supportEmail: string;
}

export const APPS: AppEntry[] = [
  {
    slug: "com.behemehal.laser",
    packageName: "com.behemehal.laser",
    name: "L.A.S.E.R",
    tagline:
      "Light Amplification by Stimulated Emission of Radiation. Also: a neon puzzle.",
    kind: "game",
    category: "Puzzle",
    developer: "Behemehal",
    tags: ["Single player", "Offline", "No purchases"],

    icon: "/img/apps/com.behemehal.laser/icon.webp",
    iconPng: "/img/apps/com.behemehal.laser/icon.png",
    featureGraphic: "/img/apps/com.behemehal.laser/feature.webp",

    playUrl: "https://play.google.com/store/apps/details?id=com.behemehal.laser",
    links: [],

    screenshots: [
      {
        src: "/img/apps/com.behemehal.laser/screenshots/01-prism.webp",
        caption: "A prism splitting white light into red, green and blue",
      },
      {
        src: "/img/apps/com.behemehal.laser/screenshots/02-gate.webp",
        caption: "Buttons and gates — send light elsewhere to open the road here",
      },
      {
        src: "/img/apps/com.behemehal.laser/screenshots/03-balloon.webp",
        caption: "Balloons that drop the wall they are holding",
      },
      {
        src: "/img/apps/com.behemehal.laser/screenshots/04-arcade.webp",
        caption: "Endless arcade — floors get deeper, the run never repeats",
      },
      {
        src: "/img/apps/com.behemehal.laser/screenshots/05-levels.webp",
        caption: "74 hand-built campaign levels",
      },
      {
        src: "/img/apps/com.behemehal.laser/screenshots/06-shop.webp",
        caption: "Beam casings bought with credits you earn by playing",
      },
    ],

    about: [
      "Light is the only tool you have. Aim it.",
      "L.A.S.E.R is a neon puzzle game about steering a single laser beam. Turn the mirrors, feed the prism, split the beam, press the button that opens the gate — and get the light where it needs to go before the cell overloads.",
      "74 levels in the campaign, an endless arcade that never repeats itself, and a new puzzle every single day. Nothing here is filler: every level introduces or combines a mechanic, and none of them can be won by luck — if a level has a gate, you are not getting past it without opening the gate.",
    ],

    sections: [
      {
        heading: "Mechanics that stack",
        items: [
          "Mirrors and beam splitters — duplicate the beam, but each arm loses half its power",
          "Prisms — split white light into red, green and blue",
          "Colour mixing — red + green = yellow, red + blue = magenta, green + blue = cyan",
          "Gates and buttons — send light somewhere else to open the road here",
          "Fiber lines — light travels inside the cable, straight through walls",
          "Explosive barrels, cuttable beams, and balloons that drop the wall they hold",
          "Moving obstacles that leave you only a window",
          "A megawatt power budget: every bounce costs energy, every split halves it",
        ],
      },
      {
        heading: "Endless arcade & daily challenge",
        items: [
          "A run that never repeats — floors get deeper, decoys multiply, gates appear",
          "Arcade costs no charges; the only punishment is that the run ends",
          "One puzzle a day, the same one for everybody — solve it to keep your streak",
        ],
      },
      {
        heading: "Built for your hands",
        items: [
          "Select a piece, then drag from anywhere — the further your finger, the finer the aim",
          "Easy mode: turn mirrors with big arrow buttons instead of dragging",
          "Colour tags for colour-blind players — every beam and receiver is labelled",
          "Three haptic modes, including a live pulse that follows the beam",
          "English and Turkish",
        ],
      },
      {
        heading: "No strings",
        items: [
          "No real-money purchases and no account",
          "No internet needed to play",
          "Everything in the shop is bought with credits you earn by playing",
          "Watching an ad for an extra charge is always optional",
        ],
      },
    ],

    stats: [
      { value: "74", label: "Campaign levels" },
      { value: "∞", label: "Arcade floors" },
      { value: "Daily", label: "New puzzle" },
      { value: "PEGI 3", label: "Rated everyone" },
    ],

    contentRating: {
      label: "Everyone · PEGI 3",
      detail:
        "Abstract light and geometry. No violence, no characters, no real-money purchases. Contains one optional rewarded ad.",
    },

    dataSafety: [
      {
        icon: "cloud_off",
        title: "The game itself sends nothing",
        body:
          "Progress, credits, settings and streaks are saved in local app storage on your device and never leave it. Uninstalling the app deletes them.",
      },
      {
        icon: "ads_click",
        title: "Optional rewarded ads share data with Google",
        body:
          "If — and only if — you choose to watch an ad for an extra charge, Google's Mobile Ads SDK may process your advertising ID and ad interaction data. That goes to Google, not to us. Ad requests are made with non-personalised ads enabled.",
      },
      {
        icon: "person_off",
        title: "No account, no tracking",
        body:
          "No sign-in, no email address, no analytics, no crash reporting. No access to contacts, location, camera, microphone, photos or files.",
      },
      {
        icon: "lock",
        title: "Encrypted in transit",
        body: "The only network traffic — the ad request — is encrypted by the SDK.",
      },
    ],

    info: [
      { label: "Version", value: "1.0.0" },
      { label: "Requires", value: "Android 7.0 and up" },
      { label: "Category", value: "Puzzle · Single player" },
      { label: "Offered by", value: "Behemehal" },
      { label: "In-app purchases", value: "None" },
      { label: "Ads", value: "Contains one optional rewarded ad" },
      { label: "Languages", value: "English, Türkçe" },
      { label: "Permissions", value: "None requested at runtime" },
    ],

    hasPrivacyPolicy: true,
    supportEmail: "info@behemehal.org",
  },

  {
    slug: "quickv",
    packageName: "com.quickv.desktop",
    name: "QuicKV",
    tagline:
      "See the shape of your keyspace — not just a list of keys. Redis, Valkey and DragonflyDB, with more stores on the way.",
    kind: "app",
    category: "Developer tools",
    developer: "Behemehal",
    tags: ["Desktop", "Local-first", "No account", "More stores soon"],

    icon: "/img/apps/quickv/icon.webp",
    iconPng: "/img/apps/quickv/icon.png",
    featureGraphic: "/img/apps/quickv/feature.webp",
    platforms: ["macOS", "Windows", "Linux"],
    orientation: "landscape",

    playUrl: null,
    links: [],

    screenshots: [
      {
        src: "/img/apps/quickv/screenshots/01-keys.webp",
        caption: "The key browser, folded into folders on the keyspace's own separator",
      },
      {
        src: "/img/apps/quickv/screenshots/06-value-dark.webp",
        caption: "A typed editor per value type, paged — here a hash, in the dark theme",
      },
      {
        src: "/img/apps/quickv/screenshots/02-namespaces.webp",
        caption:
          "A keyspace report: what is in a database you have never opened, and which prefixes are worth saving",
      },
      {
        src: "/img/apps/quickv/screenshots/03-hot.webp",
        caption:
          "Hot keys from two sources shown side by side — the server's own counter, and what you have opened",
      },
      {
        src: "/img/apps/quickv/screenshots/04-channels.webp",
        caption: "Pub/sub channels and keyspace events, live",
      },
      {
        src: "/img/apps/quickv/screenshots/05-scans.webp",
        caption: "Saved searches, and saved keys that open straight to their value",
      },
      {
        src: "/img/apps/quickv/screenshots/07-server.webp",
        caption: "What the server is, and what it can actually do",
      },
    ],

    about: [
      "A keyspace is a shape, and most clients show you a list. QuicKV shows you the shape.",
      "Most Redis clients can tell you whether a pattern matches something. QuicKV is built for the question people actually arrive with, which is that they do not know what the patterns are.",
      "It walks the keyspace, groups it by the separator the keys already use, and shows you what is in there — how many keys under each prefix, how many bytes, and which types. Then it offers the prefixes worth keeping as saved searches.",
      "Everything is done with SCAN. KEYS appears nowhere in the app, because on a database large enough to want a browser for, KEYS blocks the server for as long as its reply takes to build.",
    ],

    sections: [
      {
        heading: "Find the key",
        items: [
          "Glob search with a type filter — a bare word is widened to match anywhere, and the bar says so",
          "A folder tree on the connection's own separator, or a flat list — both views of one scan, so the toggle costs no round trip",
          "A keyspace report that says what is in a database, by prefix, by type and by size",
          "Saved searches, and saved keys that open straight to their value",
          "Hot keys: the server's own access counter where the policy keeps one, and a local record of what you have opened — shown side by side, never averaged",
        ],
      },
      {
        heading: "Read and change it",
        items: [
          "A typed editor for strings, hashes, lists, sets, sorted sets, streams and RedisJSON",
          "Every value is paged, so a four-million-element list opens as fast as a small one",
          "Values that are not UTF-8 are shown escaped and held read-only, rather than quietly corrupted",
          "Pub/sub: subscribe to channels or patterns, watch messages arrive, publish from the same screen",
          "Keyspace notifications in one click, with an honest warning about what turning them on costs the server",
          "A command line for whatever has no button",
        ],
      },
      {
        heading: "Hard to break something with",
        items: [
          "Read-only connections refuse every write, including from the command line — the server itself is asked which of its commands write",
          "A colour per connection, carried the full width of the title bar",
          "FLUSHALL, FLUSHDB, SWAPDB, SHUTDOWN, DEBUG and KEYS are held back behind a setting",
          "Deleting a folder says whether that is every key under the prefix or only the ones loaded",
          "Removing a TTL uses PERSIST, not a zero expiry — which would delete the key",
        ],
      },
      {
        heading: "Yours, on your machine",
        items: [
          "No account, no telemetry, no cloud — it talks to the servers you tell it to and nothing else",
          "Passwords live in the OS keychain and are read once per launch, on connect",
          "Connections and saved searches are readable JSON files you can copy between machines",
          "Redis, and by the same code Valkey and DragonflyDB",
          "Six themes, light and dark, warm and cool",
        ],
      },
      {
        heading: "More stores on the way",
        items: [
          "The backend is a trait, not a pile of Redis calls — every screen asks for a key, a value or a page, and none of them know what answered",
          "Which means a new store is one module, not a rewrite of the app around it",
          "Next up are the key-value stores people run beside Redis rather than instead of it",
        ],
      },
    ],

    stats: [
      { value: "Redis 4+", label: "Valkey & Dragonfly too" },
      { value: "SCAN", label: "Never blocks the server" },
      { value: "7", label: "Value types" },
      { icon: "vpn_key", label: "Keychain passwords" },
      { value: "Soon", label: "More key-value stores" },
    ],

    contentRating: {
      label: "Everyone",
      detail:
        "A developer tool. No accounts, no advertising, no purchases, and nothing that renders untrusted content.",
    },

    dataSafety: [
      {
        icon: "cloud_off",
        title: "Nothing is sent anywhere",
        body:
          "QuicKV connects to the servers you configure and to nothing else. There is no account, no telemetry, no crash reporting and no update check.",
      },
      {
        icon: "vpn_key",
        title: "Passwords live in the OS keychain",
        body:
          "Never in a file. They are read once per launch, when a connection is opened — not when a list is drawn — and a connection with no password never touches the keychain at all.",
      },
      {
        icon: "folder",
        title: "Your settings are plain files",
        body:
          "Connections and saved searches are readable JSON in the app's data directory, safe to copy between machines because the secrets are not in them.",
      },
      {
        icon: "history",
        title: "A local record of what you opened",
        body:
          "Which keys you have opened is kept in a local SQLite file to power the hot list. It never leaves the machine, and it can be cleared per connection or switched off.",
      },
    ],

    info: [
      { label: "Version", value: "0.1.0" },
      { label: "Availability", value: "In development — not yet released" },
      { label: "Requires", value: "macOS, Windows or Linux" },
      { label: "Speaks", value: "Redis, Valkey, DragonflyDB — more on the way" },
      { label: "Category", value: "Developer tools" },
      { label: "Offered by", value: "Behemehal" },
      { label: "Built with", value: "Tauri 2, Rust, React" },
      { label: "In-app purchases", value: "None" },
      { label: "Ads", value: "None" },
      { label: "Languages", value: "English" },
    ],

    hasPrivacyPolicy: false,
    supportEmail: "info@behemehal.org",
  },
];

export const getApp = (slug: string): AppEntry | undefined =>
  APPS.find((app) => app.slug === slug);

export const GAMES = APPS.filter((app) => app.kind === "game");

/** Everything that is not a game — the home page's "Behemehal Apps" band. */
export const TOOLS = APPS.filter((app) => app.kind === "app");
