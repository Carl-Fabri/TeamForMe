# Phase 0 Research: Hackathon Team Discovery & Join (Frontend)

All items below were resolved; there are no remaining NEEDS CLARIFICATION.

## 1. Styling system: design tokens without a component library

- **Decision**: Global CSS with CSS custom properties for the design tokens (exact palette
  from the brief) plus a small typography layer, loaded from the existing `src/styles.css`.
  Component-scoped styles in each component's `.css` file. Keep the Tailwind v4 + PostCSS
  pipeline that the repo already has wired for utility-based layout; do not introduce SCSS.
- **Rationale**: The brief specifies exact `--bg`, `--surface*`, `--violet`, `--teal`,
  `--coral`, `--amber` tokens — these map 1:1 to CSS custom properties with no preprocessor
  needed. The repo is already configured for plain CSS + Tailwind; switching the whole build
  to SCSS adds risk for no functional gain. Constitution "custom design-token system (CSS
  custom properties), no Material-style library" is satisfied.
- **Deviation noted**: Brief §3 says "SCSS". We use plain CSS custom properties instead;
  token names and values are unchanged, so the visual outcome and the "no Material look"
  constraint are met. Recorded here rather than in Complexity Tracking because the
  constitution does not mandate a preprocessor.
- **Alternatives considered**: (a) Reconfigure Angular to SCSS — rejected, build churn.
  (b) Drop Tailwind, hand-write all layout CSS — rejected, slower, Tailwind already present.

## 2. Component inputs: signal inputs vs `@Input()`

- **Decision**: Use `input()` / `output()` / `model()` signal APIs for all component I/O
  (e.g. `CapacityRingComponent` takes `filled = input.required<number>()` and
  `capacity = input.required<number>()`).
- **Rationale**: Constitution Principle I mandates signals and forbids new `@Input()`
  decorators where a signal suffices. The brief's `@Input()` mention (§8) is illustrative.
- **Alternatives considered**: Decorator inputs — rejected by constitution.

## 3. Leaflet map under SSR

- **Decision**: Render the map only in the browser. Guard with `isPlatformBrowser(inject(
PLATFORM_ID))` and initialize Leaflet inside `afterNextRender`. On the server, render a
  static bordered placeholder `<div>` of the same dimensions. Dynamically `import('leaflet')`
  inside the browser branch so it is never in the server bundle. If tiles fail to load or
  coordinates are missing, show an inline notice (per spec edge cases / FR-004).
- **Rationale**: Leaflet touches `window`/`document` on import and init; unguarded it breaks
  SSR and causes hydration mismatch (Constitution Principle V). A same-size placeholder
  keeps layout stable (no CLS) across hydration.
- **Alternatives considered**: (a) Disable SSR for the detail route — rejected, weakens the
  SSR baseline for one widget. (b) `@defer` only — rejected, `@defer` does not by itself
  make a browser-only library SSR-safe.

## 4. Simulating asynchronous application resolution (RabbitMQ-like)

- **Decision**: `ApplicationService` keeps an in-memory array of created applications. On
  `applyToTeam(...)` it validates capacity against the mock team store, pushes a new record
  with `status: 'pending'`, and schedules (via `timer(delayMs)` / `setTimeout`) a single
  transition to `'accepted'` or `'rejected'` (deterministic-ish rule, e.g. accept unless a
  seeded "always reject" team). `getApplicationById(id)` returns an `Observable` that emits
  the current record and subsequent status changes (backed by a `BehaviorSubject` per
  application or a store `Subject`), so the status view updates without reload (FR-018).
- **Rationale**: Mirrors the real broker-driven flow (create → pending → eventual result)
  behind the same method signatures the backend will expose, satisfying FR-022/FR-023 and
  SC-005.
- **Alternatives considered**: Immediate final status — rejected, cannot demo the pending
  state (User Story 4). Polling from the component — rejected, pushes broker simulation into
  the UI layer.

## 5. Capacity validation on apply (full-team rejection)

- **Decision**: `TeamService.applyToTeam(application)` (or `ApplicationService` consulting
  `TeamService`) checks `filled >= capacity` against the mock team store and returns an
  error result (`throwError` with a typed reason) when full. UI disables the join control
  pre-emptively (FR-013) and also handles the rejected submit (FR-014).
- **Rationale**: Both the pre-check and the submit-time check are required by the spec; the
  submit-time check covers the "filled up in between" edge case.
- **Alternatives considered**: UI-only guard — rejected, misses the race edge case and the
  contract the backend will enforce.

## 6. Forms

- **Decision**: Angular Reactive Forms (`FormGroup`/`FormControl`, `Validators.required`,
  `Validators.email`) for the application form. Submit button disabled while invalid or
  while a submit is in flight (FR-012, FR-015).
- **Rationale**: Reactive forms give testable validation state and straightforward
  disabled-during-submit handling.
- **Alternatives considered**: Template-driven forms — rejected, harder to unit-test.

## 7. Routing (Spanish paths, lazy)

- **Decision**: Extend `src/app/app.routes.ts` with lazy `loadComponent` routes:
  `''` → redirect to `eventos`; `eventos` → `EventsListComponent`;
  `eventos/:id` → `EventDetailComponent`;
  `eventos/:eventId/equipos/:teamId/postular` → `TeamJoinFormComponent` (modal-style route);
  `postulaciones/:id` → `ApplicationStatusComponent`;
  `organizador` → placeholder component (out of scope, FR-028).
  Unknown paths → a "no encontrado" route.
- **Rationale**: Matches brief §8 and Constitution Principle V (lazy feature routes).
- **Alternatives considered**: Eagerly loaded routes — rejected by constitution.

## 8. Environments toggle

- **Decision**: Add `src/environments/environment.ts` and `environment.prod.ts` with
  `{ apiUrl: '', useMocks: true }`; wire `fileReplacements` in `angular.json` for the
  production configuration. Services read the flag but only the mock branch is implemented
  this phase.
- **Rationale**: FR-020/FR-022 — leave the HTTP swap point ready without building it.
- **Alternatives considered**: Hard-coded `useMocks` constant per service — rejected, brief
  wants a single environment-level toggle.

## 9. Accessibility specifics for the modal

- **Decision**: `ModalComponent` sets `role="dialog"` + `aria-modal="true"` +
  `aria-labelledby`; on open, moves focus to the first focusable element and remembers the
  opener; `keydown.escape` closes; a focus-trap keeps Tab/Shift+Tab inside; on close,
  focus returns to the opener. Background scroll locked while open.
- **Rationale**: Constitution Principle IV and spec FR/SC on keyboard operability (SC-006).
- **Alternatives considered**: CDK `Dialog` — rejected, pulls in Angular CDK; the brief
  wants a custom lightweight modal and no component-library look.

## 10. Fonts

- **Decision**: Space Grotesk (display), Inter (body), JetBrains Mono (numerics/badges),
  self-hosted or via a `<link>` in `src/index.html`; define `--font-display`, `--font-body`,
  `--font-mono` tokens with system-font fallbacks.
- **Rationale**: Brief §4. Fallback stacks keep text readable if a face fails to load.
- **Alternatives considered**: Single variable font — rejected, brief names three families.
