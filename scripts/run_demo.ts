import { readFileSync } from "node:fs";
import { buildScadaSummary, type ScadaInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/scada-scenarios.json", "utf8")) as ScadaInput;
const summary = buildScadaSummary(input);
console.log(`estate=${summary.estate}`);
console.log(`risk=${summary.aggregateRisk}`);
console.log(`critical=${summary.criticalAssets}`);
console.log(`recommendation=${summary.primaryRecommendation}`);
