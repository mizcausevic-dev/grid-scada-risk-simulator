import { readFileSync } from "node:fs";

const sql = readFileSync("sql/scada_risk_views.sql", "utf8");
const required = ["utility.scada_asset_risk", "utility.board_scada_posture", "scada_risk_score", "scada_posture", "raw_scada_scenarios"];
const missing = required.filter((marker) => !sql.includes(marker));
if (missing.length > 0) {
  throw new Error(`SQL contract missing: ${missing.join(", ")}`);
}
console.log("sql contract ok");
