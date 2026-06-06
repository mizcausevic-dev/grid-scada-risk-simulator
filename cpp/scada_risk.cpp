#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>

double scoreScenario(double latencyMs, double driftMinutes, double overrides, double blastRadius, double patchLagDays, double redundancyScore) {
  const double raw = latencyMs * 0.035 + driftMinutes * 0.95 + overrides * 5.4 + blastRadius * 0.0011 + patchLagDays * 0.52 - redundancyScore * 0.28;
  return std::max(0.0, std::min(100.0, raw));
}

std::string postureFor(double score) {
  if (score >= 72.0) {
    return "critical";
  }
  if (score >= 38.0) {
    return "watch";
  }
  return "stable";
}

int main() {
  const double risk = scoreScenario(940, 41, 7, 28000, 62, 38);
  if (postureFor(risk) != "critical") {
    std::cerr << "expected critical posture\n";
    return 1;
  }
  std::cout << "asset=substation-north-17\n";
  std::cout << "risk=" << std::fixed << std::setprecision(2) << risk << "\n";
  std::cout << "posture=" << postureFor(risk) << "\n";
  return 0;
}
