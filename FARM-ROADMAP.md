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

## Current execution status

Research and issue breakdown complete. Implementation is in progress on
codex/atlas-game-v1 from main cf33f403. PR #11 remains separate and open.
Environment blockers retained in FARM-HANDOFF.md: disabled cloud GPU, no narrow
viewport control, absent supported local preview daemon and declined protected
preview sign-in. Do not bypass these boundaries.

### Implementation checkpoint

The v1 systems above are implemented on the branch: animated generic visitor,
normalized sprint, proximity-only activity loop, inventory, safe physics travel,
map/journal/pause/settings/help, browser saves, shared clock, daylight, synthesized
opt-in wind and visible watered/delivered props. 29 automated checks pass;
TypeScript, lint and direct Next build pass. GitHub Farm checks now repeats them.
Compatible packages and Next 15.5.28 are updated. Audit retains 14 high/33 moderate
findings requiring a separately verified legacy-stack migration (#21).
Production browser evidence and full GPU/touch gate (#20) remain pending.
