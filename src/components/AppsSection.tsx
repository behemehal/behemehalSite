import AppTile from "./AppTile.tsx";
import { TOOLS } from "../data/apps.ts";

/**
 * "Behemehal Apps" band on the home page — the counterpart to Behemehal Games,
 * rendering every catalog entry with kind: "app". Nothing to touch here when a
 * new one ships.
 *
 * Mirrored rather than shared with GamesSection on purpose: the two bands sit
 * one above the other and read as a pair, which they only do while the copy and
 * the tint can differ. The tile is the part worth sharing, and it is.
 */
export default function AppsSection() {
  if (TOOLS.length === 0) return null;

  return (
    <section
      id="apps"
      class="relative w-full px-12 exsm:px-6 py-16 bg-black overflow-hidden"
    >
      <div
        class="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(91,82,240,0.28), transparent 55%), radial-gradient(circle at 88% 85%, rgba(147,51,234,0.30), transparent 55%)",
        }}
      >
      </div>

      {/* The tiles lead here, opposite the games band, so the two alternate down
          the page instead of stacking into one column of text. */}
      <div class="relative z-10 max-w-[1200px] mx-auto grid grid-cols-2 exsm:grid-cols-1 gap-12 items-center">
        <div class="grid gap-6 exsm:order-2">
          {TOOLS.map((app) => <AppTile app={app} />)}
        </div>

        <div class="exsm:text-center exsm:order-1">
          <div class="flex items-center gap-3 exsm:justify-center">
            <span
              class="material-symbols-outlined text-primary"
              style={{ fontSize: "32px" }}
            >
              terminal
            </span>
            <h2 class="text-4xl exsm:text-3xl text-white">Behemehal Apps</h2>
          </div>
          <p class="text-white/80 text-lg mt-4 max-w-[520px] exsm:mx-auto">
            Tools we built because we wanted them on our own machines. Local-first,
            no accounts, and nothing phoning home — the same rule as the games, minus
            the neon.
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
      </div>
    </section>
  );
}
