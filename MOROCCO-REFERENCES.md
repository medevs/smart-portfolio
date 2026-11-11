# Middle Atlas farm

The setting blends cedar country around Ifrane and Azrou with the drier farmland
and earthen buildings around Midelt. It represents an imagined property, not a
surveyed reconstruction or a claim that every regional feature coexists at one site.
Jbel Ayachi is a reference for the distant snowy ridge, not an exact modeled skyline.

## Photographs

The six images at `/references` are served locally. Each card records its author,
source URL and license; machine-readable credits live in
`src/data/morocco-references.json`. Wikimedia file-page licensing was checked on
2026-10-30. Photographs are resized for display and otherwise unchanged.
Attribution and source links must accompany redistributed copies. The reference
photographs retain their own licenses; the repository's MIT license does not
relicense them. BY-SA photographs remain under their stated BY-SA license.

- Midelt ayachi: Innocentsabroad, public domain. Town and mountain context.
- Casbat othman-oumoussa: Drissbkd, CC BY-SA 4.0. Earth plaster, timber lintel.
- Foret gourou: Loukili fatima zahra, CC BY-SA 3.0. Branch and woodland detail.
- Near Ain Louh 1: Happyhicham, CC BY-SA 3.0. Cultivated fields and muted palette.
- Altiplà d'Ifrane: Josep Renalias, CC BY-SA 3.0. Open plateau, sparse vegetation.
- Le Palais des Cerisiers: Иерей Максим Массалитин, CC BY-SA 2.0. Stone and orchard palette.

## Implementation

`MiddleAtlas.tsx` supplies earth-and-stone flat-roofed courtyard buildings,
granaries, layered cedar forms, an apple orchard, a narrow stone-lined seguia,
a donkey and a layered ridge. Existing plot, sponsor and product IDs stay stable.
The shapes are procedural approximations, not photogrammetry or photoreal assets.
The western tree scans and novelty garden gnome are no longer placed in the yard.
Existing CC0 ground textures and HDRIs remain generic lighting/material assets;
see ASSETS.md. The village remains a distant approximation.

## Verification

- `npm ci --legacy-peer-deps` installs the existing lockfile; plain npm ci fails
  because of the pre-existing optional peer dependency lock resolution.
- `npm test` runs movement regressions; `npx tsc --noEmit` and `npm run lint`
  check the application. Lint is clean after the game-v1 update.
- Use `npx next build` for a build without rebuilding the live embeddings database.
- Walk: WASD in a fixed frame, normalized diagonal speed. The follow view starts behind
  the visitor; drag turns it, and wheel/pinch or +/− changes distance. Tractor: F or the touch button;
  W/S drive and A/D steer. Blur, hidden tabs, pointer cancellation and dialogs
  clear or pause input. Test these on desktop and a touch device before promotion.

The regional world and game-v1 systems are merged on main. See FARM-HANDOFF.md
for production evidence and the still-open GPU/touch visual release gate.
