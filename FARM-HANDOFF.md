# Farm: current work and next verification

## User direction (2026-10-30)

Make the farm authentic to Morocco's Middle Atlas: Ifrane, Azrou, Ain Leuh,
Midelt. The user approved the photoreal panorama direction and asks for a bigger,
slightly modern farm with more things, themselves represented in the scene,
future maker meetups, tourists/visitors and a welcoming community. They authorized
independent decisions, cloud overnight work, and pushing/merging tested changes.
Six hourly overnight reviews were scheduled; avoid overlapping writes.

Keep medevsmaker as the public identity. No exact likeness was supplied for this
scene: a tiny back-facing maker at the studio is a representation, not a portrait.
Visiting and meetup spaces are future visions, not open/bookable operations.
Do not invent dates, prices, guest capacity, location/address, real event listings,
booking functionality or collected signups. Updates point to the existing public X.

## Root cause reproduced

The old live site showed a fullscreen loader stuck at 4%. Cloud-browser console
proved WebGL context creation failed (GL_RENDERER Disabled). The Canvas fallback
was behind the loader. A successful build did not establish render success.

## Current repair

A photorealistic AI-generated landscape appears on first paint with product
hotspots. The larger earth/stone homestead includes modern windows, maker studio,
meetup pergola, guest casitas, greenhouse, orchard, vegetable beds and bee boxes.
No WebGL request is needed to browse products. `Enter the 3D farm` explicitly
requests the procedural 3D experience. Capability preflight, bounded load timeout,
error recovery and a cancel action leave the panorama usable if 3D fails. Readiness
is a real mounted scene/frame signal, not loading-manager percentage.

`/gather` explains the future maker/community/visitor vision. `/references` retains
real photographic sources and clearly distinguishes generated interpretation.
The generated asset, prompt summary, source credits and license are in ASSETS.md.

The panorama is a raster scene with HTML hotspots, NOT a photoreal 3D reconstruction.
The optional procedural 3D world remains less realistic. Be explicit about that.

## Verification standards

Use `.cursor/skills/principle-experience-first`, `principle-fix-root-causes` and
`principle-prove-it-works`. Inspect the actual page and console. Never call this
perfect or claim 3D visual proof from a browser that cannot create WebGL.

- Run `npm test`, `npx tsc --noEmit`, `npm run lint`, `npx next build`.
- The existing lockfile needs `npm ci --legacy-peer-deps`.
- Builds no longer invoke embeddings generation. Keep `npm run generate` manual; it rewrites the vector store.
- Verify the generated image loads, no permanent loader appears, all four product
  pins open the correct dialogs and close with Escape, Gather/The place navigation
  works, future visiting language is clear, image/photo credits remain.
- Test a narrow viewport for overlap/overflow and usable links.
- Test unsupported-WebGL Enter 3D: stays on panorama with readable explanation.
- Test real WebGL on a capable machine if available; otherwise leave limitation
  explicit and avoid claims that the procedural world is visually verified.
- Wait for Vercel checks before merge, verify production deployment and actual UI.

## Iteration notes

The previous session's Chromium downloads failed. The cloud browser works for
actual UI tests but its GPU is disabled; it provides direct proof of the
unsupported-WebGL case. The local environment lacks /proc RSS; a scratch-only
Node memory-metrics shim permits `next build`, not part of production code.

## Live verification after PR #7

Production deployed commit 4a6d2df. Cloud browser directly observed the new
panorama (not the old 4% loader), correct ReelStyles and TalkTheDoc dialogs,
Escape dismissal, Gather navigation and the full future community page.
Enter 3D on the GPU-disabled browser leaves the landscape and all project controls
visible with an explanatory status. No new application errors occurred on the
initial panorama render (old errors remain in the browser session log).

Visual iteration caught a clipped right-edge MentorClone entrance. Move the
entrance inward and use the mobile navigation layout up to 900 CSS px, so tall
narrow crops don't strand project controls. The cloud browser has a fixed
1363x936 viewport; browser zoom did not change it. A physical mobile viewport
and GPU-capable procedural-3D test are still pending, and must not be claimed.

The existing Help build dialog also linked its Granary offering to /spot/silo,
while the actual product/plot ID is mentorclone. Resolve stable landmark aliases
in findSpot so that existing sponsorship links open the correct product.

## Review: 2026-10-30, evening

No open PRs or concurrent remote changes were present; started from main d221647.
A new live browser session rendered the panorama without application errors.
Keyboard-only reproduction: Tab focused "Skip to the list of places", Enter
changed the URL to #farm-links but left the same landscape visible, and Tab
focused the Granary link in an invisible sr-only navigation block. The visible
catalog at /list is the intended nonvisual alternative. Point the skip link to
/list and mark the duplicate hidden index `hidden` so keyboard focus cannot be
stranded in off-screen links. Product IDs and routes remain unchanged.

The browser rejected a local-file responsive test harness under its URL policy.
No alternate route or workaround was attempted. This review does not establish
physical-mobile layout correctness. GPU-capable 3D is still unverified.

The visible /list catalog was also inspected directly. It still called the
workshop a barn and had no typographic hierarchy. Update the catalog copy,
prioritize the four main project/maker entrances, remove duplicate place names,
and add scoped paper/olive styling with clear headings and focus states. All
existing product, sponsor, fund, journal and legal routes are preserved.

Review validation: darken the small catalog labels to preserve 4.5:1 text
contrast, and keep the contiguous visible phrase "Open on the farm" in every
project link's accessible name for speech navigation. Decorative arrows are
aria-hidden. Contrast and rendered accessible-name regressions cover these.

## Verified catalog deployment and build isolation

PR #9 deployed main 8c512323. The actual browser keyboard sequence Tab →
Skip to the list → Enter opened /list, with visible project cards and accessible
names. ReelStyles opened its correct project dialog from that catalog. The
hidden duplicate navigation is absent from the accessibility tree. Fourteen
checks passed before merge, including contrast and visible-name regressions.

A deployment audit found that vercel.json invokes `npm run vercel-build`, whose
package script still ran `npm run generate` before compiling. The generator calls
`.delete().neq("id", 0)` on the documents collection. Local direct `next build`
did not prevent that remote build chain. Separate both build scripts from
indexing; leave `npm run generate` available as an explicit data operation.
This avoids future visual deployments invoking database writes or embeddings
provider calls. No indexing command was run during this correction.

## Dialog keyboard review: 2026-10-30, late evening

Started at main d250e240 with no open PRs. Live panorama rendered and unsupported
WebGL retained the landscape and project controls. Console contained only browser
extension metadata errors, with no application errors observed. Reproduced a
keyboard fault: opening ReelStyles and pressing Escape left focus on body; the
next Tab restarted at the skip link instead of continuing from the entrance.
Radix dialogs are controlled without a Dialog.Trigger because entrances also
live in the panorama/scene. Capture the actual opener before auto-focus and
restore it on close for both project and support dialogs. Ignore removed openers
and deep links with no opener, leaving default behavior intact.

Seventeen tests, separate TypeScript and lint checks, and direct `npx next build`
passed. Existing HeroSection dependency lint warning remains. A concurrent first
TypeScript attempt raced Next's regeneration of .next/types; rerunning after the
build completed passed. Do not run those two checks concurrently.
Next: verify focus return in deployed preview and production, including Help
build, all project dialogs and the no-WebGL fallback. Narrow viewport/physical
mobile and GPU-capable 3D proof remain unavailable in this browser; do not claim
those checks. Future events and visits remain concepts; product/sponsor/fund/
legal routes are unchanged.

## PR #11 status: 2026-10-31

The earlier GitHub write was blocked by a temporary usage-limit approval-review
failure. A later ordinary retry succeeded after the indicated reset; no alternate
write route was used. PR #11 is open at ef1cef47009d8042a6c793419e4bc5434ece6ece.
Vercel preview and GitGuardian checks succeeded. The preview URL redirected to
Vercel sign-in, so browser verification of the fix is BLOCKED, not passed.
Do not merge until the actual focus-return behavior is verified. No credentials
were requested during the unattended review, and no protection was changed.
Production is still main d250e240. Live /gather and /references retain explicit
future/unbookable wording and photo/generated-image provenance. Next: complete
preview authentication in an interactive session, verify all four product dialogs
and Help build return focus, inspect review/CI, then merge and verify production.
Narrow-layout and GPU-capable 3D checks remain pending for the reasons above.
