import { useState } from "preact/hooks";
import { GitHubIcon } from "./ExtraIcons.tsx";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div class="ml-auto exsm:block hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        class="ml-auto w-[60px] h-[30px] text-center text-white hidden exsm:block border-2 rounded-md border-primary mt-[9px] hover:bg-primary transition-all ease-in-out duration-150 cursor-pointer select-none"
      >
        <span class="material-symbols-outlined block">menu</span>
      </div>
      {/* Menu */}
      <div
        dir="ltr"
        class="justify-items-start justify-end w-[250px] h-full bg-white fixed right-[0px] top-[0px] border-l-4 border-primary transition-all ease-in-out duration-[250ms] z-[60]"
        style={{ right: isOpen ? 0 : -260 }}
      >
        <div
          onClick={() => setIsOpen(false)}
          class="w-[35px] h-[35px] border-2 rounded-full border-primary mt-[9px] hover:text-white hover:bg-primary transition-all ease-in duration-150 cursor-pointer select-none ml-auto text-center pt-1 mr-2 text-primary"
        >
          <span class="material-symbols-outlined block">close</span>
        </div>
        <br />
        <a
          class="mt-2 ml-2 block text-primary text-left text-2xl"
          href="/#ellie"
          onClick={() => setIsOpen(false)}
        >
          Ellie
        </a>
        <a
          class="mt-2 ml-2 block text-primary text-left text-2xl"
          href="/#projects"
          onClick={() => setIsOpen(false)}
        >
          Projects
        </a>
        <a
          class="mt-4 ml-2 flex items-center gap-2 text-primary text-left text-xl"
          href="https://github.com/behemehal"
          target="_blank"
          rel="noreferrer"
          onClick={() => setIsOpen(false)}
        >
          <GitHubIcon width={22} height={22} color="#AA2129" />
          GitHub
        </a>
      </div>
    </div>
  );
}
