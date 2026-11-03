# Application audit — 2026-11-03

## Scope and method

Baseline: main at `57f314270b72d85e98e77a32f379a6e86056ba15`.
This is a repository and available-runtime audit, not a guarantee that no defects
remain. The import graph covered 139 TypeScript modules and 21 application/script
entry points before cleanup. The resulting graph has 130 modules, with only the
framework-loaded Tailwind configuration outside the explicit import roots.

Reviewed the App Router pages and metadata, farm catalog/placement data, gameplay
and saves, input/pause/navigation, 3D composition and asset fallbacks, audio,
sponsorship, blog loading/rendering, both API endpoints, knowledge indexing,
dependency graph, build/deployment configuration and test infrastructure. Used
strict unused-code diagnostics, import reachability, dependency audits, actual
Three/Rapier tests, shader compilation, server HTML and in-memory provider fixtures.
Public assets and their license/source files are retained; dynamic asset usage is
not inferred from literal-reference searches alone.

## Findings and changes

| Priority | Finding | Result |
| --- | --- | --- |
| P1 | Sponsorship returned a successful queue ID without storing anything | Removed the discarded-data form/payment placeholders; show availability/contact details and return noncached HTTP 503. No reservation is implied. |
| P1 | Indexing deleted existing documents before preparing/writing replacements | Prepare first, snapshot old IDs, insert and verify new IDs, then delete only the snapshot. Failed writes retain the old index; command failures exit nonzero. |
| P1 | Repository migrations omitted RLS; indexing reused the anonymous client | Prepared `20261103000000_knowledge_read_only.sql`; split reader/admin clients and require a server-only indexing key. **Live migration is not applied.** |
| P2 | Missing blog slugs threw filesystem errors; loader accepted traversal-shaped IDs | Validate slugs and return absence for missing/unsafe paths so the page emits 404. Only Markdown files are enumerated. |
| P2 | Static blog parameters used the obsolete nested `params` shape | Return App Router segment objects. Tests load each generated post. |
| P2 | Duplicate headings shared anchors; IDs appeared only after hydration | Generate stable, unique Unicode-aware IDs in server HTML. Remove competing DOM mutation and invalid nested code-block markup. |
| P2 | Contents stayed tied to the previous article and collapse lacked a named keyboard control | Resample on article changes; use a named button, expanded state and native hash links. |
| P2 | Blog category chips looked clickable but did nothing | Real category query links filter articles and work after reload; invalid categories fall back to all. |
| P2 | Spot URLs were decoded twice and unknown IDs rendered an empty farm | Unknown/malformed spots return 404; keep existing decoded IDs and resolve legacy aliases consistently in metadata images. |
| P2 | A queued walking request could survive focus loss before its first physics step | Input reset cancels queued routes by default; only the explicit Map-to-resume handoff preserves one. Existing harvest-route tests still pass. |
| P2 | Audio could start after cancellation/unmount and leave a context running | Separate audio resource ownership; pending starts are cancellable and cleanup is idempotent. |
| P2 | Chat drained upstream work without reader cancellation or backpressure | Pull-based stream, iterator cleanup and abort propagation; bound output to 512 tokens and set a 30-second provider timeout. Missing configuration returns 503. |
| P2 | Farm validation ignored sponsor placements, full plot spans and invalid counts | Validate all placements, references, duplicate IDs, spans, grid and numeric limits; reject nonfinite ledger data. Preserve cents in currency display. |
| P3 | Retired portfolio/chat UI and dependencies remained in the repository | Remove 24 unreachable modules and six direct dependencies. Public chat API and its adapter tests remain. |
| P3 | Large files mixed scene composition, terrain, effects, maps and settings | Separate these responsibilities and move collision rules into the game domain. Persistence no longer imports a component-layer module. |
| P3 | Test module loaders were duplicated and custom declarations hid real types | Shared test registration; use installed syntax-highlighter types. Enforce unused locals/parameters in TypeScript. |
| P3 | Vercel installed dependencies twice using mutable installs | Install once with `npm ci --legacy-peer-deps --no-audit`, then build. Indexing remains outside all build chains. |
| P3 | Formatting had no installed formatter and referenced a missing plugin | Pin Prettier, format maintained source/config/tests and add `format:check` to CI plus `npm run check`. |

## Structure after refactoring

- `src/farm/game/collision.ts`: shared physical footprints and safe positions.
- `scene/FarmCanvas.tsx`: composition, readiness and placed models.
- `scene/Terrain.tsx`, `SceneLighting.tsx`, `SceneEffects.tsx`, `scene-types.ts`:
  environment rendering and shared view types.
- `game/FarmMap.tsx`, `MapPanel.tsx`, `JournalPanel.tsx`, `SettingsPanel.tsx`,
  `useVisitorSnapshot.ts`: map/panel rendering and sampled HUD state.
- `game/ambience-engine.ts`: cancellable local audio ownership.
- `src/lib/text-stream.ts`, `knowledge-index.ts`, `markdown-headings.ts`:
  independently tested lifecycle/domain helpers.
- `tests/register-ts.cjs`: one module-registration path for integration tests.

Retired modules were the old sections, terminal widgets, generic unused UI
wrappers, floating chat client, old navigation/footer/theme-toggle and SDK
transport. `next-themes` and `ThemeProvider` remain because current pages use them.
Tailwind configuration remains because the build system loads it implicitly.
Formatting across the remaining code is mechanical; inspect whitespace-insensitive
diffs alongside this finding table when reviewing semantic changes.

## Validation and release gates

- Full test suite includes the earlier tractor stability, single-avatar, gameplay,
  cargo, camera, guided-route, persistence, recovery and shader regressions.
- New regression cases exercise blog paths/static params, anchors and server HTML,
  category filtering, spot 404s, sponsorship unavailability, safe index replacement,
  admin-key isolation, audio cancellation, stream cancellation/backpressure,
  placement validation, cents and focus-loss route cancellation.
- `npm run check` passes strict types, lint, format checks and the full suite
  (115 tests, including the slow-reader backpressure regression).
- Production dependency scan: **0 findings**, 371 production dependencies at scan
  time. Full dependency scan: **16 moderate development lint-tool findings**,
  no high/critical findings. These remain under #25; npm's suggested downgrades
  are incompatible with the current stack and were not forced.
- The direct local production build confirms the host's `uv_resident_set_memory`
  ENOENT failure. Require a clean Node 22 CI build and Vercel
  deployment before promotion; record their identifiers in the release PR.

## Still requires external verification or action

1. **Database hardening:** apply the prepared SQL migration to the intended
   Supabase project and configure a server-only secret for explicit indexing.
   No live database was accessed or altered, and no SQL server was available
   locally to execute the migration. The code change alone does not establish
   the live project's RLS state.
2. **Public model endpoint:** verify production configuration and deployment-level
   rate limiting. Repository tests use provider/database fixtures; no paid API
   calls or real indexing were run.
3. **Index replacement:** the staged replacement is not a transactional database
   swap. Partial writes or cleanup failures can leave duplicate/staged chunks;
   the old index is retained rather than erased. Run one indexer at a time.
4. **Graphics acceptance:** the available browser has no working WebGL. Rendered
   trailer/world appearance, GPU FPS, complete visual playthrough and physical
   touch-device QA remain open under #20/#28.
5. **Development advisories:** update the lint ecosystem when compatible fixes
   for the minimatch advisory become available; do not label the full dependency
   graph clean while the 16 development findings remain.

Primary references checked for the changes:

- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/getting-started/api-keys
