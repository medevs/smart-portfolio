# Middle Atlas farm handoff

## Current direction

The user explicitly wants the animated, explorable **3D world as the main
experience**. The panorama is a failure fallback only. Continue toward a larger,
slightly modern Moroccan farm inspired by Ifrane, Azrou, Ain Leuh and Midelt:
maker studio for @medevsmaker, agricultural land, orchard, a future gathering
courtyard, future visitor spaces and a welcoming maker community.

Keep product links, plot/sponsor IDs, fund and legal pages. Events and visits are
future concepts: no invented dates, address, bookings or operating claims. The
small maker figure is symbolic, not a portrait. Do not spend money, enable paid
services or contact third parties. User authorized tested pushes and merges.

## Shipped

- PR #9: visible keyboard skip destination at /list; styled, accessible catalog.
- PR #10: site build scripts run Next only. `npm run generate` is a separate,
  explicit operation that rewrites the configured vector store. Do not run it.
- PR #12 merged at **aa9a84e2e03313e9ba54d7d66ce0734562355404**.
  Vercel production deployment succeeded on 2026-10-31.

PR #12 restores automatic 3D startup. It expands the procedural world with 48
instanced apple trees, 240 crop plants, a larger earth/stone home with glazed
frontage and solar roof, maker desk, future pergola/shared table and guest houses,
bee boxes, continuous rocky snowy ridge and a stone perimeter. Future-place
labels link to /gather. All existing product models remain at stable plots.
The world is a regional interpretation, not a surveyed property or photogrammetry.
Real photo sources/credits: MOROCCO-REFERENCES.md and src/data/morocco-references.json.

## Root causes fixed

1. `sceneRequested=false` prevented automatic 3D even on healthy devices.
2. A global Suspense boundary waited for HDRI, all texture maps and scanned props.
   Core geometry now renders first; optional downloads have isolated boundaries.
3. The installed Fiber Canvas starts async configure in an effect. React error
   boundaries do not catch its rejected initialization promise. SceneRoot now owns
   and awaits createRoot/configure, catches rejection and handles context loss.
   Each effect owns a fresh canvas so StrictMode cleanup cannot dispose a new root.
4. Partial repeated configure calls in the installed Fiber version can reset
   shadows/DPR. Runtime resizing/quality use RootState setSize/setDpr instead.
5. Performance downgrade mutated a ref without rerendering. State now reduces
   detail, grass, DPR and effects. Duplicate tone mapping was removed.
6. Touch project navigation could overlap movement controls. Input passes through
   empty gaps, with reserved control space in the walking layout.
7. The floor collider extended beyond visible land. Shared perimeter geometry and
   real Rapier boundary colliders now stop both walking and driving physically.

Day is the initial lighting; sunset/night remain controls. Readiness uses rendered
frames, not a fictitious loading percentage. Startup failure has bounded recovery
and a retry. Failed physics loading returns to orbit with an explanation.

## Evidence

- 19 tests passed, including actual Three scene-graph construction for every item,
  finite expanded geometry/instancing, and real Rapier character/tractor collision
  tests at the perimeter. Scene-graph tests use the official test renderer without
  a GPU; they are **not** WebGL visual tests. Existing core yard: 276 meshes.
- TypeScript, lint and direct `next build` passed. Existing HeroSection dependency
  lint warning remains. Do not run tsc concurrently with Next regenerating types.
- Final Vercel and GitGuardian checks passed; CodeRabbit completed neutral. Three
  review findings were addressed. No new indexing/provider calls were run.
- Actual production browser first showed “Opening the 3D farm” and project dock,
  then logged GL_VENDOR/GL_RENDERER **Disabled**. SceneRoot caught that specific
  failure and recovered to the accessible fallback without a stuck loader or
  unhandled initialization rejection. Retry recovered too. ReelStyles and
  TalkTheDoc dialogs opened correctly after recovery and Escape closed them.

## Outstanding verification / blockers

**Do not claim finished visual 3D validation.** This cloud browser cannot create
WebGL. Its GPU restriction is not evidence that the user's device cannot run 3D.
GPU-capable visual review, in-browser camera/walk/tractor interaction and a real
narrow/mobile viewport remain pending. Fix observed faults before claiming those.

The supported `sites-preview` CLI exists but its daemon mailbox is missing; no
workaround server was started. The deployed Vercel preview requires sign-in; the
secure sign-in request was declined. Do not retry auth or bypass protection.
Earlier local-file responsive harness navigation was blocked; do not bypass it.

PR #11 (dialog focus return) remains open and separate; it is not in production.
Read its review before continuing: helper-only focus tests do not establish both
callers' integration. Avoid conflicting writes if another run updates this area.

## Working procedure

Read Experience First, Fix Root Causes and Prove It Works under .cursor/skills.
Use official R3F docs plus installed source for version-specific renderer behavior.
Use a branch; run npm test, npx tsc --noEmit, npm run lint and npx next build, wait
for CI, then merge verified work and confirm production. Preserve honest limits.
The existing lockfile needs npm ci --legacy-peer-deps. This executor needs the
scratch-only runtime-memory.cjs shim for Next's /proc RSS lookup; do not commit it.
