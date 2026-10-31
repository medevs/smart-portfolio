# Middle Atlas farm handoff

## Direction and constraints

The animated, explorable **3D world is primary**; panorama is failure recovery
only. Continue the larger, slightly modern Moroccan farm inspired by Ifrane,
Azrou, Ain Leuh and Midelt: maker studio for @medevsmaker, agriculture/orchard,
future gathering courtyard and guest spaces, welcoming maker community.
Keep product/sponsor/plot IDs, fund and legal pages. Visits/events are future
concepts: no invented dates, address, bookings or operating claims. Both maker
and visitor figures are symbolic, not inferred likenesses. No spending, paid
services, external messages or embeddings generation. Tested pushes/merges are
authorized. Avoid conflicting writes if another run/PR changes the same area.

## Shipped

| PR | Result | Merge |
| --- | --- | --- |
| #9–#10 | Accessible catalog; build no longer invokes database indexer | See Git history |
| #12 | Automatic 3D startup, isolated optional assets, larger orchard/home/future spaces and physical perimeter | aa9a84e |
| #14–#15 | Actual GLSL defect and shader recovery classification | e9b57fa / cf33f40 |
| #22 | Game v1 systems and compatible dependency updates | 1835e68 |
| #23 | Live-QA map readability and product-Escape fixes | 74ba24b |

PR #22 adds a generic animated visitor, normalized sprint, E/touch proximity
actions, safe map travel consumed by Rapier, map/journal/pause/help/settings,
five activities (studio → well → garden → orchard → shared table), inventory,
validated versioned browser saves and deliberate reset. Shared world clock pauses
ambient movement with panels, hidden tabs and reduced motion. Optional daylight,
user-gesture-only synthesized wind, and watered/delivered scene props are included.
Tractor mesh/collider heading is corrected; orchard geometry/colliders share data.
UI position sampling is isolated from the Three scene. Tractor parking resets on
reload; browser progress/preferences and safe walking position persist.

Landscape remains a regional procedural interpretation, not photogrammetry or a
surveyed property. Photo credits: MOROCCO-REFERENCES.md and
src/data/morocco-references.json. Repeated planting stays instanced.

## Root causes established

- Startup was disabled and a global Suspense waited for decorative downloads.
  Core geometry now starts automatically with isolated optional downloads.
- Fiber async configure rejection escaped React boundaries. SceneRoot awaits it,
  catches failures/context loss, owns each canvas and uses setSize/setDpr for updates.
- A user's functioning-GPU log identified duplicate `float edge` in EffectMaterial.
  glslang reproduced the exact redefinition. Rename it, correct reversed smoothstep
  edges and omit the unused sketch pass in normal color. Compiler regression stays.
- Only generated `SHADER_NAME EffectMaterial` failures drop postprocessing;
  unknown/core shader failures use full scene recovery. Do not conflate these with
  the cloud browser's disabled GPU.
- Live product Escape dismissed Radix before the window shortcut inspected the key,
  opening Pause. Capture-phase inspection now sees the original dialog state.
- Live map labels overlapped. Numbered markers now match the destination selector,
  with textual waypoint feedback. Both fixes were rechecked after deployment.

## Verification evidence · 2026-10-31

- **29 tests pass**: ordered activity/inventory/prerequisites/distance/duplicates,
  corrupt/blocked storage and restore, safe destinations, normalized movement,
  shared clock, actual Three avatar/world geometry, real Rapier perimeter collisions,
  GLSL compilation and preserved routes. Scene tests are CPU graph checks, not GPU.
- TypeScript, lint (no warnings) and direct Next build pass. CI `Farm checks`
  passed npm ci/tests/types/lint/build for PR #22 run **41203964214**, job
  **124545164170**, and PR #23 run **41204636574**, job **124547120413**.
- Vercel production succeeded for merge **1835e68** and **74ba24b**.
- Actual https://medevsmaker.vercel.app/ browser at **1363×936**: map selection,
  orchard waypoint/status, accurate disabled travel, journal (no menu-awarded
  progress), reset confirmation/cancellation, pause/help/resume, M/J/Escape,
  game-panel return focus, and product Escape without reopening Pause all passed.
- Graphics/reduced-motion preferences survived reload. Audio enable→Mute→off
  controls worked and default off after reload; audible quality was not assessed.
  Tested preferences were returned to Automatic/normal motion.
- All four product dialogs opened with preserved /spot/about, /spot/reelstyles,
  /spot/mentorclone, /spot/talkthedoc and external links. No sponsor form submitted.
  Existing product focus-return PR #11 remains separate/open and untouched.
- No horizontal page overflow; toolbar top **111px**, header bottom **99px** at
  this viewport. Corrected-map screenshot was saved during the browser check.
- Fresh console explicitly reports **GL_VENDOR=Disabled, GL_RENDERER=Disabled**;
  startup recovers without a stuck loader. Browser-extension metadata errors are
  separate. This browser did not and cannot prove successful 3D rendering.

## Dependencies and security

Compatible updates include React/DOM **19.3.1**, Fiber **9.8.2**, Drei **10.7.9**,
React postprocessing **3.2.2**, Next/eslint-config-next **15.5.28**, and other
compatible packages. Rendering peer requirements checked; npm ls direct renderer
packages succeeds. Three remains 0.170; breaking majors were not blindly adopted.
Next's critical audit finding is gone. Audit still reports **14 high / 33 moderate /
0 critical** across legacy AI/LangChain/OpenAI, tools and transitive/vendored
packages (including Next PostCSS/sharp). #21 remains open for deliberate migrations
and chatbot/API verification. Do not claim a clean audit or follow unsafe downgrade
suggestions. No paid services or asset tools were installed.

## Next steps and concrete blockers

FARM-ROADMAP.md and issues #16–#21 track acceptance. #17 and #19 implementation
checks are closed; #16/#18 retain integration/touch evidence, #20 release gate is
open, and #21 retains dependency security migrations.

1. Use a GPU-capable browser to play the full activity loop, camera/orbit/walk/
   sprint/tractor/travel, pause/daylight/shader recovery; record visuals/performance.
2. Verify a genuine narrow touch viewport: no overlapping HUD, usable pad/actions/
   panels. This browser has no viewport-resize capability. Do not claim mobile QA.
3. Migrate remaining vulnerable major dependencies deliberately, preserving routes.
4. Review PR #11 separately; helper-only focus tests do not prove both callers.

Supported local sites-preview mailbox is absent. Protected Vercel preview sign-in
was declined; do not retry auth or bypass protection. A local-file responsive
harness was blocked; do not bypass via other hosting/iframes. These are environment
limits, not proof that the user's GPU cannot run the farm. **Do not mark the whole
roadmap or visual release gate finished.**

## Working procedure

Read Experience First, Fix Root Causes and Prove It Works under .cursor/skills.
Use branches, npm ci --legacy-peer-deps, npm test, npx tsc --noEmit, npm run lint,
and direct npx next build; wait for CI, merge verified work, confirm production and
inspect actual browser/console. Never run npm run generate as part of deployment.
This executor needs a scratch-only runtime-memory.cjs for its /proc RSS lookup;
do not commit it. GPU-free Three tests need self=globalThis plus animation host
methods: a partial self mock breaks Rapier's crypto host and causes a WASM panic.
