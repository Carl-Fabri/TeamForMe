---
description: 'Task list for Hackathon Team Discovery & Join (Frontend)'
---

# Tasks: Hackathon Team Discovery & Join (Frontend)

**Input**: Design documents from `specs/001-hackathon-team-frontend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: INCLUDED — Constitution Principle III (Test-First Discipline) is non-negotiable;
every service/component/pipe ships Vitest specs in the same phase.

**Organization**: Grouped by user story (US1–US4) for independent implementation & testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[Story]**: US1 / US2 / US3 / US4 (setup, foundational, polish carry no story label)
- Paths are repo-relative; the Angular app lives at `src/`

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Install map dependency: `npm install leaflet @types/leaflet`
- [X] T002 [P] Create `src/environments/environment.ts` and `src/environments/environment.prod.ts` exporting `{ apiUrl: '', useMocks: true }`; add `fileReplacements` for the production configuration in `angular.json`
- [X] T003 [P] Add design tokens and `--font-display/-body/-mono` (with fallback stacks) to `src/styles.css` using the **exact values in `design-brief.md`**; add Space Grotesk / Inter / JetBrains Mono `<link>` (`font-display: swap`) to `src/index.html`; set `<html lang="es">`; add a `prefers-reduced-motion` base rule
- [X] T004 [P] Create empty folder structure per plan: `src/app/core/{models,services,mocks}`, `src/app/shared/{components,pipes}`, `src/app/features/{events,teams,applications}`, `src/app/layout/{navbar,footer}`
- [X] T005 Verify `.gitignore` and `.prettierignore` cover `node_modules/`, `dist/`, `*.log`, `.env*`, `coverage/`; append any missing

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [X] T006 [P] Create `EventModel` in `src/app/core/models/event.model.ts` per data-model.md
- [X] T007 [P] Create `TeamModel` + `TeamMember` in `src/app/core/models/team.model.ts`
- [X] T008 [P] Create `ApplicationModel` + `ApplicationStatus` + `CreateApplicationInput` in `src/app/core/models/application.model.ts`
- [X] T009 [P] Create `UserModel` in `src/app/core/models/user.model.ts`
- [X] T010 [P] Create `NotificationModel` + `NotificationType` in `src/app/core/models/notification.model.ts`
- [X] T011 [P] Create `MOCK_EVENTS` in `src/app/core/mocks/events.mock.ts` (≥3 events, one without `coords`)
- [X] T012 [P] Create `MOCK_TEAMS` in `src/app/core/mocks/teams.mock.ts` (mix of public/private, one full, one seeded always-`rejected`)
- [X] T013 [P] Create `MOCK_USERS` + `MOCK_CURRENT_USER` in `src/app/core/mocks/users.mock.ts`
- [X] T014 [P] Create occupancy helper + `occupancyState` pure pipe in `src/app/shared/pipes/occupancy.pipe.ts` (+ `.spec.ts`): thresholds available `<0.8`, almost-full `<1`, full `>=1`
- [X] T015 [P] Create `ButtonComponent` in `src/app/shared/components/button/` (standalone, OnPush, `input()` for variant/disabled, projected content) (+ `.spec.ts`)
- [X] T016 Create `NavbarComponent` in `src/app/layout/navbar/` (sticky, translucent, `backdrop-filter`) and `FooterComponent` in `src/app/layout/footer/` (+ specs); render both in `src/app/app.html` around `<router-outlet>`
- [X] T017 Update `src/app/app.routes.ts` with lazy `loadComponent` routes: `'' → redirect eventos`, `eventos`, `eventos/:id`, `eventos/:eventId/equipos/:teamId/postular`, `postulaciones/:id`, `organizador` (placeholder), `** → NotFoundComponent`; create `NotFoundComponent` and `OrganizadorPlaceholderComponent` in `src/app/features/` — _MVP: `eventos`, `organizador`, `**` + redirect wired and `NotFoundComponent`/`OrganizadorPlaceholderComponent` created; `eventos/:id`, `.../postular`, `postulaciones/:id` are added in Phases 4–6 with their components._
- [X] T018 Confirm `src/app/app.config.ts` provides router + client hydration + zoneless/animations as already scaffolded; no NgModules introduced

**Checkpoint**: Models, mocks, shared primitives, layout shell and routing skeleton compile (`ng build`).

---

## Phase 3: User Story 1 - Explorar eventos disponibles (Priority: P1) 🎯 MVP

**Goal**: `/eventos` lists hackathons from the mock layer with loading and empty states.

**Independent Test**: Load `/eventos`; see loading indicator then event cards; point mock to `[]` and see the empty message.

### Tests for User Story 1

- [X] T019 [P] [US1] `event.service.spec.ts`: `getEvents` returns mock list after delay; `getEventById` returns `undefined` for unknown id; error path emits via `throwError`
- [X] T020 [P] [US1] `events-list.spec.ts`: renders one card per event; shows loading state; shows "no hay eventos" for empty list

### Implementation for User Story 1

- [X] T021 [US1] Implement `EventService` in `src/app/core/services/event.service.ts` per `contracts/event-service.md` (`getEvents`, `getEventById`, `of(...).pipe(delay())`, HTTP branch commented)
- [X] T022 [US1] Implement `EventsListComponent` in `src/app/features/events/events-list/` (standalone, OnPush, signal state: `loading`, `events`, `error`; grid of event cards with name/date/place; loading + empty + error templates; Spanish copy)
- [X] T023 [US1] Wire `eventos` route to `EventsListComponent`; card click navigates to `eventos/:id`

**Checkpoint**: US1 fully functional and testable on its own (MVP).

---

## Phase 4: User Story 2 - Ver el detalle de un evento y sus equipos (Priority: P1)

**Goal**: `/eventos/:id` shows an SSR-safe map, aggregate capacity, team cards with capacity ring / visibility badge / avatar stack, and a team filter.

**Independent Test**: Open a known event; verify map+marker (browser) / placeholder (SSR), capacity summary, per-team cards, private teams expose no member data, filter narrows the list.

### Tests for User Story 2

- [ ] T024 [P] [US2] `team.service.spec.ts`: `getTeamsByEvent` filters by `eventId` and returns private teams with `members: []`; `getTeamById` lookup
- [ ] T025 [P] [US2] `capacity-ring.spec.ts`: ring `stroke-dasharray` reflects `filled/capacity`; color class per occupancy state
- [ ] T026 [P] [US2] `avatar-stack.spec.ts`: renders nothing when team `isPrivate`; `+N` overflow math for public teams
- [ ] T027 [P] [US2] `team-badge.spec.ts`: shows público (teal) vs privado (lock) variant
- [ ] T028 [P] [US2] `event-detail.spec.ts`: capacity summary aggregation; filter todos/con cupo/llenos; unknown id → "evento no encontrado"; no Leaflet/`document` access when `PLATFORM_ID` is server

### Implementation for User Story 2

- [ ] T029 [P] [US2] Implement `TeamService` in `src/app/core/services/team.service.ts` per `contracts/team-service.md` (`getTeamsByEvent`, `getTeamById`; `applyToTeam` stub added in Phase 5)
- [ ] T030 [P] [US2] Implement `CapacityRingComponent` in `src/app/shared/components/capacity-ring/` (SVG ring, `filled`/`capacity` via `input.required<number>()`, OnPush, color by occupancy pipe, `aria-label`)
- [ ] T031 [P] [US2] Implement `TeamBadgeComponent` in `src/app/shared/components/team-badge/` (`isPrivate` input)
- [ ] T032 [P] [US2] Implement `AvatarStackComponent` in `src/app/shared/components/avatar-stack/` (`members` + `isPrivate` inputs; hidden entirely when private; `+N`; initials have text alternative)
- [ ] T033 [US2] Implement `TeamCardComponent` in `src/app/features/teams/team-card/` (composes ring + badge + avatar-stack; "Unirse" button disabled + "Sin cupos disponibles" when `isFull`)
- [ ] T034 [US2] Implement `EventDetailComponent` in `src/app/features/events/event-detail/`: load event + teams (signal state, loading/error/not-found); aggregate capacity summary; team filter (todos/con cupo/llenos) as computed signal; Leaflet map guarded with `isPlatformBrowser` + `afterNextRender` + dynamic `import('leaflet')`, SSR placeholder div, notice when `coords` missing or tiles fail
- [ ] T035 [US2] Wire `eventos/:id` route to `EventDetailComponent`

**Checkpoint**: US1 and US2 both work independently; SSR build has no hydration warnings.

---

## Phase 5: User Story 3 - Postularse a un equipo (Priority: P1)

**Goal**: Accessible modal form to apply to a team with seats; validation; full-team blocked pre-submit and rejected at submit; redirect to status view.

**Independent Test**: Open form from a team with seats; keyboard trap + Escape + focus restore; invalid input blocks submit; valid submit redirects to `/postulaciones/:id`; full team disables "Unirse"; team filling after open → submit rejected.

### Tests for User Story 3

- [ ] T036 [P] [US3] `modal.spec.ts`: focus moves in on open, Tab/Shift+Tab trapped, Escape closes, focus restored to opener, background scroll locked
- [ ] T037 [P] [US3] `application.service.spec.ts`: `createApplication` sets `status: 'pending'`, assigns id/`createdAt`, pushes to store; scheduled transition reaches exactly one terminal state; `getApplicationById` streams updates; unknown id → `undefined`
- [ ] T038 [P] [US3] `team.service.applyToTeam.spec.ts`: rejects with `TeamFullError` when `filled >= capacity`; on success increments `filled` and returns `pending` application
- [ ] T039 [P] [US3] `team-join-form.spec.ts`: required + email validators; submit disabled while invalid and while in flight; full-team path shows "equipo lleno"

### Implementation for User Story 3

- [ ] T040 [P] [US3] Implement `ModalComponent` in `src/app/shared/components/modal/` (`role="dialog"`, `aria-modal`, `aria-labelledby`; focus trap; `keydown.escape` close; focus save/restore; scroll lock; `close` output)
- [ ] T041 [P] [US3] Implement `UserService` in `src/app/core/services/user.service.ts` per `contracts/user-service.md` (`getCurrentUser`, `getUserById`)
- [ ] T042 [US3] Implement `ApplicationService` in `src/app/core/services/application.service.ts` per `contracts/application-service.md` (in-memory store, `createApplication`, `getApplicationById` with `BehaviorSubject`/`Subject` stream, scheduled resolution via `timer`)
- [ ] T043 [US3] Extend `TeamService` with `applyToTeam(input: CreateApplicationInput)`, `TeamFullError`, capacity check against mock store, delegate record creation to `ApplicationService` (per `contracts/team-service.md`)
- [ ] T044 [US3] Implement `TeamJoinFormComponent` in `src/app/features/teams/team-join-form/` (opens in `ModalComponent`; reactive form: fullName, email, role, motivation; validation messages in Spanish; submit locked while invalid/in-flight; on success navigate to `postulaciones/:id`; on `TeamFullError` show "equipo lleno")
- [ ] T045 [US3] Wire `eventos/:eventId/equipos/:teamId/postular` route to `TeamJoinFormComponent`; "Unirse" in `TeamCardComponent` navigates here (disabled when full)

**Checkpoint**: US1–US3 independently functional; full apply flow works on mock data.

---

## Phase 6: User Story 4 - Seguir el estado de una postulación (Priority: P2)

**Goal**: `/postulaciones/:id` shows Pendiente, then auto-updates to Aceptada/Rechazada with no reload; unknown id → not-found.

**Independent Test**: After a submit, open the status view, see Pendiente, observe automatic transition; open an unknown id and see "postulación no encontrada".

### Tests for User Story 4

- [ ] T046 [P] [US4] `application-status.spec.ts`: renders current status; updates the view when the service stream emits a terminal status; unknown id → "postulación no encontrada"
- [ ] T047 [P] [US4] `notification.service.spec.ts`: `notifyApplicationResolved` pushes a notification with `type` derived from status and Spanish message; `getNotifications` returns them for the user

### Implementation for User Story 4

- [ ] T048 [P] [US4] Implement `NotificationService` in `src/app/core/services/notification.service.ts` per `contracts/notification-service.md`
- [ ] T049 [US4] Hook `ApplicationService` terminal transition to call `NotificationService.notifyApplicationResolved`
- [ ] T050 [US4] Implement `ApplicationStatusComponent` in `src/app/features/applications/application-status/` (subscribe to `getApplicationById` as signal; status chip pending/accepted/rejected in Spanish; not-found template)
- [ ] T051 [US4] Wire `postulaciones/:id` route to `ApplicationStatusComponent`

**Checkpoint**: All four user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T052 [P] Run Prettier across the repo; resolve all formatting diffs
- [ ] T053 [P] Audit for `any`, unexplained `@ts-ignore`/`!`, and unguarded `window`/`document`; fix
- [ ] T054 Run `ng build` — must pass with `strict` + `strictTemplates`, zero warnings
- [ ] T055 Run `ng test` — all specs pass, no skipped/focused specs
- [ ] T056 Build + `npm run serve:ssr:TeamForMe`; confirm zero hydration warnings and stable layout on the event detail route
- [ ] T057 [P] Accessibility pass: visible focus indicators, AA contrast on the token palette, modal semantics, keyboard-only run of the apply flow (SC-006)
- [ ] T058 [P] Responsive pass: no horizontal overflow at 360 / 640 / 960 / 1280px (SC-007)
- [ ] T059 Execute `quickstart.md` scenarios US1–US4 end to end on mock data (SC-004)
- [ ] T060 [P] Add a guard check (script or unit test) asserting no file under `src/app/features/` or `src/app/shared/` imports `HttpClient` and that component specs consume only the public service API (SC-005)
- [ ] T061 [P] Audit all templates for non-Spanish UI strings and for `es` date/number formatting (FR-024, SC-008)

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: no dependencies.
- **Phase 2 (Foundational)**: after Setup. BLOCKS all user stories. T006–T015 mostly `[P]`; T016–T018 touch shared files (sequential).
- **Phase 3 US1 (P1)**: after Phase 2. No dependency on other stories. MVP.
- **Phase 4 US2 (P1)**: after Phase 2. Independent of US1 (shares only `core/` + `shared/`).
- **Phase 5 US3 (P1)**: after Phase 2. Uses `TeamService`/`TeamCardComponent` from US2's files — run US2 before US3, or coordinate T029/T033/T043 which touch the same files.
- **Phase 6 US4 (P2)**: after Phase 2. Depends on `ApplicationService` (T042) from US3 for a live end-to-end demo; `ApplicationStatusComponent` itself is independently testable with a stubbed service.
- **Phase 7 (Polish)**: after all desired stories.

### Within each story

- Tests written first and failing → then implementation.
- Models → services → components → route wiring.

### Parallel opportunities

- T002/T003/T004 in Setup.
- T006–T015 in Foundational (distinct files).
- All `[P]` test tasks within a story.
- `[P]` shared components within US2 (T030/T031/T032) and US3 (T040/T041).

---

## Parallel Example: User Story 2

```text
# Tests together:
T024 team.service.spec.ts · T025 capacity-ring.spec.ts · T026 avatar-stack.spec.ts
T027 team-badge.spec.ts · T028 event-detail.spec.ts

# Then shared presentational components together:
T030 CapacityRingComponent · T031 TeamBadgeComponent · T032 AvatarStackComponent
```

---

## Implementation Strategy

- **MVP**: Phase 1 → Phase 2 → Phase 3 (US1). Stop, validate `/eventos`, demo.
- **Increment 2**: Phase 4 (US2) → validate event detail + private-team hiding.
- **Increment 3**: Phase 5 (US3) → validate the apply flow.
- **Increment 4**: Phase 6 (US4) → validate live status.
- **Harden**: Phase 7 gates (build / test / SSR / a11y / responsive / quickstart).

---

## Notes

- `[P]` = different files, no incomplete dependency.
- Every component: standalone, `ChangeDetectionStrategy.OnPush`, signal `input()`/`output()`.
- No NgModules, no `any`, no unguarded browser APIs, no Angular Material.
- Commit after each task or logical group; mark tasks `[X]` here as they complete.
