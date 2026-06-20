# ACB Intake Form — Webflow Cloud version

This is the **Webflow Cloud** build of the lead-intake form: the same form that
currently runs on GitHub Pages, repackaged as an [Astro](https://astro.build) +
Cloudflare app so it can be hosted **natively on the Webflow site** (under
`advancedcb.com`) instead of being embedded in an iframe from GitHub.

> The existing GitHub Pages + iframe setup at the repo root is the **interim**
> production form and is intentionally left untouched. Switch the live site over
> to this version only after you've deployed and tested it.

## What's here

- `src/components/LeadIntakeForm.jsx` — the form, generated from the root
  `src/app.jsx` (the verified source of truth). It is mounted as a **`client:only`
  React island**, because the form is fully client-side (it uses `window`,
  `fetch`, timers, etc.) and needs no server-side rendering.
- `src/pages/index.astro` — the page shell (fonts, global styles, Microsoft
  Clarity) that mounts the island.
- `astro.config.mjs` — Astro + `@astrojs/cloudflare` + `@astrojs/react`.
  `base: "CLOUD_MOUNT_PATH"` is a placeholder Webflow Cloud replaces with your
  environment's mount path at deploy time.
- `webflow.json` / `wrangler.json` — Webflow Cloud + Cloudflare Worker config.

Lead submission (to `advancedcb.app`), the abandon/heartbeat tracking, the spam
honeypot, and the `$2B / 40 years` stats are all unchanged from the root form.
Client logos load from `raw.githubusercontent.com`, so no asset moving is needed.

## Deploy to Webflow Cloud

Prerequisites: a Webflow site plan that includes Webflow Cloud, and GitHub
connected to Webflow.

1. In Webflow -> **Webflow Cloud -> Create app -> "Bring your own app"**, import the
   GitHub repo `noahalbers/acb-form`.
2. **App / project directory:** set it to **`webflow-cloud`** (this app lives in a
   subdirectory so the interim GitHub Pages site at the repo root keeps working).
   Confirm Webflow Cloud lets you point at a subdirectory — see "If subdirectory
   isn't supported" below if it doesn't.
3. Create an **environment** and choose a **mount path** — the URL path the app
   serves at, e.g. `/get-started` or `/apply`. Webflow Cloud substitutes this for
   `CLOUD_MOUNT_PATH` during the build.
   - Note: if you mount at `/get-started`, this app **replaces** your current
     Webflow `/get-started` page. To run both side-by-side while testing, mount at
     a new path (e.g. `/apply`) and point your CTAs there once you're happy.
4. Webflow Cloud runs `npm install` + `npm run build` and deploys the Worker.
5. **Publish** your Webflow site to activate the route. The form is then live at
   `https://advancedcb.com/<mount-path>`.

### If subdirectory deploys aren't supported

Everything in this folder is self-contained. If Webflow Cloud requires the app at
the repository root, copy the **contents of `webflow-cloud/`** into the root of a
new dedicated repo (e.g. `acb-form-webflow`) and import that repo instead. The
root `acb-form` repo then stays purely as the interim GitHub Pages form.

## Local development

    cd webflow-cloud
    npm install
    npm run dev        # local dev server
    npm run build      # production build into dist/
    npm run preview    # build + serve via Wrangler (closest to production)

## Updating the form later

The canonical source is the repo-root `src/app.jsx`. To keep this version in sync
after editing it, regenerate the island component (ESM import at top, drop the
manual `ReactDOM.createRoot` mount, `export default LeadIntakeForm` at the bottom)
into `src/components/LeadIntakeForm.jsx`, then `npm run build`. Once we fully cut
over to Webflow Cloud, this can become the single source of truth.

## Notes / things to verify after first deploy

- This island runs **React 18.3.1** (matching the tested form). The official
  Webflow starter ships React 19; 18 builds and installs cleanly here. If a future
  Webflow Cloud build ever complains, bumping to React 19 is a safe fallback (the
  form uses no APIs removed in React 19).
- Do a real **submit test** after the first deploy and confirm the lead lands in
  the ACB Lead Console — Worker runtime + live API calls can't be verified offline.

## Site navbar + footer (DevLink)

The page is wrapped in `src/layouts/SiteLayout.astro`, which renders a navbar
above and a footer below the form, so visitors get the full site chrome and can
navigate away — they're not locked into the form.

Right now those are **placeholders** (`src/components/Navbar.astro` and
`src/components/Footer.astro`) — real links back to advancedcb.com, but not your
designed nav/footer. To use the real ones via DevLink:

1. Enable **DevLink** for your Webflow site and export your Navbar + Footer
   components. Follow Webflow's guide:
   https://developers.webflow.com/webflow-cloud/getting-started-with-devlink
   (DevLink authenticates with your Webflow account and writes the components into
   this app, e.g. a `src/devlink/` folder. That step runs with your Webflow login,
   so it's yours to run — it can't be done from this repo alone.)
2. In `src/layouts/SiteLayout.astro`, swap the placeholder imports for the DevLink
   components (use the real names/paths DevLink generates):

       import Navbar from "../devlink/Navbar";
       import Footer from "../devlink/Footer";

3. If your navbar is interactive (mobile hamburger, dropdowns), render it with a
   client directive so Webflow's interactions run: `<Navbar client:load />`. The
   footer is usually static and needs none.
4. Re-run the DevLink sync whenever you change the nav/footer in Webflow.
5. `npm run build` to confirm, then redeploy.

Spacing note: the form area uses `min-height: 100vh` (it was designed as a
standalone page). With a navbar + footer added you may want to reduce that so the
footer sits closer under the form — tune `.form-outer` in the form component if the
vertical spacing feels off.
