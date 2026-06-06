import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const required = [
  "<title>Grid SCADA Risk Simulator</title>",
  "SCADA risk becomes visible before outage posture breaks.",
  "substation-north-17",
  "solar-farm-east-telemetry"
];
const missing = required.filter((marker) => !html.includes(marker));
if (missing.length > 0) {
  throw new Error(`Smoke check missing: ${missing.join(", ")}`);
}
console.log("smoke ok");
