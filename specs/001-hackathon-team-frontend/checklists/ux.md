# UX & Accessibility Requirements Quality Checklist: Hackathon Team Discovery & Join (Frontend)

**Purpose**: Validate that the UX, visual-design, accessibility, and responsive **requirements**
in the spec are complete, clear, consistent, and measurable before implementation.
**Created**: 2026-08-27
**Feature**: [spec.md](../spec.md)
**Audience / timing**: PR reviewer, pre-implementation gate · Depth: Standard
**Focus areas**: (1) Visual/UX requirement quality · (2) Accessibility & responsive requirement quality

**Note**: These are "unit tests for the requirements" — they check what is written, not whether code works.

**Status 2026-08-27**: Items marked `[x]` were resolved by the spec patch (FR-004/007/008/010/011/014/018/021/023/024/025/026, new FR-027a/FR-027b/FR-029, SC-005) and by adding
[`design-brief.md`](../design-brief.md). Items left `[ ]` are lower-impact detail
consciously **deferred for the MVP increment** (Phases 1–3) and should be closed before the
full build.

## Requirement Completeness

- [ ] CHK001 Are the required fields shown on an event card explicitly enumerated beyond "nombre, fecha y lugar"? [Completeness, Spec §US1, §FR-001]
- [ ] CHK002 Is the "resumen de aforo general" on the events list defined (what it aggregates, how it is expressed)? [Completeness, Spec §US1]
- [ ] CHK003 Are loading-state requirements specified for every data-backed view (events list, event detail, application status), not just described generically? [Completeness, Spec §FR-002, §SC-002]
- [ ] CHK004 Are error-state requirements (content, layout, retry affordance) defined for failed simulated calls? [Gap, Spec §FR-021, §SC-002]
- [ ] CHK005 Is the empty-state message content/placement for "no hay eventos" specified, or only that a message exists? [Completeness, Spec §FR-002]
- [ ] CHK006 Are requirements defined for how the aggregate capacity summary on event detail is calculated and labelled? [Completeness, Spec §FR-005]
- [ ] CHK007 Are the visual/interaction requirements for the team occupancy filter defined (control type, whether counts are shown)? [Gap, Spec §FR-010]
- [x] CHK008 Is the default filter state on entering event detail specified? [Gap, Spec §FR-010] — resolved: default "todos".
- [x] CHK009 Are requirements defined for the avatar-stack overflow indicator (max avatars before "+N", how "+N" is computed)? [Completeness, Spec §FR-008] — resolved: max 5, `N = members − 5`.
- [ ] CHK010 Are map requirements beyond "centered with a marker" specified (zoom level, whether the marker/popup is interactive, attribution)? [Gap, Spec §FR-004]
- [ ] CHK011 Are requirements defined for the application form's field-level help, placeholder, and submit-button labelling? [Gap, Spec §FR-012]
- [ ] CHK012 Is the content of the post-submit confirmation / status landing specified (what the user sees immediately on redirect)? [Completeness, Spec §FR-016, §US4]
- [ ] CHK013 Are requirements defined for the `organizador` placeholder route's visible content? [Gap, Spec §FR-028]
- [ ] CHK014 Is the `themeGradient` / "motivo visual" usage specified (where it appears, fallback when absent)? [Gap, Spec §FR-025, data-model Event]

## Requirement Clarity (quantification of vague terms)

- [x] CHK015 Is the "casi lleno" (almost-full) boundary quantified as a specific ratio or seat count? [Ambiguity, Spec §FR-007] — resolved: `0.8 ≤ filled/capacity < 1`.
- [x] CHK016 Are the three occupancy states given explicit, non-overlapping definitions? [Clarity, Spec §FR-007] — resolved.
- [x] CHK017 Is "coherente con el prototipo de referencia" expressed as verifiable criteria? [Measurability, Spec §FR-025] — resolved via `design-brief.md`.
- [x] CHK018 Are the exact design-token values captured in a spec-controlled artifact? [Clarity, Conflict, Spec §FR-025] — resolved: `design-brief.md`.
- [x] CHK019 Is "cabecera superior fija semitransparente" quantified (opacity, blur, scroll behaviour)? [Clarity, Spec §FR-025] — resolved: `backdrop-filter: blur(~12px)`, hairline border, sticky.
- [x] CHK020 Is the simulated network latency specified as a value/range in the spec? [Clarity, Spec §FR-021] — resolved: ~300–400 ms reads.
- [x] CHK021 Is the delay before a pending application resolves specified, fixed or randomised? [Ambiguity, Spec §FR-018, §FR-023] — resolved: fixed ~4 s.
- [x] CHK022 Is "contraste AA mínimo" tied to a specific standard/version and concrete token pairs? [Clarity, Assumptions] — resolved in `design-brief.md` (WCAG 2.1 AA + pairs).
- [x] CHK023 Are concrete breakpoints given, consistent with the 360px floor? [Clarity, Conflict, Spec §FR-026, §SC-007] — resolved: 640/960/1280, 360 hard floor.

## Requirement Consistency

- [ ] CHK024 Do the private-team hiding requirements agree across all references, with no wording that would still expose member counts or names? [Consistency, Spec §FR-008, §FR-009, §SC-003]
- [ ] CHK025 Are the "join" control states consistent between "team with seats" and "full team"? [Consistency, Spec §FR-011, §FR-013]
- [x] CHK026 Is the application form described consistently as modal vs routed screen, including direct-navigation behaviour? [Consistency, Spec §FR-011, §FR-027] — resolved: modal over event-detail, deep-linkable route loads detail as backdrop.
- [ ] CHK027 Are status labels consistent across the spec (user-facing set defined)? [Consistency, Spec §FR-017, §US4]
- [ ] CHK028 Do capacity-ring colour semantics match the occupancy-state definitions used elsewhere? [Consistency, Spec §FR-007]
- [x] CHK029 Is "todo el texto de UI en español" consistent with locale-formatting for dates/numbers? [Consistency, Gap, Spec §FR-024] — resolved: locale `es` required.

## Acceptance Criteria Quality / Measurability

- [ ] CHK030 Can SC-001 ("< 2 minutos y ≤ 4 pantallas") be objectively measured from the defined flow? [Measurability, Spec §SC-001]
- [ ] CHK031 Is SC-002 ("100% de las vistas que cargan datos") backed by an enumerable list of such views? [Measurability, Spec §SC-002]
- [ ] CHK032 Is SC-006 expressed with checkable sub-conditions (initial focus, trap, Escape, restore)? [Measurability, Spec §SC-006]
- [ ] CHK033 Is SC-007 measurable against a defined set of viewport widths? [Measurability, Spec §SC-007]
- [x] CHK034 Is SC-005 given an objective verification method in requirements? [Measurability, Spec §SC-005] — resolved: no `HttpClient` import under features/shared + T060.
- [ ] CHK035 Does each functional requirement have at least one associated acceptance scenario or success criterion? [Traceability, Spec §Requirements]

## Scenario Coverage (primary / alternate / exception / recovery)

- [ ] CHK036 Are alternate-flow requirements defined for deep links without visiting prior screens? [Coverage, Alternate Flow, Gap]
- [ ] CHK037 Are exception-flow requirements defined for a failed simulated load on each screen? [Coverage, Exception Flow, Spec §FR-021]
- [x] CHK038 Are recovery requirements defined after a rejected submission (edit + resubmit, form state retained)? [Coverage, Recovery, Spec §FR-014] — resolved: form data retained.
- [ ] CHK039 Are requirements defined for what the status view shows if resolution never arrives (indefinite pending)? [Coverage, Exception Flow, Gap, Spec §FR-018]
- [ ] CHK040 Are requirements defined for returning to the event list/detail after viewing an application status? [Coverage, Alternate Flow, Gap]

## Edge Case Coverage

- [ ] CHK041 Is behaviour specified for an event with no teams? [Edge Case, Gap, Spec §US2]
- [x] CHK042 Is behaviour specified when a filter selection yields zero teams? [Edge Case, Gap, Spec §FR-010] — resolved: "no hay equipos con ese criterio" message.
- [x] CHK043 Is the map's degraded requirement clear for missing `coords` vs failed tiles (two cases)? [Edge Case, Spec §FR-004] — resolved: both cases specified.
- [x] CHK044 Is double-submit prevention stated as a requirement incl. in-flight control state? [Edge Case, Spec §FR-015] — resolved (FR-015 + edge case).
- [ ] CHK045 Are requirements defined for very long team/tag/event names within cards (truncation / wrapping)? [Edge Case, Gap]
- [x] CHK046 Is behaviour specified for `filled === capacity` (is that "full")? [Edge Case, Spec §FR-007] — resolved: `≥ 1` includes equality.
- [ ] CHK047 Is the modal on 360px specified (no overflow, tall-form scroll behaviour)? [Edge Case, Spec §Edge Cases, §SC-007]

## Non-Functional — Accessibility

- [ ] CHK048 Are the modal's ARIA requirements fully specified (role, `aria-modal`, name source, initial focus)? [Completeness]
- [x] CHK049 Is a visible focus-indicator requirement stated for all interactive elements? [Gap] — resolved: FR-027a.
- [x] CHK050 Are requirements defined for announcing the auto Pendiente → final change to AT? [Gap, Spec §FR-018] — resolved: aria-live region.
- [x] CHK051 Are text-alternative requirements defined for icon-only controls and initial-only avatars? [Completeness, Spec §FR-008] — resolved for avatars (alt text); lock badge conveys text "Privado".
- [ ] CHK052 Are form-validation messaging requirements defined in accessible terms (field association, not colour-only)? [Completeness, Spec §FR-012]
- [ ] CHK053 Is keyboard operability required for the team filter and capacity info, not only the apply flow? [Coverage, Gap, Spec §SC-006]
- [x] CHK054 Is a reduced-motion requirement stated for the capacity ring and gradient effects? [Gap] — resolved: FR-027b.

## Non-Functional — Responsive & Visual

- [x] CHK055 Are layout requirements defined per breakpoint for the event grid and the team grid? [Completeness, Spec §FR-026] — resolved: column counts in `design-brief.md`.
- [ ] CHK056 Is the sticky navbar's behaviour on small viewports specified (collapse, height, content)? [Gap, Spec §FR-025, §FR-026]
- [x] CHK057 Are font-loading fallback requirements stated so text stays legible if a web font fails? [Gap, Spec §FR-025] — resolved: fallback stacks + `font-display: swap`.
- [x] CHK058 Is a no-layout-shift requirement stated for the SSR map placeholder vs hydrated map? [Gap, Spec §FR-004] — resolved.

## Dependencies & Assumptions

- [ ] CHK059 Is the dependency on an external map/tile provider documented, including the offline/failure requirement? [Dependency, Spec §Assumptions, §FR-004]
- [ ] CHK060 Is the assumption of a single simulated "current user" documented with what identity data the UI may show? [Assumption, Spec §Assumptions]
- [ ] CHK061 Is the assumption that entity data shapes equal the future backend's contracts stated as a validated dependency, with an owner? [Assumption, Spec §Assumptions, §FR-022]
- [x] CHK062 Is the reference prototype identified as a concrete, retrievable artifact rather than an unversioned description? [Assumption, Dependency] — resolved: `design-brief.md`.

## Ambiguities & Conflicts (to resolve before implementation)

- [x] CHK063 CONFLICT: 360px floor vs 640/960/1280 breakpoints — which is authoritative? [Conflict] — resolved: both, 360 = hard floor, named breakpoints 640/960/1280.
- [x] CHK064 AMBIGUITY: "modal" vs routed `.../postular` — route, overlay, or both? [Ambiguity] — resolved: both (overlay with deep-linkable route).
- [x] CHK065 GAP: exact colour/typography token values not in any spec-controlled file. [Gap] — resolved: `design-brief.md`.
- [x] CHK066 AMBIGUITY: resolution outcome selection rule unspecified. [Ambiguity, Spec §FR-023] — resolved: deterministic per team (seeded "always rejects", else accepts).

## Notes

- 30 of 66 items resolved in the spec on 2026-08-27; 36 lower-impact items deferred to close
  before the full (non-MVP) build.
- ≥80% of items carry a traceability reference.
