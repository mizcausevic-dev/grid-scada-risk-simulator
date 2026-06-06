import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { ScadaInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/scada-scenarios.json", "utf8")) as ScadaInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");
