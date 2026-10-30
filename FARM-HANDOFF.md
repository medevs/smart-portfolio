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
- Do not run the embeddings generation step: it rewrites the vector store.
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
