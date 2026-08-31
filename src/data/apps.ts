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
  value: string;
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
];

export const getApp = (slug: string): AppEntry | undefined =>
  APPS.find((app) => app.slug === slug);

export const GAMES = APPS.filter((app) => app.kind === "game");
