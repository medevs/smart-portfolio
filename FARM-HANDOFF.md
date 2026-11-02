# Middle Atlas farm handoff

## Direction and constraints

The animated, explorable **3D world is primary**; panorama is failure recovery
only. Continue the larger, slightly modern Moroccan farm inspired by Ifrane,
Azrou, Ain Leuh and Midelt: maker studio for @medevsmaker, agriculture/orchard,
future gathering courtyard and guest spaces, welcoming maker community.
Keep product/sponsor/plot IDs, fund and legal pages. Visits/events are future
concepts: no invented dates, address, bookings or operating claims. The user explicitly authorized the existing portfolio portrait as the maker
and visitor avatar reference. Use only visible details from that photo. No spending, paid
services, external messages or embeddings generation. Tested pushes/merges are
authorized. Avoid conflicting writes if another run/PR changes the same area.

## Current gameplay blocker

The user reports repeated bumping and loss of control in the working 3D world.
Treat the gameplay release as failed until the correction is confirmed in play.
Issue #28 / branch `codex/fix-physics-control` addresses three reproduced faults:
competing camera owners, rerender-driven body teleports, and render/physics timing.
This work takes priority over cosmetic polish and the remaining development audit.

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

## Dependencies and security · migration checkpoint

Branch `codex/dependency-security-migration` upgrades Next/eslint-config-next to
**16.4.3**, ESLint **10.14.0**, AI SDK **7.0.159** / React adapter **4.0.163**,
LangChain core **1.3.2**, OpenAI integration **1.8.0**, community **1.1.29**,
text splitters **1.0.2**, syntax highlighter **16.1.2** and patched Zod. Runtime/CI
is Node **22.x**. Remove unused direct OpenAI/uuid/meta-LangChain and unused
analysis tools; import document/splitter packages directly in the explicit indexer.
React/Fiber/Drei/Three remain at the verified game-batch versions above.

Audit now reports **0 production findings** (`npm audit --omit=dev`) and
**16 moderate / 0 high / 0 critical** overall, all remaining findings propagated
from minimatch in development lint dependencies (follow-up #25). Do not force minimatch 11 over
legacy callable APIs or claim the whole tree is clean. A scoped same-major parser
patch fixes typography's vulnerable transitive selector parser. Earlier numbers
(14 high/33 moderate) are superseded by this migration.

The chatbot uses the current TextStreamChatTransport while retaining the existing
plain-text /api/chat contract. A bounded parser rejects malformed/non-text/oversized
requests before model/retrieval calls and avoids returning internal error details.
Missing retrieval configuration can now use the existing fallback context.
**33 tests pass**, including actual SDK text-stream decoding (split UTF-8), errors,
real LangChain prompt/model/output-parser integration, Supabase RPC shape and
indexing adapter/document-splitter behavior with in-memory fetch fixtures. Tests
reject any unexpected network target. No paid API, real database write, embeddings
generation or live model response was used to validate this migration.

Next 16 uses direct Turbopack build and ESLint flat config/CLI. Type errors are no
longer ignored during build. New lint checks prompted deterministic smoke seeds,
cloned/disposed texture sampler ownership, committed-profile refs, derived welcome
state and timer/hydration cleanup. Three's imperative GPU uniform update and three
external-browser hydration syncs have narrowly documented lint exceptions; compiler
rules are not disabled globally. TypeScript, lint and direct build pass. Local Node
is 24; clean-install GitHub CI on 22 passed in run **41213510811**, job
**124573192102**. PR #26 merged at **c7a1ed8** and Vercel production succeeded.

A repeat build failed opening the local Turbopack cache: a stray nonnumeric
`.00000031.sst.zfEpw2` file caused `invalid digit found in string`. Quarantining that
single temporary cache artifact restored a cached build. No product config change
or embeddings operation was involved. Production evidence is recorded below and in #21; GPU/touch checks remain unverified.

Migration references reviewed: https://nextjs.org/docs/app/guides/upgrading/version-16,
https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol,
https://ai-sdk.dev/docs/ai-sdk-ui/transport and
https://docs.langchain.com/oss/javascript/migrate/langchain-v1.
Installed Next docs: node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md.

## Next steps and concrete blockers

FARM-ROADMAP.md and issues #16–#21 track acceptance. #17 and #19 implementation
checks are closed; #16/#18 retain integration/touch evidence, #20 release gate is
open, and #21 is complete after migration/deployment checks; #25 tracks development lint findings.

1. Use a GPU-capable browser to play the full activity loop, camera/orbit/walk/
   sprint/tractor/travel, pause/daylight/shader recovery; record visuals/performance.
2. Verify a genuine narrow touch viewport: no overlapping HUD, usable pad/actions/
   panels. This browser has no viewport-resize capability. Do not claim mobile QA.
3. Track the development-only minimatch findings in #25; production audit is clean at this checkpoint.
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

## Post-migration production check

After PR #26 deployment, actual browser checks at 1363×936 passed map selection
and waypoint/status, accurate disabled travel on no-WebGL, game-panel Escape/focus,
graphics/reduced-motion save + reload (then restored defaults), catalog navigation,
direct /spot/reelstyles SSR dialog + external link, product Escape (zero dialogs,
no surprise Pause), /open, /impressum and /datenschutz. No form/payment/model call
was made. Product screenshot captured after deployment. No horizontal overflow.
Fresh Next16 chunk console still reports GL_VENDOR/GL_RENDERER Disabled; recovery
works. Successful GPU scene, touch playthrough and audible sound quality remain
unverified; do not close #20.

Review found the privacy page still described device-clock daylight and omitted
the game save. Its local-browser section now factually describes inventory/tasks,
safe digital position, introduction/preferences, journal reset retaining settings,
browser storage removal, optional virtual daylight and click-only/default-off sound.
Existing contact, legal-basis, sponsor and payment sections are preserved. Verify
the deployed wording after the follow-up PR; this is an implementation disclosure,
not a legal compliance assessment.

## Bumping/control correction · #28

Actual camera-controls math reproduces the camera fight: `enabled=false` disables
input, not its per-frame camera write. After two seconds the old orbit+follow loop
is still 42.527 units off the intended follow position. CameraRig now mounts either
orbit OR follow, and switches ownership on mode changes. Entry/travel makes a
camera cut rather than flying across the farm.

Actual Rapier/R3F integration tests against the old deployed explore.tsx fail on
settled-body rerender height and frame-rate-dependent movement (~1.83 instead of
3.6 units in one second at 120fps). Only body names were added to observe old
objects; old movement code was otherwise unchanged. The corrected implementation
captures initial position/rotation once, uses grounded visitor spawn/exit/travel,
applies input in useBeforePhysicsStep at 60Hz and samples poses after each step.
Physics runs before camera/visual updates. Global input reset now clears held keys
as well as pad/sprint/drive requests; pause cannot resume a stale held movement.

37 tests pass, including real camera ownership/handoff, stable visitor/tractor
height across rerenders, equal movement at 30/60/120fps, real keyboard release and
pause/resume, safe travel, tractor enter/drive/brake/exit. TypeScript, lint and direct
Next build pass. Tests step one frame at a time: the test renderer's multi-frame
advance batches each subscriber, which does not preserve real callback ordering.
These are real transform/physics integration tests without GPU pixels, not a
successful visual browser playthrough. Keep #20 and user confirmation in #28 open.
Wait for CI, merge, confirm production and record deployment in #28.

## Quiet HUD · screenshot feedback

User reports the scene looks better, but the permanent controls obscure it. This
is not confirmation of the full walking/driving gate (#20/#28 remain open).
Replace the seven header actions, four-button toolbar and project strip with one
Menu. Keep fund, support, all four projects, catalog, regional references and future
visits available there. The objective becomes a small journal button; inventory
stays in the journal. Interaction buttons require a relevant nearby activity or
project; tractor entry requires proximity. Touch pad/Sprint use coarse-pointer
media queries, and feedback expires after four seconds. No camera/physics changes.

38 tests pass, including quiet gate actions and tractor exit availability.
TypeScript, lint and direct Next build pass. Deployment/UI verification follows
in the PR record.
Browser has no WebGL, so menu/fallback checks do not establish GPU gameplay or
physical mobile-device verification. Next: actual GPU walking/driving playthrough
and touch/narrow layout check; continue #20 without claiming those gates passed.


## Exploration, zoom and portrait avatar · next batch

User requested zoom, richer exploration/visuals and explicitly asked to draw the
existing portfolio image on the character. MakerHead maps the existing
`public/images/profile.jpeg` onto a curved face with matching hair, round rims and
shirt color; both the walking avatar and studio maker use it. Optional portrait
loading is isolated so a failed image cannot suspend physics. The original image
is unchanged; this is a stylized procedural model, not a scanned human.

Walking camera now supports canvas-only wheel/pinch zoom and horizontal drag,
plus +/− shortcuts and a Settings distance slider/reset. Orbit keeps native
wheel/pinch and consumes the same explicit zoom requests. Building footprints
and orchard crowns shorten the follow camera before geometry; both desired and
interpolated positions are checked. Exactly one camera owner remains mounted.
WASD stays in its established fixed compass frame; turning the view does not
change movement directions. Zoom/orientation are session-only.

Four independent physical discoveries unlock saved field notes: cedars,
homestead, future guest-space concept and beehives. Map travel never awards notes;
E within 3.2 units does. Old saves default to an empty notebook. Reset clears it.
No-WebGL visitors can read hints and set waypoints, not fabricate discoveries.
New details: a collidable cedar bench, shared tea tray, bees and flowing seguia
using the shared paused/reduced-motion clock; softer varied orchard crowns remain
instanced. No new dependency, network service or operating/booking claim.

45 tests, standalone TypeScript, lint and direct Next build pass. Final focus-loss
gesture cleanup is included in the same checks/CI before merge; deployment evidence
will be recorded in the PR. CPU tests inspect
real geometry/material/portrait UV wiring and camera transforms, not GPU pixels.
The cloud browser still cannot prove 3D visual quality or physical touch gestures;
keep #20 open and record live interface checks separately.


## Exploration release follow-up

PR #31 merged at 485a0c267656fc8908404799956cd725f74fe156. Farm checks run
41239462142 and Vercel production Bk4wvYTMjMEV7totcWnCfgZbq9rz passed.
Live no-WebGL UI check: field notebook 0/4 shows four hints, selecting the apiary
sets the map waypoint without awarding a discovery; settings slider reaches 1.8
and 16, and camera reset resumes. Desktop UI only, not GPU or physical pinch proof.

Live check found notebook waypoint buttons changed the waypoint but showed no
local confirmation (the map did show it). Add a status message inside the notebook
so both sighted and screen-reader visitors receive immediate feedback. Verify the
status after deployment, then record remaining product/console checks in the PR.


## Camera beneath a crown

Final review identified a legitimate state omitted by the first obstruction test:
the visitor's look target can be inside an orchard crown. Clipping before that
sphere's far intersection then leaves the camera inside foliage. Compute the
exit clearance for an enclosing crown before shortening against other obstacles;
a regression uses a real orchard tree and a close view initially inside its crown.
This is a CPU geometry correction; visual GPU acceptance remains open.
Very short obstruction views can approach the visitor, so the avatar hides below
0.75 units instead of letting the torso fill the camera. Camera sampling runs
after physics and before avatar visibility. Normal user zoom starts at 1.8 units.

A repeat local build failed restoring cached task data: block 23 header was
truncated in .next/cache/turbopack/v16.4.3-29bbeab0/00000054.sst, referenced
by 00000061.meta. Quarantined that generated database and rebuilt it from source;
no build validation/configuration was disabled. Confirm clean CI before merge.

## Weather and rendering batch · 2026-11-01

Add saved clear/breeze/rain atmosphere in Settings, softened overcast sun/sky,
wind-scaled grass and single-draw rain; bees shelter during rain. These are artistic
settings, not live weather. Shared-clock precipitation respects pause, hidden tabs
and reduced motion. Old saves default to clear without losing journal/discoveries.
Waypoint HUD adds map-aligned compass directions and nearby confirmation.

Water/bees now use two instanced draws rather than 26 individual meshes. Low
color mode omits the postprocessing composer. Hidden tabs stop the Fiber render
loop and clear transient input; Fiber resets its frame clock on resume. Overlay
position sampling skips hidden tabs and unchanged positions. No FPS improvement
is claimed without a GPU measurement.

Local Node24: 52 tests (including actual weather GLSL semantic compilation,
instanced Three matrices, rain quality/pause/reduced-motion, old/new weather saves,
eight compass directions and visibility lifecycle), TypeScript and lint pass.
Direct Next build attempted but sandbox host reports ENOENT
uv_resident_set_memory during Turbopack; do not suppress that failure or weaken
checks. Node22 CI and Vercel must pass before promotion. No dependency changes,
paid service or indexer run. #11 remains separate. Actual GPU appearance, frame
rate, full playthrough and physical narrow/touch validation remain #20/#28.

## Guided tour and graceful graphics recovery · 2026-11-01

PR #34 merged as 185ca06435ff28f12e02d17f8142b70df6538d28 after explicit merge
approval. Node22 Farm checks 41337269680 and Vercel production
9WEF8QVfXUMxjFg46VWUPx9ti5mv passed. Live browser verified weather/Low graphics
selection, persistence after reload and defaults restored. The cloud GPU is still
disabled; no weather appearance/FPS claim.

Next batch: a five-chapter guided tour (place, maker, orchard, cedars, future
shared table), existing regional reference photos with credits, chapter links,
clipboard fallback, direct project/vision/reference actions, waypoint feedback
and safe Walk here. Menu/welcome/recovery entrances retain the quiet walking HUD.
Known ?tour= IDs open the matching chapter; invalid IDs do nothing. Tours never
award field notes or activity progress. Orbit owns each curated cinematic view;
walking ownership resumes on close. Reduced motion uses immediate camera cuts.
Physical bodies stay paused rather than being teleported by the tour.

WebGL2 capability is acquired on the real renderer canvas before creating the
Three renderer and passed through to it. Unsupported/throwing context creation
uses normal recovery without Three exception logs. Actual renderer, context-loss
and shader failures remain reported. This is expected-capability handling, not
console suppression. No dependency, paid service, indexer or sponsor form action.

57 local tests pass, including real animated/instant orbit transforms and return
to follow camera, all chapter assets/links/credits, no-WebGL controls and context
recovery. TypeScript/lint pass. Local direct Turbopack build again hits sandbox
uv_resident_set_memory ENOENT; require clean Node22 CI and Vercel before merge.
After promotion check all chapters, sharing/waypoint feedback, Escape/focus,
projects, support and console on production. Keep GPU/touch gates #20/#28 and
separate product-focus PR #11 open; do not infer visual GPU success from CPU tests.

### Tour production QA and sharing follow-up

PR #35 merged as 6fbe72be135a358cc284a599af1007f952ca1a8e after Node22
Farm checks 41338264893 and preview HqMQyPTfRTWWGQsvcc1oW8MmFGmb passed.
Merge CI 41338383279 and production 7huAr4ZEr7A1HZg2rRXmBsGbVkXu passed.
Actual production browser at 1363x936: ?tour=gate opens chapter 1; Next traverses
all five chapters with correct copy/image/links; orchard waypoint confirms in
place and is Apple orchard in the journal; activity and discovery counts stay
0/5 and 0/4; Help build and all four project dialogs open; product Escape closes
without surprise Pause. No form submitted. Tour layout visually inspected.
Fresh tour console: no site application errors/warnings. Two extension metadata
errors belong to chrome-extension://, not the site. WebGL is disabled here; the
new capability path recovers without Three error logs. No GPU/FPS/touch claim.

Live QA caught a pending clipboard permission request: Copy chapter link had no
immediate feedback and could wait indefinitely. Follow-up adds immediate copying
status, a 1.8s timeout with a usable manual-link fallback, request invalidation
when chapters/waypoints change or the tour unmounts, and success/failure/throwing/
pending clipboard regression checks. Make the story card opaque to avoid faint
background labels showing through; correct the cedar reference alt to describe
the monkeys actually visible in its photo. 58 local tests, types/lint pass.
Require Node22 CI/Vercel and live fallback/reload/console checks after promotion.

## Natural forms and materials · 2026-11-02

User still finds the actual 3D farm unrealistic. Prior tour/UI work is not proof
of a realistic scene. Reviewed the linked Elvar article's public Teardown repo
README/SKILL/MIT license: useful for reference-led detailed machinery and render
iteration, not an automatic photoreal farm converter. Do not install or run the
external skill implicitly. No external code, paid service or dependency added.

Source corrections in this batch:
- Replace sphere-stack cedar crowns with shared tapered branches and folded
  needle sprays; replace orchard ball crowns/trunks with instanced branching and
  individual leaf geometry. Fixed seeds retain identical review shapes on reload. Low graphics uses fewer
  branches and less than half the leaf/spray geometry; shapes are shared in memory.
- Mineral plaster uses world-scale mottling, subtle relief and lower-wall stain;
  stone plinths/courtyard faces have staggered instanced courses. Doors have
  timber boards/iron hardware. Subtle bevels replace razor-sharp box edges.
- Natural surfaces default to zero metalness and use existing ARM occlusion.
  Ground has broad vertex-colour variation; outer square-safe terrain replaces
  toy dome hills/stray blue strip/utility blocks. Sky, sun, saturation/bloom and
  cloud colours are more restrained.
- Well has hollow stonework, posts, axle, connected rope and bucket. Collected-
  water state raises bucket and changes crank; remove perpetual unpowered spin.

CPU SVG study compared actual old/new cedar and house geometry. It caught a
segmented-trunk collar defect and overly sparse cedar foliage; corrected both and
reviewed another sheet. This study omits GPU textures, custom shader relief and
shadows and is NOT a photoreal render or live WebGL sign-off. Leaf/camera envelope,
finite geometry, deterministic output, outer-terrain clearance, geometry budget,
well state and actual GLSL snippet compilation regressions accompany existing
camera/physics checks. Keep the camera obstruction sphere and physical yard,
spawn, destinations, project/support/legal identities and saves unchanged.

61 local tests/types/lint pass. Direct local Next build again attempted; sandbox
uv_resident_set_memory ENOENT persists. Require clean Node22 CI and Vercel before
merge. Live browser still recovers to the panorama: WebGL unavailable. Verify live
UI/console after promotion, but do not claim a measured speedup, real GPU visual
comparison, photorealism, full playthrough or physical touch QA (#20/#28).

## Urgent plaster shader startup regression · 2026-11-02

The user's functioning-GPU console reports fragment '#' invalid character / define
syntax error, then repeated useProgram invalid-program errors and panorama recovery.
This is an application regression from #37, not evidence that their GPU is disabled.
The Permissions-Policy unsupported-feature warnings and content.js extension error
are separate from the reproduced shader compilation failure.

Root cause: installed Three ShaderLib.standard.fragmentShader starts directly at
#define STANDARD (trimmed). earthFunctions ends at '}' with no trailing newline.
The material onBeforeCompile concatenation produced '}#define STANDARD'. The old
snippet test compiled earthFunctions with a separately padded main() and omitted
this real integration boundary. Add an explicit newline and bump the material's
program cache key to v2. Keep renderer/shader errors visible; do not disable the
plaster or classify this core shader failure as an optional compositor problem.

Extract the actual material factory used by the component. New regression invokes
its real hook on the installed Three standard vertex/fragment shader, recursively
expands installed ShaderChunks, replaces light counts like WebGLProgram, and
compiles both stages with zero and one directional light. Only SPIR-V host I/O is
adapted (uniform bindings, input/output locations, output colour host function and
a macro rename for Vulkan glslang's reserved average builtin). No shader body or
include is omitted. Before fix this test fails with '#' preprocessor directive
cannot be preceded by another token; after the newline it passes. Standalone
noise/normal snippets remain as extra arithmetic coverage, not integration proof.

62 local tests, types and lint pass. Local direct Next build attempted and hits
existing sandbox uv_resident_set_memory ENOENT. Require clean Node22 CI/Vercel,
merge the fix under the user's standing authorization, then check production
UI/console. Cloud no-WebGL recovery still cannot prove the user's GPU scene; exact
compiler reproduction is the acceptance evidence for this bug. Keep #20 open.

## Catalogue and object behaviour · 2026-11-02

Replaced legacy catalogue primitive models with Animals, TractorModel,
FarmObjects and shared ObjectParts. All 31 model keys are preserved, including
regional building aliases. Improved species proportions, merged coloured coat/head/
limb geometry, instanced fleece, tread blocks, bolts, grain heads and leafy plants.
Added coop joinery/ramp, hoop greenhouse, galvanized tank/bracing/ladder, irregular
pond bank/reeds, produce stall, hay twine, timber signs/fences, watering can,
apple basket, bench and tea set. Visitor boots/hands follow limbs; knees flex.
Maker portrait identity, physics/controller ownership, route/project/sponsor IDs,
progress storage and ordered inventory activities remain intact.

Animal parent translation and joints share deterministic object-motion poses;
grazing head transitions ease into walking. Rain stops roaming/feeding in a
shelter pose at the existing plot (no route to a barn is simulated). Each tractor
wheel rotates from signed ground displacement with its own radius; pause/load
teleports synchronize without wheel catch-up. Steering reads actual yaw change.
Plant density/reeds reduce with Low quality; wind matrices update at 20Hz.
Merged animal parts and instanced repetitions keep the fixture's core yard at
722 mesh objects (<800 regression budget); this is not a GPU draw/FPS benchmark.

66 tests cover all existing behaviours plus pen bounds, pose boundaries,
rain/pause/reduced motion, actual animal joints, actual tractor wheels/driver,
travel/reverse/teleport, quality-scaled crops and watered soil. Full Three shader
compilation regressions from #38 remain. No new custom GLSL was introduced.
Internal before/after CPU SVG shape studies inspect actual scene geometry but
cannot prove GPU materials, lighting, shadows, frame rate or full playability.
Cloud browser lacks WebGL; keep that limitation explicit in release evidence.

## Grounded tractor driving · 2026-11-02

The prior controller jumped directly to 7 units/second in either direction and
rotated the chassis at rest. Replace it with fixed-step acceleration (8 units/s²),
release/opposite-input braking (12 units/s²), forward/reverse caps of 7/3 and
bicycle-style signed-speed steering with the existing 1.3 rad/s turn cap. Read
Rapier-resolved velocity each step so collisions cannot build hidden throttle.
Small contact-correction velocities below .05 count as stopped, allowing reverse
to leave a wall instead of repeatedly entering the braking phase.

The box collider now uses zero/min-combined friction: it is a collision hull, not
four rolling tyres. The controller resolves longitudinal braking and lateral grip;
vertical gravity/collisions and the existing bounds remain Rapier-owned. This is
a bounded game controller, not a suspension/soil/traction engineering simulation.
Help describes release braking and direction changes. Wheel visuals continue to
read actual travel. No shader, asset, save, dependency or service changes.

69 tests pass, including actual Rapier acceleration, stopped steering, braking
before reverse, slower reverse, reversed steering, stable stopping/parking, wall
contact and reverse escape, and equal launch distance at 30/60/120 render FPS.
Running the new acceleration/pivot tests against the previous controller fails
(stationary spin and 6.949 units in one second instead of a gradual launch); the
new controller passes. Existing camera/entry/exit/travel/wheel tests still pass.
TypeScript and lint pass. Direct local Next build attempted: this host again
fails uv_resident_set_memory ENOENT; require clean Node22 CI and Vercel before
merge. Production interface/console verification follows deployment. Actual GPU
driving feel, visual acceptance, FPS and physical touch gates remain #20/#28.

## Orchard to tea table · 2026-11-02

The existing five-step journal now has a hands-on harvest: three individually
reachable low-branch apples on existing trees, picked once each within 1.25 units.
Partial harvest saves; each picked fruit disappears. A quantity-matched basket
is held by both hands. Once full, carry it to the table or load at the rear of a
stopped tractor trailer (E/touch). Unload before table delivery; a distant table
cannot summon cargo. The journal explains the route and map T marks the trailer.
Completion adds apples, a woven runner/plates and shared-clock tea steam. All
visits/gatherings remain an imagined future concept, not operating/bookable claims.

The trailer is a real Rapier body with bed/wheel colliders and a limited yaw hitch,
not a mesh rigidly stuck to the tractor. Both vehicle and trailer brake on release;
hitch position and articulation persist across Orbit/Walk remounts. Visual wheels
read actual travel. Existing gradual acceleration, reverse, collisions, camera and
entry/exit remain tested. Reload still resets parking; loaded cargo returns to the
visitor's hands with no lost apples. Old partial/finished v1 journals remain valid.
New picked IDs, quantities, cargo and delivery fields are bounded/validated.

The existing farm dog notices nearby on-foot visitors, turns before approaching,
stays inside a 2.2-unit home leash and checks static safe ground; rain returns it
home. Parent movement and animal joints share the same pose, paused/reduced clock.
It is an artistic companion response, not navigation to distant shelters or a
biological model. No new dependency, downloaded asset, shader, account or service.

77 tests pass, including state/save migration and malformed inventory, actual
Three harvest disappearance/carried-vs-loaded basket/table geometry, actual
Rapier hitch articulation, braking, boundary/reverse, pause and orbit remount,
and the real game hook harvesting via physical visits, loading/unloading and
finishing delivery without remote rewards. TypeScript and lint pass. A Node
EventTarget capture-removal mismatch exposed by the longer hook test was fixed
using explicit {capture:true} options, preserving browser semantics.

Internal CPU shape review inspected the actual carrying and loaded-tractor mesh
transforms; it uses flat colours and cannot validate GPU textures/shadows/lighting.
Direct local Next build was attempted and still fails host uv_resident_set_memory
ENOENT. Require clean Node22 CI/Vercel before merge; verify production journal,
controls, map, dialogs and console afterward. GPU gameplay feel, FPS, full rendered
playthrough and physical narrow/touch acceptance remain #20/#28; do not close them.

## Material detail and illustrated tutorials · 2026-11-02

User says the farm still looks unrealistic and explicitly requests tutorials.
This pass adds actual local scanned wicker-basket and watering-can assets to the
interactive objects, isolated behind complete procedural fallbacks. Scans are
centred and grounded by their real decoded bounds without mutating cached source
geometry. Ambient scanned props now load independently; one failure no longer
removes the entire set. Existing local CC0 files/materials are reused, not newly
downloaded models. Quantity/state still owns the visible fruit, hands and cargo.

Apples now have dimpled/lobed geometry, red/yellow blush, speckling, stems/leaves.
Painted metal uses deterministic edge wear/oxide colour and shared roughness/bump
data with low paint metalness. Tractor tyres have shaped shoulders and paired
angled chevron treads. No new custom GLSL, service or dependency. Physics and
camera ownership, plot/project/legal IDs and saved journal schema are preserved.

How to play is available from ?, H, welcome and Menu. Seven original SVG field-
book diagrams explain movement, camera/map/journal, water, individual harvest,
loading, driving/braking, unloading and final table interaction. Keyboard/mouse
and touch instructions are separate. The restrained paper/brass/ink interface
replaces rounded plastic-like panels. Guided practice stays small and stoppable,
detects actual movement/camera/inventory, follows the next apple/trailer rear,
and offers carrying on foot. Reading/next/previous never awards progress. Guides
pause with dialogs and use an imperative marker rather than rerendering physics
at the sampling rate. Practice does not reset or overwrite the player's journal.

84 tests pass: actual meshopt GLB geometry decode/grounding/source ownership,
finite deterministic apple/metal geometry, tyre matrices, all tutorial stages and
keyboard/touch content, no-WebGL reading, real game-hook movement/camera/guide
pause and no inventory awards, alongside prior Three/Rapier/save/shader tests.
CPU diagrams were visually reviewed; corrected clipped trailer/caption overlap.
Actual decoded mesh CPU shape study reviewed for the basket/tyres/carrying pose;
it uses flat shading and texture placeholders, not GPU pixels or lighting proof.
TypeScript/lint pass. Local direct Next build still hits the recorded host
uv_resident_set_memory ENOENT; require clean Node22 CI/Vercel before merge.
Live browser is available again but WebGL still takes recovery; verify deployed
book paging, device instructions, H/?/Escape, map/projects and console. Actual
GPU material appearance, full guided playthrough/FPS and physical touch remain
#20/#28; do not claim photorealism or close the visual gate from CPU tests.

## Tutorial control handoff follow-up · 2026-11-02

PR #42 merged at c049a64f45d6d2e4ae69d42889390ceb2f94a0f3 after explicit user
approval. PR CI 41464236152, merged-main CI 41467523602, preview
AFEeFUP96mvTXBVvLfnG7Sc1oF7g and production 9NYUizN7YbSTaeRdGYP43MtfAQAM passed.
Actual production browser verified all seven lessons, paging and touch control
text, disabled practice without WebGL, H to reopen, Escape/focus and readable
field-book desktop layout. Browser is in recovery, not a GPU visual acceptance.

Two review findings reproduced in new tests before fixing: walking instructions
still appeared in Orbit mode, and starting practice while driving showed a
walking step because the host pause reset cleared the queued automatic exit.
Hide the practice card outside Walk. Replace that fragile automatic action with
an explicit Park and step outside lesson using the normal F/touch exit. Capture
the movement/camera baseline only after physics reports the visitor on foot;
exit relocation must not count as walking. Share the unchanged host pause/input
synchronizer with the actual physics/game-hook test to exercise callback order.

86 tests pass, including both before/after reproductions and actual pause →
practice → F exit → new baseline → physical walking. TypeScript and lint pass.
Attempt direct Next build and require clean Node22 CI/Vercel before promotion.
All earlier GPU/full-playthrough/FPS/physical touch limits remain #20/#28.

## Faster and easier navigation · 2026-11-02

Automatic now starts Low on every screen; explicit saved High remains available.
Low uses DPR 1–1.2; measured performance decline in Auto lowers it to .75–1.
SceneRoot owns DPR without a competing AdaptiveDpr writer. Standard color mode
omits postprocessing, soft-shadow shader and extra foliage/scanned scenery at
Low. This reduces rendering work; no measured GPU FPS claim is made.

Visits/retries start in Walk mode. Walking is 4.5 units/s (previously 3.6),
sprinting 7.2, and camera follow catches up faster. Movement is relative to
cameraView.turn, independently of avatar yaw: this replaces the old fixed
compass choice without reintroducing facing-feedback spin. Arrows and WASD
have separate held states. Touch uses a floating drag origin and radial analog
deadzone; release stops the stick without clearing the Sprint toggle.

Map & travel is directly beside the journal objective, with a next-task travel
button. Travel still grants no task completion or inventory. Tutorials and
quick controls explain all changes. HUD samples Sprint/drive changes as well
as position so touch feedback updates while stationary.

Local tests, types and lint pass. Real Three/Rapier tests cover movement at
30/60/120 fps and arrow input toward a turned camera; pointer-event tests
cover proportional drag, competing fingers, capture, release, blur, visibility
and disposal. The rerender regression now compares rendered body position
before/after rerender rather than next-step walk state (one frame ahead).
Direct build remains blocked by host uv_resident_set_memory ENOENT; require
Node22 CI and Vercel before merge. GPU FPS/full playthrough and physical touch
remain unverified under #20/#28.
