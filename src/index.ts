export interface ScadaScenario {
  assetId: string;
  owner: string;
  controlLatencyMs: number;
  telemetryDriftMinutes: number;
  manualOverrideCount: number;
  blastRadiusCustomers: number;
  patchLagDays: number;
  redundancyScore: number;
  nextAction: string;
}

export interface ScadaInput {
  estate: string;
  scenarios: ScadaScenario[];
}

export interface ScadaFinding extends ScadaScenario {
  scadaRiskScore: number;
  posture: "critical" | "watch" | "stable";
  boardNarrative: string;
}

export interface ScadaSummary {
  estate: string;
  aggregateRisk: number;
  criticalAssets: number;
  maxBlastRadiusCustomers: number;
  findings: ScadaFinding[];
  primaryRecommendation: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function scoreScenario(scenario: ScadaScenario): number {
  const raw =
    scenario.controlLatencyMs * 0.035 +
    scenario.telemetryDriftMinutes * 0.95 +
    scenario.manualOverrideCount * 5.4 +
    scenario.blastRadiusCustomers * 0.0011 +
    scenario.patchLagDays * 0.52 -
    scenario.redundancyScore * 0.28;
  return Number(clamp(raw).toFixed(2));
}

export function postureFor(score: number): ScadaFinding["posture"] {
  if (score >= 72) return "critical";
  if (score >= 38) return "watch";
  return "stable";
}

export function buildScadaSummary(input: ScadaInput): ScadaSummary {
  const findings = input.scenarios
    .map((scenario) => {
      const scadaRiskScore = scoreScenario(scenario);
      const posture = postureFor(scadaRiskScore);
      return {
        ...scenario,
        scadaRiskScore,
        posture,
        boardNarrative: `${scenario.assetId} is ${posture} because latency, telemetry drift, manual overrides, patch lag, and customer blast radius resolve into a ${scadaRiskScore} SCADA risk score.`
      };
    })
    .sort((a, b) => b.scadaRiskScore - a.scadaRiskScore);

  const aggregateRisk = Number(
    (findings.reduce((total, asset) => total + asset.scadaRiskScore, 0) / Math.max(1, findings.length)).toFixed(2)
  );
  const criticalAssets = findings.filter((asset) => asset.posture === "critical").length;
  const maxBlastRadiusCustomers = Math.max(0, ...findings.map((asset) => asset.blastRadiusCustomers));
  const primaryRecommendation = findings[0]?.nextAction ?? "No SCADA scenarios were supplied.";
  return { estate: input.estate, aggregateRisk, criticalAssets, maxBlastRadiusCustomers, findings, primaryRecommendation };
}
