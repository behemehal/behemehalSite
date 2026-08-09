// Decorative circuit-board background with animated "energy" pulses.
const TRACES = [
  { d: "M1200,120 H980 V260 H820", dur: "5s", delay: "0s" },
  { d: "M1200,320 H1040 V460 H900 V640", dur: "7s", delay: "1.2s" },
  { d: "M1200,560 H1080 V700", dur: "4.5s", delay: "0.6s" },
  { d: "M700,800 V680 H860 V560", dur: "6.5s", delay: "2s" },
  { d: "M980,800 V720 H1120", dur: "5.5s", delay: "0.3s" },
  { d: "M820,0 V120 H960 V220", dur: "6s", delay: "1.6s" },
  { d: "M900,460 H760 V380", dur: "5s", delay: "2.4s" },
  { d: "M1000,600 H1200", dur: "4s", delay: "1s" },
  { d: "M1080,40 H900 V160", dur: "6.2s", delay: "0.9s" },
];

const PADS: [number, number][] = [
  [820, 260], [900, 640], [820, 120], [760, 380], [1120, 700],
  [960, 220], [1080, 700], [900, 160], [760, 560], [1080, 460],
];

export default function PcbTrace() {
  return (
    <svg
      class="absolute inset-0 w-full h-full opacity-70"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="rgba(255,255,255,0.09)" stroke-width="2">
        {TRACES.map((t) => <path d={t.d} />)}
      </g>
      <g fill="rgba(255,255,255,0.12)">
        {PADS.map(([x, y]) => <circle cx={x} cy={y} r="5" />)}
      </g>
      <g stroke="#AA2129" stroke-width="2.5" stroke-linecap="round">
        {TRACES.map((t) => (
          <path
            class="pcb-pulse"
            d={t.d}
            style={{ animationDuration: t.dur, animationDelay: t.delay }}
          />
        ))}
      </g>
    </svg>
  );
}
