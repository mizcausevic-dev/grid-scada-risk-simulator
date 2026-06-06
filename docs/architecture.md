# Architecture

The simulator has four proof lanes:

1. TypeScript builds the executive-facing scorecard and static page.
2. C++ validates the control-system risk calculation shape.
3. Python produces a remediation packet from scenario fixtures.
4. SQL exposes SCADA risk and board-posture views for utility reporting.

The public page is generated from `fixtures/scada-scenarios.json` by `scripts/prerender.ts`.
