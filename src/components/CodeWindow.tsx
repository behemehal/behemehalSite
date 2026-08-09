import type { ComponentChildren } from "preact";

const KEYWORDS = new Set([
  "use", "fn", "let", "mut", "pub", "struct", "enum", "impl", "return", "self",
  "match", "if", "else", "for", "while", "class", "pri", "co", "v", "ret", "new",
  "import", "vec",
]);

// Token-level highlighting: strings green, keywords red, Types soft-yellow.
function tokenize(line: string): ComponentChildren {
  const nodes: ComponentChildren[] = [];
  const re = /("(?:[^"\\]|\\.)*"|'.')|([A-Za-z_][A-Za-z0-9_]*!?)|([^"'A-Za-z_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m[1] !== undefined) {
      nodes.push(<span class="text-[#98c379]">{m[1]}</span>);
    } else if (m[2] !== undefined) {
      const w = m[2];
      if (KEYWORDS.has(w.replace(/!$/, ""))) {
        nodes.push(<span class="text-primary font-semibold">{w}</span>);
      } else if (/^[A-Z]/.test(w)) {
        nodes.push(<span class="text-[#e5c07b]">{w}</span>);
      } else {
        nodes.push(w);
      }
    } else {
      nodes.push(m[3]);
    }
  }
  return <>{nodes}</>;
}

function WindowChrome({ label }: { label: string }) {
  return (
    <div class="flex items-center gap-2 px-4 py-3 bg-black/40">
      <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
      <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
      <span class="w-3 h-3 rounded-full bg-[#27c93f]"></span>
      <span class="ml-2 text-xs text-gray-400">{label}</span>
    </div>
  );
}

export function CodeWindow({ filename, code }: { filename: string; code: string }) {
  return (
    <div class="w-full max-w-[560px] rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-[#181320]">
      <WindowChrome label={filename} />
      <pre class="p-4 text-[13px] leading-relaxed overflow-x-auto text-gray-200 font-mono"><code>{code.split("\n").map((l) =>
        !l.length
          ? <div>{" "}</div>
          : l.trimStart().startsWith("//")
          ? <div class="text-gray-500">{l}</div>
          : <div>{tokenize(l)}</div>
      )}</code></pre>
    </div>
  );
}

function cliLine(l: string): ComponentChildren {
  if (!l.length) return " ";
  const t = l.trimStart();
  if (t.startsWith("#")) return <span class="text-gray-500">{l}</span>;
  if (t.startsWith("$")) {
    const rest = l.replace(/^\s*\$\s?/, "");
    const parts = rest.split(" ");
    return (
      <>
        <span class="text-[#27c93f]">$</span>{" "}
        {parts.map((p, i) =>
          i === 0
            ? <span class="text-primary font-semibold">{p} </span>
            : <span class={p.startsWith("--") ? "text-[#e5c07b]" : "text-gray-200"}>{p} </span>
        )}
      </>
    );
  }
  return <span class="text-gray-400">{l}</span>;
}

export function TerminalWindow({ title = "bash", code }: { title?: string; code: string }) {
  return (
    <div class="w-full max-w-[560px] rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-[#0d0d12]">
      <WindowChrome label={title} />
      <pre class="p-4 text-[13px] leading-relaxed overflow-x-auto font-mono"><code>{code.split("\n").map((l) => <div>{cliLine(l)}</div>)}</code></pre>
    </div>
  );
}
