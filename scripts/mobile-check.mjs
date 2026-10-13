// Node + CDP: otvori stranicu u headless Chrome-u na širini telefona i nađi elemente šire od ekrana.
import { spawn } from "node:child_process";
const url = process.argv[2] ?? "http://localhost:3000/";
const width = Number(process.argv[3] ?? 390);
const port = 9333;
const chrome = spawn("google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(250); } }
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(4000);
const script = `(() => { const vw = document.documentElement.clientWidth; const out = [];
  for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width > 0 && r.right > vw + 1 && cs.position !== 'fixed') {
      // preskoči decu elemenata koji sami seku overflow (marquee, horizontalni skroleri)
      let p = el.parentElement, clipped = false; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') { clipped = true; break; } p = p.parentElement; }
      if (clipped) continue;
      out.push({ right: Math.round(r.right), w: Math.round(r.width), el: (el.tagName.toLowerCase() + '.' + String(el.getAttribute('class') || '').split(' ').slice(0, 5).join('.')).slice(0, 110), text: (el.textContent || '').trim().slice(0, 30) }); } }
  return JSON.stringify({ vw, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth, n: out.length, items: out.slice(0, 30) }); })()`;
const res = await send("Runtime.evaluate", { expression: script, returnByValue: true });
console.log(JSON.stringify(JSON.parse(res.result.result.value), null, 1));
if (process.argv[4]) { const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }); (await import("node:fs")).writeFileSync(process.argv[4], Buffer.from(shot.result.data, "base64")); }
ws.close(); chrome.kill();
