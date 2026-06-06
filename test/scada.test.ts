import { describe, expect, it } from "vitest";
import fixture from "../fixtures/scada-scenarios.json" with { type: "json" };
import { buildScadaSummary, postureFor, scoreScenario } from "../src/index.js";

describe("grid scada risk simulator", () => {
  it("prioritizes the high blast-radius substation", () => {
    const summary = buildScadaSummary(fixture);
    expect(summary.findings[0].assetId).toBe("substation-north-17");
    expect(summary.findings[0].posture).toBe("critical");
    expect(summary.criticalAssets).toBe(1);
  });

  it("scores deterministic SCADA posture", () => {
    expect(postureFor(72)).toBe("critical");
    expect(postureFor(38)).toBe("watch");
    expect(postureFor(12)).toBe("stable");
    expect(scoreScenario(fixture.scenarios[2])).toBeLessThan(scoreScenario(fixture.scenarios[0]));
  });
});
