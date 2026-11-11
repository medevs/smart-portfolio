# medevsmaker — a farm you can wander

A playable Middle Atlas farm and maker portfolio. Built with Next.js 16, React 19,
TypeScript, Three.js / React Three Fiber, Rapier, Tailwind CSS and Radix Dialog.

## Run and check

Use **Node.js 22** and npm. The legacy peer flag is required by the current
Three/LangChain/lint dependency graph; use the same installation path as CI.

```sh
npm ci --legacy-peer-deps --no-audit
npm run dev
```

The farm, catalog, journal, blog and reference pages work without API keys.
Browsers without WebGL get the accessible landscape and project links.

```sh
npm run check             # strict types, lint, formatting, then all tests
npm run build             # production build; never writes the knowledge index
npm run format            # shared formatting for source, tests and configuration
npm run audit:production  # current production dependency advisories
```

CI runs the checks and production build on Node 22. Vercel installs once from the
lockfile and runs the build separately. Never put `npm run generate` in an
installation or deployment command.

## Structure

| Location | Responsibility |
| --- | --- |
| `src/app/` | App Router pages, metadata, legal pages and the two API endpoints |
| `src/farm/` | Farm catalog, placements, sponsor lookup and data validation |
| `src/farm/game/` | Pure progress, inventory, save validation, routes, collision footprints and clock rules |
| `src/components/farm/game/` | HUD, map/journal/settings panels, tutorials, audio and React coordination |
| `src/components/farm/scene/` | 3D presentation, physics integration and camera ownership |
| `src/lib/` | Bounded chat parsing/streaming, headings, indexing orchestration and adapters |
| `utils/markdown.ts` | Validated local blog loading and App Router static parameters |
| `src/config/` | Portfolio content, planned sponsorship prices and site metadata |
| `posts/` | Markdown journal articles |
| `public/farm/` | Local textures, models and their license/source documentation |
| `tests/` | Node tests, actual Three/Rapier integration and shader compilation |

`FarmExperience` owns the page and recovery state. `FarmCanvas` composes the
scene; terrain, lighting and effects live in their own modules. `GameOverlay`
coordinates dialogs and delegates map, journal and settings content. The HUD
samples visitor state at 5 Hz; physics and animation update Three objects
without per-frame React state.

## Extend the farm

- Add catalog content in `src/farm/items.ts` and placement in `src/farm/plots.ts`.
  Register the corresponding 3D model in `scene/models.tsx` when adding a shape.
- Keep physical footprints in `src/farm/game/collision.ts` aligned with visible
  buildings and `game/world.ts` destinations. Walking, safe saves, travel and
  guided routes share these rules.
- Farming rewards belong in `game/progress.ts` and `game/journey.ts`. Reading a
  lesson, selecting a marker or arriving along a route must not award inventory.
- Use the one existing camera owner. Optional assets belong inside
  `OptionalAsset` and need a useful loading/failure fallback.
- Preserve pause, hidden-tab, focus-loss and reduced-motion behavior. Both manual
  movement and guided routes use the Rapier character controller.
- Tests share `tests/register-ts.cjs`; provider/database tests use in-memory
  fetch fixtures. Do not replace GPU acceptance with a successful build.

## Blog

Add a `.md` file to `posts/` using an alphanumeric, underscore or hyphen slug.
Frontmatter supplies title, ISO date, author, tags, category and description.
Place its cover at `public/images/<slug>.png`. Missing/unsafe slugs return 404;
heading IDs are generated in server HTML, including unique repeated headings.
Categories are real links using `?category=` and survive reloads.

## Sponsorship

The catalog and planned prices remain visible. Online requests, reservations
and payments are **unavailable** until a persistent backend and approval/payment
workflow exist. `/api/sponsor` returns 503 and never fabricates a queued request.
The UI links to the existing contact details instead of collecting information
that would be discarded. A future implementation must verify catalog IDs and
prices on the server, persist before acknowledging, and reconcile payment state.

## Optional knowledge service

`/api/chat` remains a bounded plain-text API. It is independent of the farm's
playable controls; the retired floating chat UI is not part of the current app.

Server-only environment variables for this optional service:

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Model and embedding provider access |
| `SUPABASE_URL` | Existing knowledge database URL |
| `SUPABASE_PUBLISHABLE_KEY` | Read-only knowledge access; legacy `SUPABASE_ANON_KEY` is supported |
| `SUPABASE_SECRET_KEY` | Indexer only; legacy `SUPABASE_SERVICE_ROLE_KEY` is supported |

Do not place these in public configuration or commit credentials. Database
migrations are in `supabase/migrations/`; applying them is an explicit operation
outside normal website builds. The audit prepared
`20261103000000_knowledge_read_only.sql` to enable RLS and revoke anonymous writes.
It has **not** been applied to a live database by this audit. Apply it explicitly
to the intended project; indexing now requires a separate server-only admin key.

```sh
npm run generate
```

Run indexing intentionally against the intended database only. It can incur
provider charges and write data. Source documents are prepared before provider
work; old IDs are snapshotted, new chunks are written and verified, then only
those old IDs are removed. A failed new write preserves the previous index.
Run one indexer at a time. This is not a transactional database swap: a partial
write or cleanup failure can leave duplicate/staged chunks requiring inspection.
Failures exit nonzero. No real indexing is part of the test suite.

The chat endpoint bounds request bytes and roles, limits output, sets a provider
timeout, honors cancellation and supports response backpressure. Deployment-level
rate limiting and verification of production Supabase RLS/secrets remain separate
hosting concerns; the repository alone cannot prove their configuration.

## Verification limits and audit

See [APP-AUDIT.md](APP-AUDIT.md) for this review's findings, changes and remaining
items, and [FARM-HANDOFF.md](FARM-HANDOFF.md) for earlier release evidence.

The available cloud browser cannot render WebGL. CPU scene/physics/shader tests
and UI recovery checks do not prove rendered GPU appearance, measured frame rate
or physical touch controls. Issues #20/#28 remain open for that acceptance.
The current dependency audit has no production findings; 16 moderate findings
in development lint tooling remain tracked under #25. Do not force npm's
incompatible downgrade suggestions into the working toolchain.
