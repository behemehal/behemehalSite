import type { AppEntry } from "../data/apps.ts";

export interface AppTileProps {
  app: AppEntry;
  /** Show the first screenshots peeking out on the right. Off on narrow grids. */
  showPreview?: boolean;
}

/**
 * Store-style tile for one app. Used by the home page's games section and by
 * the /apps index — the whole card is one link to the detail page.
 */
export default function AppTile({ app, showPreview = true }: AppTileProps) {
  return (
    <a
      href={`/apps/${app.slug}`}
      class="group block bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-primary/70 rounded-2xl p-5 transition-all hover:-translate-y-1"
    >
      <div class="flex items-start gap-4">
        <img
          src={app.icon}
          width={72}
          height={72}
          loading="lazy"
          alt={`${app.name} icon`}
          class="w-[72px] h-[72px] rounded-2xl shrink-0 shadow-lg shadow-black/40"
        />
        <div class="min-w-0 flex-1">
          <h3 class="text-2xl text-white leading-tight truncate">{app.name}</h3>
          <p class="text-primary text-xs uppercase tracking-widest mt-1">
            {app.category}
          </p>
          <p class="text-white/75 text-sm mt-2 line-clamp-3">{app.tagline}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 mt-4">
        {app.tags.map((tag) => (
          <span class="text-white/80 text-xs border border-white/20 rounded-full px-3 py-1">
            {tag}
          </span>
        ))}
      </div>

      {showPreview && app.screenshots.length > 0 && (
        <div class="flex gap-2 mt-5 overflow-hidden">
          {app.screenshots.slice(0, 4).map((shot) => (
            <img
              src={shot.src}
              width={96}
              height={171}
              loading="lazy"
              alt={shot.caption}
              class="w-[96px] h-[171px] object-cover rounded-lg border border-white/10 shrink-0"
            />
          ))}
        </div>
      )}

      <span class="inline-flex items-center gap-1 text-white mt-5 text-sm group-hover:gap-2 transition-all">
        {app.playUrl ? "View on Behemehal" : "Details & coming soon"}
        <span class="material-symbols-outlined" style={{ fontSize: "18px" }}>
          arrow_forward
        </span>
      </span>
    </a>
  );
}
