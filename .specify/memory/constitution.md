<!--
Sync Impact Report
==================
Version change: (none / template) → 1.0.0
Bump rationale: Initial ratification of a concrete project constitution, replacing the
unfilled template. MINOR/PATCH not applicable to first adoption.

Modified principles: (initial adoption — all principles new)
  - Added: I. Component-First Architecture
  - Added: II. Type Safety & Template Strictness (NON-NEGOTIABLE)
  - Added: III. Test-First Discipline
  - Added: IV. Accessibility & Responsive UX
  - Added: V. Performance & SSR Integrity

Added sections:
  - Core Principles (5 principles)
  - Technology & Tooling Constraints
  - Development Workflow & Quality Gates
  - Governance

Removed sections: none (template placeholders replaced)

Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible (Constitution Check gate is generic)
  - .specify/templates/spec-template.md ✅ compatible (no constitution-specific slots)
  - .specify/templates/tasks-template.md ✅ compatible (task categories cover testing/a11y/perf)
  - .specify/templates/checklist-template.md ✅ compatible (no changes needed)

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Confirmed as 2026-08-27 (project inception). Revise if the
    team adopts a different official adoption date.
-->

# TeamForMe Frontend Constitution

## Core Principles

### I. Component-First Architecture

Every UI capability is built as a small, standalone Angular component with a single, clear
responsibility. Rules:

- Components MUST be standalone (no NgModules) and declare explicit `imports`.
- Reactive state MUST use Angular signals (`signal`, `computed`, `input`, `output`, `model`);
  new code MUST NOT introduce `@Input()`/`@Output()` decorators or manual `Subject` state
  where a signal suffices.
- Components MUST use `ChangeDetectionStrategy.OnPush`.
- Shared logic MUST live in injectable services or standalone utilities, not in base
  classes or copy-paste. A component that exists only to group other components without
  adding behavior is not allowed.

Rationale: A consistent, signal-based standalone model keeps change detection cheap, makes
components independently testable, and prevents the architectural drift that NgModule-era
Angular codebases accumulate.

### II. Type Safety & Template Strictness (NON-NEGOTIABLE)

The project builds with TypeScript `strict` and Angular `strictTemplates` enabled, and this
MUST NOT be weakened.

- `any` is forbidden in application code. Use `unknown` plus narrowing, generics, or a
  declared interface.
- Compiler options `strict`, `strictTemplates`, `strictInjectionParameters`, and
  `strictInputAccessModifiers` MUST remain `true`.
- `// @ts-ignore`, `// @ts-expect-error`, and non-null assertions (`!`) require an inline
  comment justifying why the type cannot be expressed correctly.
- Public service and component APIs MUST have explicit types on their inputs, outputs, and
  return values.

Rationale: The type checker is the cheapest test we have. Every escape hatch left in the
codebase is a class of runtime bug that ships to users.

### III. Test-First Discipline

Behavior is specified by tests written alongside or before the implementation, run with
Vitest.

- Every new component, service, pipe, guard, or resolver MUST ship with unit tests in the
  same change.
- A bug fix MUST include a test that fails before the fix and passes after.
- Tests MUST assert observable behavior (rendered output, emitted events, service results),
  not private implementation details.
- `ng test` MUST pass with no skipped or focused specs before a change is merged.

Rationale: Tests written with the code capture intent while it is fresh and make refactors
under the strict compiler safe rather than scary.

### IV. Accessibility & Responsive UX

The application is usable with a keyboard, a screen reader, and any viewport from small
mobile to desktop.

- Markup MUST be semantic first (`button`, `nav`, `main`, `label`/`for`); ARIA is used only
  to fill gaps semantics cannot.
- Every interactive element MUST be reachable and operable by keyboard with a visible focus
  indicator; modals MUST trap focus while open and restore it on close.
- Color, spacing, and typography MUST target WCAG 2.1 AA contrast; layout MUST be built
  responsively (mobile-first), not with fixed pixel widths that break below 360px.
- Images and icon-only controls MUST have text alternatives.

Rationale: Accessibility and responsiveness are requirements, not enhancements; retrofitting
them later costs far more than building them in.

### V. Performance & SSR Integrity

The app is server-rendered (Angular SSR + Express) and MUST hydrate cleanly and load fast.

- Routes MUST be lazy-loaded via `loadComponent`/`loadChildren` unless they are part of the
  initial shell.
- Server-rendered output MUST hydrate without console hydration errors or content mismatch.
- Code that touches `window`, `document`, `localStorage`, or other browser-only APIs MUST be
  guarded for the server environment.
- Changes that measurably regress bundle size or Core Web Vitals (LCP, CLS, INP) MUST be
  justified in the PR or reworked.

Rationale: SSR only pays off if hydration is correct and the critical path stays small; an
unguarded browser API or an eager route silently defeats it.

## Technology & Tooling Constraints

- **Framework**: Angular 21.x with standalone APIs and signals. Introducing NgModules or
  downgrading Angular requires a constitution amendment.
- **Language**: TypeScript 5.9.x under `strict`.
- **Styling**: A custom design-token system (CSS custom properties). No Material-style
  component library. Global styles are limited to design tokens, resets, and base element
  styles; component-specific styling stays with the component.
- **Testing**: Vitest via `ng test`. New test frameworks are not added without an amendment.
- **Rendering**: Angular SSR with the Express server in `src/server.ts`.
- **Formatting**: Prettier is the single source of truth for formatting; the committed
  `.prettierrc` MUST be applied and MUST NOT be overridden per-file.
- **Package manager**: npm (pinned via `packageManager` in `package.json`). Do not commit
  lockfiles from other package managers.

## Development Workflow & Quality Gates

- **Spec Kit flow**: Features move through `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. The plan's Constitution Check gate MUST be
  completed and passing before implementation tasks begin.
- **Pre-merge gates** (all MUST pass):
  1. `ng build` succeeds (including `strictTemplates`).
  2. `ng test` passes with no skipped or focused specs.
  3. Prettier reports no formatting diffs.
  4. No new `any`, unexplained `@ts-ignore`, or unguarded browser API usage.
- **Code review**: At least one reviewer other than the author MUST approve. Reviews
  explicitly check the change against every Core Principle.
- **Complexity**: Any deviation from a principle MUST be recorded in the plan's Complexity
  Tracking table with the simpler alternative that was rejected and why.

## Governance

- This constitution supersedes ad-hoc conventions. Where guidance conflicts, the
  constitution wins.
- **Amendment procedure**: Propose the change in a PR that edits this file, including an
  updated Sync Impact Report and the rationale. Merging requires approval from a project
  maintainer. Dependent templates and guidance docs MUST be updated in the same PR.
- **Versioning policy** (semantic):
  - **MAJOR**: Removing or redefining a principle in a backward-incompatible way, or
    removing a governance rule.
  - **MINOR**: Adding a new principle or section, or materially expanding an existing one.
  - **PATCH**: Clarifications, wording, and non-semantic refinements.
- **Compliance review**: Every PR review verifies principle compliance. A principle
  violation blocks merge unless justified in Complexity Tracking. Maintainers SHOULD do a
  periodic pass of the codebase against this document and open cleanup tasks for drift.
- **Runtime guidance**: Agents and contributors read the current feature plan under
  `specs/` for technology and structure context, as noted in `CLAUDE.md`.

**Version**: 1.0.0 | **Ratified**: 2026-08-27 | **Last Amended**: 2026-08-27
