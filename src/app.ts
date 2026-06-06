import express from "express";
import { readFileSync } from "node:fs";
import { buildScadaSummary, type ScadaInput } from "./index.js";

export function renderPage(input: ScadaInput): string {
  const summary = buildScadaSummary(input);
  const cards = summary.findings
    .map(
      (asset) => `<article class="asset ${asset.posture}"><span>${asset.posture}</span><h3>${asset.assetId}</h3><p>${asset.boardNarrative}</p><dl><div><dt>Risk</dt><dd>${asset.scadaRiskScore}</dd></div><div><dt>Latency</dt><dd>${asset.controlLatencyMs}ms</dd></div><div><dt>Blast radius</dt><dd>${asset.blastRadiusCustomers}</dd></div></dl><strong>${asset.nextAction}</strong></article>`
    )
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Grid SCADA Risk Simulator</title><meta name="description" content="Energy and utilities SCADA risk simulator for control latency, telemetry drift, outage blast radius, and remediation sequencing."/><style>:root{--bg:#050812;--panel:#0d1727;--text:#f4f1ea;--muted:#a8b3c7;--cyan:#25d7ef;--green:#58f0b3;--red:#ff6b87;--line:rgba(37,215,239,.24)}*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",sans-serif;color:var(--text);background:radial-gradient(circle at 86% 14%,rgba(255,209,102,.16),transparent 31rem),radial-gradient(circle at 12% 22%,rgba(37,215,239,.15),transparent 34rem),var(--bg)}main{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:56px 0}.hero{border:1px solid var(--line);border-radius:28px;padding:clamp(28px,5vw,64px);background:linear-gradient(135deg,rgba(13,23,39,.96),rgba(8,11,24,.92))}.kicker{color:var(--green);font-family:Consolas,monospace;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase}h1{max-width:1040px;margin:18px 0;font-size:clamp(3rem,7.8vw,6.55rem);line-height:.92;letter-spacing:-.075em}.lede{max-width:790px;color:var(--muted);font-size:1.24rem;line-height:1.7}.metrics,.grid{display:grid;gap:16px}.metrics{grid-template-columns:repeat(4,1fr);margin-top:34px}.metric,.asset{background:rgba(13,23,39,.9);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:22px}.metric small,dt{color:var(--muted);text-transform:uppercase;letter-spacing:.12em;font-size:.75rem}.metric b{display:block;margin-top:10px;font-size:2rem}.grid{grid-template-columns:repeat(3,1fr);margin-top:22px}.asset{min-height:340px}.asset span{color:var(--cyan);font-family:Consolas,monospace;text-transform:uppercase;letter-spacing:.14em;font-size:.76rem}.asset.critical{border-color:rgba(255,107,135,.45)}.asset.watch{border-color:rgba(255,209,102,.38)}h3{font-size:1.42rem;margin:12px 0 10px}p{color:var(--muted);line-height:1.6}dl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}dd{margin:5px 0 0;font-size:1.1rem;font-weight:800}strong{color:var(--text)}footer{margin-top:34px;color:var(--muted);font-family:Consolas,monospace}@media(max-width:900px){.metrics,.grid,dl{grid-template-columns:1fr}}</style></head><body><main><section class="hero"><div class="kicker">Energy / C++ + Python + SQL</div><h1>SCADA risk becomes visible before outage posture breaks.</h1><p class="lede">Grid SCADA Risk Simulator turns control latency, telemetry drift, manual overrides, patch lag, redundancy posture, and customer blast radius into one regulated infrastructure risk surface.</p><div class="metrics"><div class="metric"><small>Aggregate risk</small><b>${summary.aggregateRisk}</b></div><div class="metric"><small>Critical assets</small><b>${summary.criticalAssets}</b></div><div class="metric"><small>Max blast radius</small><b>${summary.maxBlastRadiusCustomers}</b></div><div class="metric"><small>Assets tracked</small><b>${summary.findings.length}</b></div></div></section><section class="grid">${cards}</section><footer>Primary recommendation: ${summary.primaryRecommendation}</footer></main></body></html>`;
}

export function createApp() {
  const app = express();
  const input = JSON.parse(readFileSync("fixtures/scada-scenarios.json", "utf8")) as ScadaInput;
  app.get("/", (_req, res) => res.type("html").send(renderPage(input)));
  app.get("/api/scada", (_req, res) => res.json(buildScadaSummary(input)));
  return app;
}

if (process.argv[1]?.endsWith("app.js")) {
  createApp().listen(4173, () => console.log("grid-scada-risk-simulator listening on http://localhost:4173"));
}
