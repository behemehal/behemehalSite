/**
 * Screenshot a page in headless Chromium, over the DevTools protocol.
 *
 *   node docs/shoot.mjs <chromium> <url> <out.png> [width] [height] [waitMs]
 *
 * Deliberately not Puppeteer: this is twenty lines of WebSocket and it works with
 * whatever Chromium is already on the machine.
 *
 * Two things here are not arbitrary, and both cost a day the first time:
 *
 * - **No `--virtual-time-budget`.** It starves `ResizeObserver`, so any layout that
 *   measures itself comes out collapsed — which looks exactly like a real bug in the
 *   app you are photographing. Real waits instead.
 * - **The wait is generous** (2.6s by default). A shorter one catches a frame from
 *   before the app has settled, and a screenshot that disagrees with the DOM is
 *   worse than no screenshot.
 *
 * And a trap that belongs to the caller: a navigation that only changes the hash
 * fires no `load` event. Give every shot a distinct query string, or each one is a
 * picture of whatever was already on screen.
 *
 * See docs/adding-an-app.md.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [chromium, url, out, w = "1440", h = "900", waitMs = "2600"] = process.argv.slice(2);
if (!chromium || !url || !out) {
  console.error("usage: node docs/shoot.mjs <chromium> <url> <out.png> [w] [h] [waitMs]");
  process.exit(2);
}

const PORT = 9412;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  chromium,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--window-size=${w},${h}`,
    `--user-data-dir=${process.env.TMPDIR ?? "/tmp"}/shoot-profile`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    wsUrl = (await res.json()).webSocketDebuggerUrl;
  } catch {
    await sleep(250);
  }
}
if (!wsUrl) {
  chrome.kill();
  throw new Error("Chromium never opened its debugging port");
}

const sock = new WebSocket(wsUrl);
await new Promise((r) => (sock.onopen = r));

let id = 1;
const waiting = new Map();
sock.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  const pending = waiting.get(message.id);
  if (pending) {
    waiting.delete(message.id);
    pending(message.result ?? message.error);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => {
    const n = id++;
    waiting.set(n, resolve);
    sock.send(JSON.stringify({ id: n, method, params, sessionId }));
  });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
// deviceScaleFactor 2 is why a 1440x900 shot lands as a 2880x1800 file: the site
// serves these at half size, and downscaling a 2x render is what keeps text crisp.
await send(
  "Emulation.setDeviceMetricsOverride",
  { width: +w, height: +h, deviceScaleFactor: 2, mobile: false },
  sessionId,
);
await send("Page.navigate", { url }, sessionId);
await sleep(+waitMs);

const shot = await send("Page.captureScreenshot", { format: "png" }, sessionId);
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(`wrote ${out}`);

sock.close();
chrome.kill();
