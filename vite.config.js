import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages projektsidor ligger under /<repo>/ — VITE_BASE sätts av
  // deploy-workflowet. Lokalt och på egen domän gäller "/".
  base: process.env.VITE_BASE || "/",
  // Dev-servern tar porten ur PORT-miljövariabeln när launchern tilldelar en
  // (5173 kan vara upptagen av en annan session); annars Vites standard.
  server: { port: Number(process.env.PORT) || 5173 },
  plugins: [react()],
});
