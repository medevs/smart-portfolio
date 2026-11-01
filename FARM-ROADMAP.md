# Atlas Farm · playable game v1

## Goal and definition of done

Turn the existing 3D portfolio into a coherent, calm third-person farm visit.
A visitor can explore the Middle Atlas homestead, interact with the work and
farm, complete a short activity loop, drive the tractor, use a map/journal,
control the world settings, and return to saved progress. Keep the regional
landscape, maker identity and future community vision. The game is a digital
interpretation; visiting spaces and gatherings are not operating/bookable claims.

This is a finite v1 roadmap, not a claim to implement every possible game system.
Online multiplayer, accounts, bookings, payments, real-world event scheduling,
procedural infinite terrain and a commercial farming economy are not part of v1.
They need separate product/security/hosting decisions, not fake buttons.

## Analysis

Already present: automatic Three/R3F world, Rapier walking/driving and bounds,
orchard/crops/cedars, buildings, symbolic maker, future gathering/guest spaces,
product dialogs, shader compilation regression and no-WebGL recovery.
Missing: a legible avatar, goals, contextual interactions, a game interface,
wayfinding, progress/inventory, reliable pause/save/settings, and responsive world
feedback. A larger mesh collection alone will not supply a playable loop.

## Tasks in order

| Issue | Deliverable | Completion evidence |
| --- | --- | --- |
| #21 | Audit/update compatible dependencies; install used tools only | outdated/audit/peer findings, lockfile, passing checks |
| #16 | Animated visitor, sprint, proximity actions and safe map travel | movement/travel tests, actual Rapier collision checks, GPU playtest gate |
| #17 | Water → garden → apples → shared table activity loop and local progress | state-machine, prerequisite, distance, duplicate reward and persistence tests |
| #18 | Map, journal, pause, help and graphics/motion settings | accessible UI, shortcuts, live browser panels, preserved product/fund/legal routes |
| #19 | Shared world clock, visible activity results, daylight and opt-in ambience | scene/clock tests, user-gesture audio, pause/hidden/reduced-motion behavior |
| #20 | Production release gate | post-push browser/console checks, full GPU playthrough and narrow/touch QA |

Implementation tasks are not the same as a passed visual release gate. Keep
#20 open while GPU/touch evidence is missing. Do not close issues merely because
code was written. Record check results, shipped PRs and concrete blockers.

## Technical decisions from research

- Use a small, deterministic activity state machine, not per-frame React state.
  Three transforms update through useFrame and deltas. UI samples position at a
  modest rate; repeated agriculture remains instanced.
- Retain Rapier's kinematic character movement and apply corrected translations.
  Safe travel requests are consumed by physics, not by changing an unrelated UI
  position. Inventory and task rewards require physical proximity.
- Local saves have a version, bounded positions and validated enums/counters.
  Storage errors/corrupt values do not block play. No server/account is implied.
- Audio starts only from a deliberate button click, defaults off, supports mute,
  stops on disposal and quiets while paused/hidden. Use generated ambience so no
  paid asset service or uncertain sound license is introduced.
- Preserve the actual shader compiler regression; a successful Next build is not
  a GLSL or GPU test. Keep known compositor failure recovery distinct from core
  shader failure recovery.

Primary references reviewed 2026-10-31:
- https://r3f.docs.pmnd.rs/advanced/pitfalls
- https://rapier.rs/docs/user_guides/javascript/character_controller/
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay

## Verification for every implementation batch

Run npm test, npx tsc --noEmit, npm run lint and direct npx next build (never the
indexing generator). Use branches, inspect diff, wait for CI, merge tested work
and confirm Vercel production. Then inspect the live browser and console and
exercise available flows. Record exactly what ran. GPU-disabled browser results
prove recovery/UI only; they cannot prove the GPU scene, touch or frame rate.

## Current execution status · 2026-10-31

PR #22 merged at 1835e68; PR #23 at 74ba24b. Both passed Farm checks and Vercel
production. 29 tests, TypeScript, lint and direct Next build pass. Live browser
map/journal/pause/help/settings, save/reload, product dialogs and keyboard checks
are recorded in FARM-HANDOFF.md. Live QA caught and fixed map label overlap and
product Escape reopening Pause, then rechecked both on production.

| Issue | Status |
| --- | --- |
| #16 | Implemented; full rendered travel/camera/movement gate remains |
| #17 | Closed: activity and persistence acceptance verified |
| #18 | Desktop production UI verified; narrow/touch gate remains |
| #19 | Closed: scene/clock tests and live settings/audio controls verified; GPU visuals remain #20 |
| #20 | Open: cloud GPU disabled and no narrow viewport control; no visual GPU or touch claim |
| #21 | Closed: Next 16 / AI SDK 7 / LangChain 1 migration; 33 tests, clean Node22 CI, Vercel and live UI checks pass; 0 production findings; 16 development-only moderate findings tracked in #25 |

The 3D game is primary. No claim of photorealism or complete visual/gameplay QA is
made. Keep #20 open until a GPU-capable full playthrough and touch review pass.
PR #11 remains separate. Do not bypass missing local preview infrastructure,
blocked local-file harness navigation or declined protected-preview sign-in.

### Dependency migration checkpoint

Current branch removes unused legacy packages, migrates the active chatbot/indexer,
updates Next 16/Turbopack/ESLint and bounds the existing plain-text chat API.
The real SDK + LangChain/Supabase adapters are tested with in-memory fetch fixtures;
no paid APIs or real database writes were used. See FARM-HANDOFF.md and #21 for
promotion evidence. PR #26 merged at c7a1ed8; production map/save/product/catalog/fund/legal checks passed. Privacy storage wording was corrected after live review. GPU/touch release gate #20 remains unchanged.

### Urgent gameplay regression · #28

User reports repeated bumping and loss of control. Suspend claims of playable
release. Reproduced and corrected camera-controller contention, rerender body
teleports and render-rate-dependent movement; 37 tests (including real Rapier/R3F
and camera-controls integration), types/lint/build pass. Ship only after CI, then
confirm deployment; user/GPU visual playthrough still must pass. See FARM-HANDOFF.md.

- HUD follow-up: consolidate permanent navigation behind Menu; compact journal
  prompt, contextual actions and touch-only movement pad. Preserve project/fund
  access and future-only hosting language. Record release evidence in PR.


## Exploration follow-up

| Work | Acceptance |
| --- | --- |
| Zoom and turnable follow view | Wheel/pinch/keys/settings, bounded distance, pause cleanup, one camera owner and obstruction tests |
| Portrait maker | Existing authorized portrait on curved face, source-matched hair/glasses/clothing, isolated loading, geometry/material checks |
| Field notebook | Four physical discoveries, hints/waypoints, validated old/new saves, no duplicate or remote rewards |
| Farm life | Shared-clock water/bees, tea tray, physical bench, instanced orchard variation |

Actual GPU appearance, full playthrough and physical narrow/touch checks remain
release gates; passing CPU geometry tests does not close them.

### Weather and performance follow-up · 2026-11-01

Saved clear/breeze/rain settings, overcast light, shared-clock rain and sheltered
bees; compass direction in waypoint HUD. Reduce ambient motion freezes weather.
Two instanced water/bee draws, no composer in Low color mode, hidden-tab render
suspension and unchanged-position UI sampling reduce work. 52 CPU/GLSL tests,
types/lint pass locally; local Turbopack build hit sandbox host memory syscall
failure. Require clean Node22 CI/Vercel before merge; GPU FPS/visual/touch gates
remain unverified. No claim of a measured speedup or photorealistic rendering.
