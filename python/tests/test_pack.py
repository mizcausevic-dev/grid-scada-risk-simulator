import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scada_pack import build_pack


class ScadaPackTest(unittest.TestCase):
    def test_build_pack_flags_substation(self):
        payload = json.loads(Path("fixtures/scada-scenarios.json").read_text(encoding="utf-8"))
        pack = build_pack(payload)
        self.assertEqual(pack["topAsset"], "substation-north-17")
        self.assertEqual(pack["criticalAssets"], 1)
        self.assertIn("protected remediation window", pack["recommendation"])


if __name__ == "__main__":
    unittest.main()
