import type { ComponentChildren } from "preact";
import { GitHubIcon } from "./ExtraIcons.tsx";
import TechCard from "./TechCard.tsx";
import Footer from "./Footer.tsx";
import PcbTrace from "./PcbTrace.tsx";
import GamesSection from "./GamesSection.tsx";
import { CodeWindow, TerminalWindow } from "./CodeWindow.tsx";

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

const ELLIE_CODE = `//A generic, type-safe array chunker
class Chunker<T> {
    co(chunkCount, items);
    pri v chunkCount : int;
    pri v items : [T, *];

    fn chunks() : [[T, *], *] {
        v chunks : [[T, *], *];
        v temp : [T, self.chunkCount];
        for i : self.items.len {
            if temp.len == self.chunkCount {
                chunks.push(temp);
                temp.clean();
            } else {
                temp.push(this.items[i]!);
            }
        }
        ret chunks;
    }
}`;

const MENEMEN_CODE = `use menemen::request::{Request, RequestTypes};

fn main() {
    let mut req = Request::new(
        "http://postman-echo.com/get",
        RequestTypes::GET,
    ).unwrap();

    let mut res = req.send().unwrap();
    let mut buf = Vec::new();
    res.stream.read_to_end(&mut buf);

    println!("{}", String::from_utf8_lossy(&buf));
}`;

const SAFEEN_CODE = `use safe_en::{table::{TableRow, TypeDefs}, Database};

let mut db = Database::new();

db.create_table("users", vec![
    TableRow::new("id", TypeDefs::I64),
    TableRow::new("email", TypeDefs::String),
]).unwrap();

db.table("users").unwrap()
    .insert(vec![1_i64.into(), "ahmet@mail.com".into()])
    .unwrap();

db.save("./users.sfn").unwrap();`;

const NMEA_CODE = `use rust_nmea::parser::Parser;

// A raw GPS sentence from the receiver
let line = "$GPGGA,161009.00,1122.20418,N,02339.35234,E,1,08,1.09,11.5,M,11.3,M,,*62";

let fix = Parser::parse_line(line).unwrap();

// -> GGA { satellites: 8, altitude: 11.5, lat, lon, .. }`;

const WOLE_CLI = `# Wake a single device
$ wole --mac 2c:2c:2c:2c:2c:2c --ip 192.168.1.100

# Wake several devices at once
$ wole --mac 2c:.. --ip 192.168.1.100 --mac 2a:.. --ip 192.168.1.102

# Listen for incoming magic packets
$ wole --listen 192.168.1.108`;

function LangBadge({ language }: { language: string }) {
  const colors: Record<string, string> = { Rust: "#dea584", Dart: "#00B4AB" };
  return (
    <span class="inline-flex items-center gap-1 text-xs text-white/90">
      <span class="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: colors[language] ?? "#fff" }}></span>
      {language}
    </span>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  language: string;
  icon: string;
  github: string;
  crates?: string;
  reversed?: boolean;
  children: ComponentChildren;
}

function Feature(props: FeatureProps) {
  return (
    <div class="grid grid-cols-2 exsm:grid-cols-1 gap-10 items-center py-12 border-t border-white/10 first:border-t-0">
      <div class={`exsm:text-center ${props.reversed ? "order-2 exsm:order-1" : ""}`}>
        <div class="flex items-center gap-3 exsm:justify-center">
          <MatIcon name={props.icon} size={40} color="#fff" />
          <h3 class="text-3xl text-white">{props.title}</h3>
        </div>
        <div class="mt-3 exsm:flex exsm:justify-center">
          <LangBadge language={props.language} />
        </div>
        <p class="text-white/90 mt-3 max-w-[460px] exsm:mx-auto">{props.description}</p>
        <div class="flex items-center gap-5 mt-5 exsm:justify-center">
          <a href={props.github} target="_blank" rel="noreferrer" class="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <GitHubIcon width={20} height={20} color="white" /> GitHub
          </a>
          {props.crates && (
            <a href={props.crates} target="_blank" rel="noreferrer" class="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>deployed_code</span> crates.io
            </a>
          )}
        </div>
      </div>
      <div class={`flex justify-center ${props.reversed ? "order-1 exsm:order-2" : ""}`}>
        {props.children}
      </div>
    </div>
  );
}

export default function HomeBody() {
  return (
    <>
      {/* Hero */}
      <section id="top" class="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-primaryDark">
        <PcbTrace />
        <div
          class="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(170,33,41,0.45), transparent 45%), radial-gradient(circle at 82% 70%, rgba(70,43,69,0.55), transparent 45%)",
          }}
        >
        </div>

        <div class="relative z-10 w-full max-w-[1100px] mx-auto px-8 pt-[50px] exsm:text-center">
          <img src="/img/bBrand/main.min.webp" width={56} height={56} alt="Behemehal logo" class="mb-6 exsm:mx-auto" />
          <h1 class="text-white font-bold leading-[1.05] text-6xl exsm:text-4xl">
            Open source solutions
            <br />
            to the <span class="text-primary">open source</span> world
          </h1>
          <p class="mt-6 max-w-[620px] text-white/85 text-xl exsm:text-lg exsm:mx-auto">
            Behemehal builds smart, type-safe technologies — from embedded systems to
            the web — to increase <strong>accessibility</strong> and help people reach
            their <strong>goals</strong>.
          </p>
          <div class="flex flex-wrap gap-4 mt-9 exsm:justify-center">
            <a href="#projects" class="bg-primary hover:bg-primary/80 transition-colors text-white text-lg px-6 py-3 rounded-md flex items-center gap-2">
              Explore Projects
              <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_forward</span>
            </a>
            <a href="#ellie" class="border border-white/60 hover:bg-white/10 transition-colors text-white text-lg px-6 py-3 rounded-md flex items-center gap-2">
              <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>code</span>
              Meet Ellie
            </a>
          </div>
        </div>

        <a href="#ellie" aria-label="Scroll down" class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce z-10">
          <span class="material-symbols-outlined" style={{ fontSize: "34px" }}>keyboard_arrow_down</span>
        </a>
      </section>

      {/* Flagship: Ellie-Language */}
      <section id="ellie" class="w-full min-h-[550px] p-12 bg-gradient-to-br from-techCardColor to-black flex items-center">
        <div class="w-full max-w-[1200px] mx-auto grid grid-cols-2 exsm:grid-cols-1 gap-10 items-center">
          <div class="exsm:text-center">
            <div class="flex items-center gap-3 exsm:justify-center">
              <img width={64} height={64} src="/img/bProducts/EllieCharIcon.webp" alt="Ellie Language logo" />
              <span class="text-primary text-sm uppercase tracking-widest">Flagship Project</span>
            </div>
            <h1 class="text-5xl text-white mt-4">Ellie-Language</h1>
            <p class="text-white text-xl mt-4 max-w-[520px] exsm:mx-auto">
              A type-safe programming language that runs on embedded and sandboxed
              environments — powered by Rust.
            </p>
            <div class="flex flex-wrap gap-2 mt-5 exsm:justify-center">
              {["Type-safe", "Embedded", "Sandboxed", "Rust"].map((tag) => (
                <span class="text-white text-sm border border-white/40 rounded-full px-3 py-1">{tag}</span>
              ))}
            </div>
            <div class="flex flex-wrap gap-3 mt-7 exsm:justify-center">
              <a href="https://www.ellie-lang.org" target="_blank" rel="noreferrer" class="bg-primary hover:bg-primary/80 transition-colors text-white px-5 py-2 rounded-md flex items-center gap-2">
                <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>language</span>
                Website
              </a>
              <a href="https://playground.ellie-lang.org" target="_blank" rel="noreferrer" class="border border-white/60 hover:bg-white/10 transition-colors text-white px-5 py-2 rounded-md flex items-center gap-2">
                <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>play_circle</span>
                Playground
              </a>
              <a href="https://github.com/behemehal/Ellie-Language" target="_blank" rel="noreferrer" class="border border-white/60 hover:bg-white/10 transition-colors text-white px-5 py-2 rounded-md flex items-center gap-2">
                <GitHubIcon width={20} height={20} color="white" />
                GitHub
              </a>
            </div>
          </div>
          <div class="flex justify-center">
            <CodeWindow filename="chunker.ei" code={ELLIE_CODE} />
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section id="projects" class="w-full bg-primaryDark px-12 py-16">
        <div class="max-w-[1200px] mx-auto">
          <h1 class="text-4xl text-white exsm:text-center">Projects</h1>
          <p class="text-white/80 mt-2 max-w-[620px] exsm:text-center exsm:mx-auto">
            Open source libraries and tools built with Rust — designed to be small,
            portable and dependable.
          </p>

          <div class="mt-6">
            <Feature
              title="Menemen"
              language="Rust"
              icon="swap_horiz"
              description="A streaming http/https client for Rust. Read responses as a stream instead of buffering everything in memory."
              github="https://github.com/behemehal/menemen"
              crates="https://crates.io/crates/menemen"
            >
              <CodeWindow filename="main.rs" code={MENEMEN_CODE} />
            </Feature>

            <Feature
              title="SafeEn"
              language="Rust"
              icon="dns"
              description="A local database for situations that need strict data integrity and absolute portability. Typed tables, simple queries, single-file storage."
              github="https://github.com/behemehal/SafeEn"
              crates="https://crates.io/crates/safe_en"
              reversed
            >
              <CodeWindow filename="main.rs" code={SAFEEN_CODE} />
            </Feature>

            <Feature
              title="Wole"
              language="Rust"
              icon="power_settings_new"
              description="Wake-On-LAN made simple. Generate, send and listen for magic packets — straight from your terminal or as a library."
              github="https://github.com/ahmetcanaksu/Wole"
              crates="https://crates.io/crates/wole"
            >
              <TerminalWindow title="wole" code={WOLE_CLI} />
            </Feature>

            <Feature
              title="Rust-NMEA"
              language="Rust"
              icon="satellite_alt"
              description="A parser for NMEA 0183 sentences — turn raw GPS/GNSS output into typed, ready-to-use position data. Serial port not included."
              github="https://github.com/ahmetcanaksu/Rust-NMEA"
              crates="https://crates.io/crates/rust_nmea"
              reversed
            >
              <CodeWindow filename="gps.rs" code={NMEA_CODE} />
            </Feature>
          </div>
        </div>
      </section>

      {/* Behemehal Games */}
      <GamesSection />

      {/* More open source */}
      <section class="w-full bg-primary px-12 py-16 exsm:text-center">
        <h2 class="text-3xl text-white">More open source</h2>
        <br />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,450px))] justify-center gap-5">
          <TechCard
            title="event_listener"
            description="NodeJS-like event listener library for Dart."
            language="Dart"
            image={<MatIcon name="sensors" />}
            links={[gh("https://github.com/behemehal/event_listener")]}
          />
          <TechCard
            title="rust_event_listener"
            description="NodeJS-like event listener library for Rust."
            language="Rust"
            image={<MatIcon name="sensors" />}
            links={[gh("https://github.com/behemehal/rust_event_listener")]}
          />
          <TechCard
            title="Rusty6502"
            description="A rusty 6502 CPU emulator."
            language="Rust"
            image={<MatIcon name="memory" />}
            links={[gh("https://github.com/ahmetcanaksu/Rusty6502")]}
          />
        </div>
        <p class="text-white text-center mt-12">Contact us for collaborations</p>
        <a href="mailto:info@behemehal.org" class="block ml-auto mr-auto mt-4 text-center text-white text-xl hover:underline">
          info@behemehal.org
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
