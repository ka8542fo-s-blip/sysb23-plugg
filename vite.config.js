import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages projektsidor ligger under /<repo>/ — VITE_BASE sätts av
  // deploy-workflowet. Lokalt och på egen domän gäller "/".
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
