import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

// Webflow Cloud substitutes "CLOUD_MOUNT_PATH" with your environment's mount path
// (e.g. "/get-started") at deploy time, so the app's asset URLs resolve under it.
// Docs: https://developers.webflow.com/webflow-cloud/environment/configuration
//
// The form is a fully client-side React app, mounted as a `client:only` island
// (see src/pages/index.astro), so there is no server-side React rendering to worry
// about - Astro just serves the prerendered HTML shell + the client bundle.
export default defineConfig({
  base: "CLOUD_MOUNT_PATH",
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react()],
});
