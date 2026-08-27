import MobileMenu from "./MobileMenu.tsx";
import { GitHubIcon } from "./ExtraIcons.tsx";

export default function Navbar() {
  return (
    <section class="w-full h-[50px] px-4 flex flex-row items-center bg-primaryDark fixed z-50">
      <a href="/" class="flex flex-row items-center">
        <img
          src="/img/bBrand/main.min.webp"
          class="h-[30px] w-[30px]"
          alt="Behemehal Logo: Red square with b letter inside also rounded corners"
        />
        <p class="exsm:hidden text-2xl text-white ml-1">Behemehal</p>
      </a>
      <div class="flex flex-row items-center ml-auto gap-4 exsm:hidden">
        <a class="text-white hover:text-gray-300 transition-colors" href="/#ellie">Ellie</a>
        <a class="text-white hover:text-gray-300 transition-colors" href="/#projects">Projects</a>
        <a class="text-white hover:text-gray-300 transition-colors" href="/apps">Games</a>
        <a
          class="flex items-center opacity-90 hover:opacity-100 transition-opacity"
          href="https://github.com/behemehal"
          target="_blank"
          rel="noreferrer"
          aria-label="Behemehal on GitHub"
        >
          <GitHubIcon width={24} height={24} color="white" />
        </a>
      </div>
      <MobileMenu />
    </section>
  );
}
