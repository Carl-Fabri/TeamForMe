# Quickstart & Validation Guide: Hackathon Team Discovery & Join

## Prerequisites

- Node (per repo `packageManager`: npm 11.x), dependencies installed: `npm install`
- Leaflet types: `npm install leaflet @types/leaflet`
- No backend, no env vars — `src/environments/environment.ts` ships `{ apiUrl: '', useMocks: true }`

## Run

```bash
npm start            # ng serve → http://localhost:4200/
npm test             # ng test (Vitest) — all specs, no skips/focus
npm run build        # ng build — MUST pass with strict + strictTemplates
npm run serve:ssr:TeamForMe   # after build: SSR server, check for hydration warnings
```

## Manual validation scenarios

Each maps to a user story in [spec.md](./spec.md). Data comes only from
`src/app/core/mocks/*`.

### US1 — Explorar eventos (P1)

1. Open `/` → redirects to `/eventos`.
2. Expect a loading indicator (~400ms), then a grid of event cards with name, date, place.
3. Temporarily point the mock to an empty array → expect the "no hay eventos" message.
4. **Pass**: cards render from mock data; loading and empty states both visible.

### US2 — Detalle de evento y equipos (P1)

1. From `/eventos`, open an event → `/eventos/:id`.
2. Expect: Leaflet map centered on the event coords with a marker (browser only; SSR shows a
   same-size placeholder, no layout shift on hydrate).
3. Expect an aggregate capacity summary (sum of `filled` / sum of `capacity`).
4. Expect one card per team with a colored capacity ring (available / almost-full / full).
5. Public team → avatar stack with `+N` overflow. Private team → lock indicator, **no
   avatars, no member data anywhere in the DOM**.
6. Toggle filter `todos` / `con cupo` / `llenos` → list narrows accordingly.
7. Open `/eventos/does-not-exist` → "evento no encontrado".
8. **Pass**: all of the above; verify private-team DOM has zero member info.

### US3 — Postularse a un equipo (P1)

1. On a team with seats left, activate "Unirse" → modal opens
   (`/eventos/:eventId/equipos/:teamId/postular`).
2. Keyboard: focus is inside the modal, Tab cycles within it, Escape closes and returns
   focus to the "Unirse" control.
3. Submit empty / bad email → validation messages, submit disabled.
4. Fill valid data, submit → button locks during submit; on success redirect to
   `/postulaciones/:id`.
5. On a full team → "Unirse" is disabled and reads "Sin cupos disponibles".
6. Force a team to fill after opening the form → submit is rejected with a "equipo lleno"
   message (no application created).
7. **Pass**: modal a11y holds; validation blocks bad input; full-team paths both covered.

### US4 — Estado de la postulación (P2)

1. After US3 submit, `/postulaciones/:id` shows **Pendiente**.
2. Wait `RESOLVE_DELAY_MS` → status changes to **Aceptada** or **Rechazada** with no reload.
3. Open `/postulaciones/unknown-id` → "postulación no encontrada".
4. **Pass**: pending → terminal transition is visible without navigation.

## Automated coverage expectations (Vitest)

- `TeamService`: capacity aggregation, `applyToTeam` rejects when `filled >= capacity`.
- `ApplicationService`: create sets `pending`; scheduled transition reaches a terminal state
  exactly once; unknown id → `undefined`.
- `CapacityRingComponent`: `occupancyState` thresholds and ring color mapping.
- `AvatarStackComponent`: renders nothing for `isPrivate` teams; `+N` overflow math.
- `ModalComponent`: focus trap, Escape close, focus restoration.
- Application form: required + email validators, disabled-during-submit.
- Event detail map: no `document`/Leaflet access on the server platform (guard test).

## Constitution gates (must be green before merge)

`ng build` clean · `ng test` no skips/focus · Prettier no diffs · no `any` /
unguarded browser APIs · every feature route lazy `loadComponent` · SSR hydration
warning-free.
