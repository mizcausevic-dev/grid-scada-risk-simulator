import { readFileSync } from "node:fs";
import { buildScadaSummary, type ScadaInput } from "./index.js";

const path = process.argv[2] ?? "fixtures/scada-scenarios.json";
const input = JSON.parse(readFileSync(path, "utf8")) as ScadaInput;
console.log(JSON.stringify(buildScadaSummary(input), null, 2));
