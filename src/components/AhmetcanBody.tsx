import { GitHubIcon } from "./ExtraIcons.tsx";
import TechCard from "./TechCard.tsx";
import Footer from "./Footer.tsx";
import PcbTrace from "./PcbTrace.tsx";
import { CodeWindow } from "./CodeWindow.tsx";

function MatIcon({ name, size = 96, color = "white" }: { name: string; size?: number; color?: string }) {
  return (
    <span class="material-symbols-outlined" style={{ fontSize: `${size}px`, width: size, height: size, color }}>
      {name}
    </span>
  );
}

const gh = (link: string) => ({
  link,
  label: "GitHub",
  icon: <GitHubIcon width={25} height={25} color="white" />,
});

const DEV_CODE = `fn main() {
    let developer = Developer {
        name: "Ahmetcan Aksu",
        location: "Istanbul, Turkey",
        languages: vec!["Rust", "TypeScript", "C#", "Dart"],
        focus: "Fintech & language design",
    };

    println!("Building the future, one commit at a time!");
}`;

const STACK = [
  "Rust", "TypeScript", "JavaScript", "C#", "Dart", "C",
  "Node.js", ".NET", "PostgreSQL", "MongoDB", "Docker", "Flutter",
];

export default function AhmetcanBody() {
  return (
    <>
      {/* Hero */}
      <section class="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-primaryDark">
        <PcbTrace />
        <div
          class="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 25%, rgba(170,33,41,0.4), transparent 45%), radial-gradient(circle at 80% 75%, rgba(70,43,69,0.55), transparent 45%)",
          }}
        >
        </div>

        <div class="relative z-10 w-full max-w-[1200px] mx-auto px-8 pt-[50px] grid grid-cols-2 exsm:grid-cols-1 gap-10 items-center">
          <div class="exsm:text-center">
            <span class="text-primary text-sm uppercase tracking-widest">Software Developer</span>
            <h1 class="text-white font-bold text-6xl exsm:text-4xl mt-3">Ahmetcan Aksu</h1>
            <p class="mt-5 max-w-[520px] text-white/85 text-lg exsm:mx-auto">
              Open source enthusiast from Istanbul, Turkey — building programming
              languages, developer tools and scalable software. Backend developer at
              <strong> Fonmap</strong> and creator of the <strong>Ellie</strong> language.
            </p>
            <div class="flex flex-wrap gap-3 mt-7 exsm:justify-center">
              <a href="https://ahmetcanaksu.com" target="_blank" rel="noreferrer" class="bg-primary hover:bg-primary/80 transition-colors text-white px-5 py-2 rounded-md flex items-center gap-2">
                <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>language</span>
                Portfolio
              </a>
              <a href="https://github.com/ahmetcanaksu" target="_blank" rel="noreferrer" class="border border-white/60 hover:bg-white/10 transition-colors text-white px-5 py-2 rounded-md flex items-center gap-2">
                <GitHubIcon width={20} height={20} color="white" />
                GitHub
              </a>
              <a href="mailto:hello@ahmetcanaksu.com" class="border border-white/60 hover:bg-white/10 transition-colors text-white px-5 py-2 rounded-md flex items-center gap-2">
                <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>mail</span>
                Email
              </a>
            </div>
          </div>
          <div class="flex justify-center">
            <CodeWindow filename="developer.rs" code={DEV_CODE} />
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section class="w-full bg-black px-12 py-16">
        <div class="max-w-[1000px] mx-auto text-center">
          <h2 class="text-3xl text-white">Tech I work with</h2>
          <div class="flex flex-wrap justify-center gap-3 mt-8">
            {STACK.map((tech) => (
              <span class="text-white/90 border border-white/25 rounded-full px-4 py-2 hover:border-primary hover:text-white transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section class="w-full bg-primary px-12 py-16 exsm:text-center">
        <div class="max-w-[1200px] mx-auto">
          <h2 class="text-3xl text-white">Things I've built</h2>
          <p class="text-white/80 mt-2">A few open source projects I maintain or created.</p>
          <br />
          <div class="grid justify-items-center sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            <TechCard
              title="Ellie-Language"
              description="A type-safe programming language for embedded and sandboxed environments."
              language="Rust"
              image={<MatIcon name="terminal" />}
              links={[gh("https://github.com/behemehal/Ellie-Language")]}
            />
            <TechCard
              title="Wole"
              description="Wake-On-LAN magic packet generator, sender & listener CLI."
              language="Rust"
              image={<MatIcon name="power_settings_new" />}
              links={[gh("https://github.com/ahmetcanaksu/Wole")]}
            />
            <TechCard
              title="Menemen"
              description="A streaming http/https request library for Rust."
              language="Rust"
              image={<MatIcon name="swap_horiz" />}
              links={[gh("https://github.com/behemehal/menemen")]}
            />
            <TechCard
              title="SafeEn"
              description="Local database with strict data integrity and portability."
              language="Rust"
              image={<MatIcon name="dns" />}
              links={[gh("https://github.com/behemehal/SafeEn")]}
            />
            <TechCard
              title="Rust-NMEA"
              description="A parser for NMEA sentences (GPS data) written in Rust."
              language="Rust"
              image={<MatIcon name="satellite_alt" />}
              links={[gh("https://github.com/ahmetcanaksu/Rust-NMEA")]}
            />
            <TechCard
              title="Rusty6502"
              description="A rusty 6502 CPU emulator."
              language="Rust"
              image={<MatIcon name="memory" />}
              links={[gh("https://github.com/ahmetcanaksu/Rusty6502")]}
            />
          </div>
          <a
            href="https://github.com/ahmetcanaksu?tab=repositories"
            target="_blank"
            rel="noreferrer"
            class="inline-block mt-10 text-white underline hover:no-underline"
          >
            View all repositories →
          </a>
        </div>
      </section>

      {/* Contact */}
      <section class="w-full bg-primaryDark px-12 py-20 text-center">
        <h2 class="text-4xl text-white">Let's connect</h2>
        <p class="text-white/80 mt-3">Always up for a chat about Rust, languages or fintech.</p>
        <div class="flex flex-wrap justify-center gap-4 mt-8">
          <a href="mailto:hello@ahmetcanaksu.com" class="text-white hover:text-primary transition-colors">hello@ahmetcanaksu.com</a>
          <span class="text-white/30">·</span>
          <a href="https://www.linkedin.com/in/ahmetcanaksu/" target="_blank" rel="noreferrer" class="text-white hover:text-primary transition-colors">LinkedIn</a>
          <span class="text-white/30">·</span>
          <a href="https://twitter.com/ahmetcanaksu" target="_blank" rel="noreferrer" class="text-white hover:text-primary transition-colors">Twitter / X</a>
          <span class="text-white/30">·</span>
          <a href="https://github.com/ahmetcanaksu" target="_blank" rel="noreferrer" class="text-white hover:text-primary transition-colors">GitHub</a>
        </div>
        <a href="/" class="inline-block mt-12 text-white/60 hover:text-white transition-colors text-sm">← Back to Behemehal</a>
      </section>

      <Footer />
    </>
  );
}
