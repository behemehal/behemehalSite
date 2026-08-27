import AppTile from "./AppTile.tsx";
import { GAMES } from "../data/apps.ts";

/**
 * "Behemehal Games" band on the home page. Renders every entry in the catalog
 * with kind: "game" — nothing to touch here when a new game ships.
 */
export default function GamesSection() {
  if (GAMES.length === 0) return null;

  return (
    <section
      id="games"
      class="relative w-full px-12 exsm:px-6 py-16 bg-black overflow-hidden"
    >
      <div
        class="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(170,33,41,0.30), transparent 55%), radial-gradient(circle at 10% 90%, rgba(70,43,69,0.45), transparent 55%)",
        }}
      >
      </div>

      <div class="relative z-10 max-w-[1200px] mx-auto grid grid-cols-2 exsm:grid-cols-1 gap-12 items-center">
        <div class="exsm:text-center">
          <div class="flex items-center gap-3 exsm:justify-center">
            <span
              class="material-symbols-outlined text-primary"
              style={{ fontSize: "32px" }}
            >
              sports_esports
            </span>
            <h2 class="text-4xl exsm:text-3xl text-white">Behemehal Games</h2>
          </div>
          <p class="text-white/80 text-lg mt-4 max-w-[520px] exsm:mx-auto">
            The same engineering, pointed at something you play. Built in-house,
            offline-first, and free of real-money purchases — every one of them
            gets its own page here, with screenshots, data-safety details and a
            privacy policy.
          </p>
          <a
            href="/apps"
            class="inline-flex items-center gap-2 mt-7 bg-primary hover:bg-primary/80 transition-colors text-white px-5 py-3 rounded-md"
          >
            All apps &amp; games
            <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>
              arrow_forward
            </span>
          </a>
        </div>

        <div class="grid gap-6">
          {GAMES.map((app) => <AppTile app={app} />)}
        </div>
      </div>
    </section>
  );
}
