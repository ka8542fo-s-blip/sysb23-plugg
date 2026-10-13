import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { changelog } from "./src/data/changelog.js";
import { versionFile as versionContent } from "./src/lib/versionCheck.js";

// Versionen som uppdateringsnotisen jämför (src/lib/versionCheck.js):
// commitens SHA, GITHUB_SHA i Actions och HEAD lokalt.
function commitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "okand";
  }
}

const sha = commitSha();

// Skriver dist/version.json med samma SHA som bäddas in i appen och de
// senaste nyheterna ur src/data/changelog.js.
const versionFile = {
  name: "version-json",
  apply: "build",
  generateBundle() {
    const source = `${JSON.stringify(versionContent(sha, changelog))}\n`;
    this.emitFile({ type: "asset", fileName: "version.json", source });
  },
};

export default defineConfig({
  // GitHub Pages projektsidor ligger under /<repo>/ — VITE_BASE sätts av
  // deploy-workflowet. Lokalt och på egen domän gäller "/".
  base: process.env.VITE_BASE || "/",
  // Dev-servern tar porten ur PORT-miljövariabeln när launchern tilldelar en
  // (5173 kan vara upptagen av en annan session); annars Vites standard.
  server: { port: Number(process.env.PORT) || 5173 },
  define: { __APP_VERSION__: JSON.stringify(sha) },
  plugins: [react(), versionFile],
});
