import { GitHubIcon } from "./ExtraIcons.tsx";

export interface FooterProps {
  showAttribute?: boolean;
}

export default function Footer(props: FooterProps) {
  return (
    <section
      class="w-full text-white px-4 text-center justify-center bg-black"
      style={{ minHeight: props?.showAttribute ? "250px" : "210px" }}
    >
      <img
        src="/img/bBrand/main.min.webp"
        class="h-[40px] w-[40px] block ml-auto mr-auto mt-5 mb-2"
        alt="Behemehal Logo: Red square with b letter inside also rounded corners"
      />
      <p class="text-sm">Behemehal</p>
      <p class="text-sm mt-2 mb-3">All Rights Reserved</p>
      <div class="flex flex-row mt-3 justify-center gap-2 flex-wrap">
        <a class="text-sm hover:underline" href="/support">Support</a>
        <a
          class="text-sm hover:underline"
          href="https://github.com/behemehal/Ellie-Language/blob/main/SECURITY.md"
        >
          Security Policy
        </a>
        <a
          class="text-sm hover:underline"
          href="https://github.com/behemehal/Ellie-Language/blob/main/CODE_OF_CONDUCT.md"
        >
          Code of Conduct
        </a>
        <a
          class="text-sm hover:underline"
          href="https://github.com/behemehal/Ellie-Language/blob/main/LICENSE"
        >
          GPL-2.0
        </a>
      </div>
      <br />
      <div class="flex flex-row justify-center gap-2 mb-4">
        <a aria-label="GitHub" href="https://github.com/behemehal">
          <GitHubIcon width={25} height={25} color={"white"} />
        </a>
      </div>
      <p class="text-xs text-white/40 mb-5">
        Founded by{" "}
        <a class="hover:text-white/70 transition-colors underline" href="/ahmetcan">
          Ahmetcan Aksu
        </a>
      </p>
      {props?.showAttribute && (
        <p class="text-sm mt-2 mb-3">
          Google Play and the Google Play logo are trademarks of Google LLC.
        </p>
      )}
    </section>
  );
}
