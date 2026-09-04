# Implementation Plan: Hackathon Team Discovery & Join (Frontend)

**Branch**: `master` (feature dir `001-hackathon-team-frontend`) | **Date**: 2026-08-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-hackathon-team-frontend/spec.md`

## Summary

Build the TeamForMe participant-facing web frontend: browse hackathon events, open an event
to see its map, aggregate capacity and team list, filter teams, apply to a team through an
accessible modal form, and follow the application status as it resolves. All data is served
by an in-app mock service layer whose method signatures and data shapes match the future
backend, so connecting the real backend is an internal swap with no component or template
changes. UI is Spanish, dark theme per the validated reference prototype, responsive from
360px, SSR-safe.

## Technical Context

**Language/Version**: TypeScript 5.9.x (`strict: true`, `strictTemplates: true`)

**Primary Dependencies**: Angular 21.2 (standalone components, signals, `inject()`), Angular
Router (lazy `loadComponent` per feature), RxJS 7.8, Angular SSR + Express 5, Leaflet
(`leaflet` + `@types/leaflet`) for the event map. No component library (no Angular Material).

**Storage**: None. Mock data lives in-memory in `src/app/core/mocks/*`. An in-memory
mutable store simulates created applications and their asynchronous resolution.

**Testing**: Vitest via `ng test` (jsdom environment, already configured). Unit tests co-located
with each component/service/pipe.

**Target Platform**: Modern evergreen browsers, server-rendered via Node/Express then hydrated.

**Project Type**: Single web frontend application (existing Angular app at repo root `src/`).

**Performance Goals**: First interaction path (events list) usable well under standard web
expectations; simulated network latency fixed at ~300–400ms per mock call. No horizontal
scroll at ≥360px. Clean hydration (zero hydration warnings).

**Constraints**: No real network calls in this phase. Browser-only APIs (Leaflet, `document`)
MUST be guarded for SSR. All UI text in Spanish. Design tokens fixed by the reference brief.

**Scale/Scope**: ~4 routed screens, ~5 shared presentational components, 5 mock services,
6 data models. Single language. Organizer area is a placeholder route only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution: `.specify/memory/constitution.md` v1.0.0.

| Principle | Assessment | Status |
|-----------|------------|--------|
| I. Component-First Architecture | All components standalone with explicit `imports`; state via `signal`/`computed`; inputs/outputs via `input()`/`output()` (the brief's `@Input()` wording is superseded by this principle); `ChangeDetectionStrategy.OnPush` everywhere; shared logic in injectable services (`EventService`, `TeamService`, `ApplicationService`, …). No grouping-only components. | ✅ PASS |
| II. Type Safety & Template Strictness (NON-NEGOTIABLE) | `strict` + `strictTemplates` stay on. Every model is a declared interface; no `any`. Mock services return typed `Observable<T>`. Public component/service APIs fully typed. | ✅ PASS |
| III. Test-First Discipline | Each service and component ships Vitest unit tests in the same phase: capacity math, private-team hiding, full-team rejection, form validation, status transition, filter logic, SSR map guard. No skipped/focused specs. | ✅ PASS |
| IV. Accessibility & Responsive UX | Semantic markup; modal traps focus and restores on close, closes on Escape, labelled; visible focus rings; WCAG 2.1 AA contrast (dark token palette chosen to meet it); mobile-first, no fixed widths, no overflow at 360px; avatars and icon-only controls have text alternatives. | ✅ PASS |
| V. Performance & SSR Integrity | Every feature route lazy-loaded via `loadComponent`. Leaflet and any `document`/`window` access guarded with `isPlatformBrowser` / `afterNextRender`; map renders browser-only, SSR emits a static placeholder. No hydration mismatch. | ✅ PASS |

**Result**: PASS. No violations — Complexity Tracking left empty.

**Post-Design re-check**: Still PASS. Design artifacts (data-model, contracts, quickstart)
introduce no NgModules, no `any`, no unguarded browser APIs, no eager feature routes.

## Project Structure

### Documentation (this feature)

```text
specs/001-hackathon-team-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (service interface contracts)
│   ├── event-service.md
│   ├── team-service.md
│   ├── application-service.md
│   ├── user-service.md
│   └── notification-service.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

The existing Angular application at `src/` is used directly. Feature code is added under
`src/app/` following the brief's feature-folder layout:

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── event.model.ts
│   │   │   ├── team.model.ts
│   │   │   ├── application.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── notification.model.ts
│   │   ├── services/
│   │   │   ├── event.service.ts        (+ .spec.ts)
│   │   │   ├── team.service.ts         (+ .spec.ts)
│   │   │   ├── application.service.ts  (+ .spec.ts)
│   │   │   ├── user.service.ts         (+ .spec.ts)
│   │   │   └── notification.service.ts (+ .spec.ts)
│   │   └── mocks/
│   │       ├── events.mock.ts
│   │       ├── teams.mock.ts
│   │       └── users.mock.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── capacity-ring/     (capacity-ring.ts, .html, .css, .spec.ts)
│   │   │   ├── team-badge/
│   │   │   ├── avatar-stack/
│   │   │   ├── modal/
│   │   │   └── button/
│   │   └── pipes/
│   ├── features/
│   │   ├── events/
│   │   │   ├── events-list/
│   │   │   └── event-detail/
│   │   ├── teams/
│   │   │   └── team-join-form/
│   │   └── applications/
│   │       └── application-status/
│   ├── layout/
│   │   ├── navbar/
│   │   └── footer/
│   ├── app.routes.ts        (existing — extend with feature routes)
│   ├── app.config.ts        (existing)
│   └── app.config.server.ts (existing)
├── styles.css               (existing — add design tokens + typography imports)
└── environments/
    ├── environment.ts       (new: { apiUrl: '', useMocks: true })
    └── environment.prod.ts  (new)
```

**Structure Decision**: Single-project Angular frontend, no `frontend/`+`backend/` split —
there is no backend in this repo. The app already scaffolded at `src/` is extended in place;
`core/` holds cross-feature models, mock data, and services; `shared/` holds reusable
presentational components; `features/` holds one folder per routed screen; `layout/` holds
the sticky navbar and footer. Routes are lazy `loadComponent` entries in the existing
`src/app/app.routes.ts`.

## Complexity Tracking

> No Constitution Check violations. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
