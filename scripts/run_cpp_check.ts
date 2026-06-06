import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

mkdirSync("dist/cpp", { recursive: true });
const exe = process.platform === "win32" ? "dist/cpp/scada_risk.exe" : "dist/cpp/scada_risk";
const compiler = process.platform === "win32" ? "clang++" : "g++";
const compile = spawnSync(compiler, ["-std=c++17", "cpp/scada_risk.cpp", "-o", exe], { stdio: "inherit" });
if (compile.status !== 0 || !existsSync(exe)) {
  throw new Error(`${compiler} failed to compile cpp/scada_risk.cpp`);
}
const run = spawnSync(resolve(exe), { stdio: "inherit" });
if (run.status !== 0) {
  throw new Error("C++ SCADA risk check failed");
}
