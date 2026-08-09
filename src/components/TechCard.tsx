// deno-lint-ignore-file no-explicit-any
import type { ComponentChildren } from "preact";

export interface Links {
  link: string;
  icon: ComponentChildren;
  label: string;
}

export interface TechCardProps {
  title: string;
  description: string;
  links: Links[];
  image: ComponentChildren;
  language?: string;
}

const LANG_COLORS: Record<string, string> = {
  Rust: "#dea584",
  Dart: "#00B4AB",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C#": "#178600",
  C: "#555555",
};

export default function TechCard(props: TechCardProps) {
  return (
    <div class="exsm:min-h-[320px] w-full max-w-[450px] min-h-[175px] bg-techCardColor rounded-2xl border-solid border-2 border-white p-5 transition-transform hover:-translate-y-1">
      <div class="p-3 ml-auto hidden exsm:block exsm:mr-auto">
        {/* Image */}
        {props.image}
      </div>
      <div class="flex text-white">
        {/* Texts */}
        <div class="flex-1 min-w-0">
          {/* Title */}
          <h1 class="text-2xl">{props.title}</h1>
          {/* Description */}
          <p class="text-sm mt-2">{props.description}</p>
          {/* Bottom row: language badge + links */}
          <div class="flex flex-row items-center mt-3 exsm:justify-center gap-3">
            {props.language && (
              <span class="flex items-center gap-1 text-xs opacity-90">
                <span
                  class="inline-block w-[10px] h-[10px] rounded-full"
                  style={{ backgroundColor: LANG_COLORS[props.language] ?? "#ffffff" }}
                >
                </span>
                {props.language}
              </span>
            )}
            <div class="flex flex-row items-center gap-1 ml-auto exsm:ml-0">
              {props.links.map((link) => (
                <a
                  aria-label={link.label}
                  class="text-white hover:opacity-70 transition-opacity"
                  href={link.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div class="shrink-0 p-3 h-[96px] w-[96px] ml-auto exsm:hidden">
          {/* Image */}
          {props.image}
        </div>
      </div>
    </div>
  );
}
