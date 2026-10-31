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

## Black-frame root cause (2026-10-31)

The user reported a black screen and supplied browser console output. It proves
EffectMaterial's fragment failed at `float edge = e2UMix * 1.2` with `edge:
redefinition`, followed by repeated INVALID_OPERATION/useProgram errors. This is
a real shader defect on a functioning GPU, separate from this cloud browser's
GPU-disabled startup failure. Earlier scene-graph/build tests did not compile
GLSL and missed it.

Reproduced before editing with the glslang compiler: compilation failed on that
same redefinition. Rename the reveal threshold, correct reversed smoothstep
edges, and omit the unused sketch pass in normal color mode. The actual shader
body now compiles in a regression test using @webgpu/glslang (ES 3.1 host wrapper
for its SPIR-V target; this is compiler validation, not a WebGL screenshot).
Runtime shader compile failures now disable optional postprocessing so the
underlying 3D renderer can keep drawing, rather than staying black. Twenty tests,
TypeScript and lint pass. Run direct next build and wait for CI/deployment.

PR #14 merged at e9b57fafebcc7ea3cd924a7caed362966235096e and Vercel production
succeeded. Review then identified that core-material shader failures must not use
an effects-only recovery. Match Three r170's generated `SHADER_NAME EffectMaterial`
prefix for that narrow recovery; unknown/core sources call full scene recovery.
Twenty-one tests, TypeScript and lint pass, including routing coverage. Visual GPU
validation is still not claimed; the user's supplied log establishes the original
GPU error exactly and the compiler regression reproduces it independently.

## Game v1 implementation · 2026-10-31

Branch: `codex/atlas-game-v1`; roadmap and acceptance issues #16–#21 are in
FARM-ROADMAP.md. Implementation adds a generic animated visitor (no owner likeness),
sprint, E/touch proximity actions, safe map travel consumed by Rapier, map/journal/
pause/help/settings panels, a five-part studio → well → garden → orchard → table
loop, inventory, validated versioned browser saves and deliberate journal reset.
The shared world clock freezes ambient movement while paused, hidden or reduced;
optional daylight cycling and user-gesture-only synthesized wind are included.
Completed watering/delivery changes actual scene geometry. Project/fund/legal and
sponsor routes remain. No visits, bookings or events are represented as operating.

Movement correction: tractor mesh yaw now follows the vehicle heading separately
from the pedestrian facing, and its long collider axis matches the drive axis.
Building/well/orchard-trunk clearance is validated before travel or save restoration.
Orchard geometry and colliders share positions. UI samples position at 5 Hz in a
child component; it does not rerender the whole Three scene on each sample.

Dependencies: compatible updates installed, including React/DOM 19.3.1, Fiber
9.8.2, Drei 10.7.9, React postprocessing 3.2.2, and Next/eslint-config-next 15.5.28.
No paid tools or asset services installed. Next's critical audit finding is gone.
`npm audit` still reports **47 findings: 14 high, 33 moderate, 0 critical** in the
legacy AI/LangChain/OpenAI stack, tools and transitive/vendored dependencies
(including Next's PostCSS/sharp). Major migration requires separate route/API
checks; do not claim this dependency tree is free of vulnerabilities. #21 remains
open for that work. A downgrade suggested by npm audit is not a safe migration.

Local verification at this checkpoint: **29 tests pass**, including ordered
activity/inventory transitions, corrupt/blocked storage, every destination's safe
clearance, sprint, paused/hidden/reduced clock, real Rapier perimeter collisions,
new Three avatar/activity geometry and actual GLSL compilation. TypeScript and
lint pass without warnings; direct Next 15.5.28 build passed. Three test teardown
needs a real global animation host (`self=globalThis`) to preserve Rapier's crypto
host; a partial `self` mock caused a WASM panic and was corrected in the test host.
New GitHub Farm checks runs tests, TypeScript, lint and direct Next build.

Pending release evidence: production deployment, live UI/save/dialog/console QA,
and the still-blocked GPU and narrow/touch playthrough in #20. Do not label the
3D game visually verified based on this CPU scene graph or compilation evidence.
