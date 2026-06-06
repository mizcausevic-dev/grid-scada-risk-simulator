import json
from pathlib import Path


def _score(scenario):
    raw = (
        scenario["controlLatencyMs"] * 0.035
        + scenario["telemetryDriftMinutes"] * 0.95
        + scenario["manualOverrideCount"] * 5.4
        + scenario["blastRadiusCustomers"] * 0.0011
        + scenario["patchLagDays"] * 0.52
        - scenario["redundancyScore"] * 0.28
    )
    return round(max(0, min(100, raw)), 2)


def build_pack(payload):
    findings = sorted(
        [{**scenario, "scadaRiskScore": _score(scenario)} for scenario in payload["scenarios"]],
        key=lambda item: item["scadaRiskScore"],
        reverse=True,
    )
    return {
        "topAsset": findings[0]["assetId"],
        "criticalAssets": sum(1 for item in findings if item["scadaRiskScore"] >= 72),
        "maxBlastRadiusCustomers": max(item["blastRadiusCustomers"] for item in findings),
        "recommendation": findings[0]["nextAction"],
    }


if __name__ == "__main__":
    payload = json.loads(Path("fixtures/scada-scenarios.json").read_text(encoding="utf-8"))
    print(json.dumps(build_pack(payload), indent=2))
