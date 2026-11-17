# Design Brief (Visual Source of Truth): TeamForMe Frontend

Extracted from the original "EventFlow / TeamForMe" brief. This file is the authoritative
reference for FR-025. The reference prototype is a validated dark-mode HTML/CSS mockup in
the "Luma" style.

## Color tokens (exact)

Defined as CSS custom properties on `:root` in `src/styles.css`:

```css
:root {
  --bg: #08090d;
  --surface: #111319;
  --surface-2: #171a22;
  --surface-3: #1d2029;
  --line: #232631;
  --text: #f1eff7;
  --text-muted: #8a8d9c;

  --violet: #7c5cff;
  --violet-soft: rgba(124, 92, 255, 0.2);
  --violet-dark: #5b3fe0;
  --teal: #2ddda6;
  --coral: #ff5d72;
  --amber: #f5b14c;
}
```

### Semantic mapping

| Use                                                     | Token                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| Page background                                         | `--bg`                                                     |
| Card / panel background                                 | `--surface`, `--surface-2` (raised), `--surface-3` (input) |
| Hairline borders / dividers                             | `--line`                                                   |
| Primary body text                                       | `--text`                                                   |
| Secondary / muted text, private-team lock label         | `--text-muted`                                             |
| Primary action, focus ring, accent gradients            | `--violet` (hover `--violet-dark`, tint `--violet-soft`)   |
| Capacity ring — **disponible** state; público badge dot | `--teal`                                                   |
| Capacity ring — **lleno** state; destructive / rejected | `--coral`                                                  |
| Capacity ring — **casi lleno** state; warning / pending | `--amber`                                                  |

### Contrast

Target **WCAG 2.1 AA** (≥ 4.5:1 for body text, ≥ 3:1 for large text and UI boundaries).
`--text` on `--bg`/`--surface` and `--text-muted` on `--surface` meet AA; accent colors are
used for non-text or large-text emphasis, not small body copy on dark.

## Typography

| Token            | Family         | Fallback stack                                               | Used for                                 |
| ---------------- | -------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `--font-display` | Space Grotesk  | `"Space Grotesk", "Segoe UI", system-ui, sans-serif`         | Titles / display headings                |
| `--font-body`    | Inter          | `Inter, system-ui, -apple-system, "Segoe UI", sans-serif`    | Body copy, form fields, labels           |
| `--font-mono`    | JetBrains Mono | `"JetBrains Mono", ui-monospace, "Cascadia Code", monospace` | Numerals, badges, stats, capacity counts |

Web fonts loaded via `<link>` in `src/index.html`; text MUST remain legible with the
fallback stack if a web font fails (`font-display: swap`).

## Component visual rules

- **Cards**: rounded corners 12–16px, background `--surface` / `--surface-2`, soft shadow,
  **no hard borders and no decorative colored edge stripes**.
- **Header backdrop**: dominant dark background with subtle radial gradients in violet/teal
  (a repeated motif in section headers).
- **Capacity ring**: SVG progress ring using `stroke-dasharray` to show `filled/capacity`.
  Color by occupancy state:
  - `disponible` → `--teal` when `filled / capacity < 0.8`
  - `casi lleno` → `--amber` when `0.8 ≤ filled / capacity < 1`
  - `lleno` → `--coral` when `filled / capacity ≥ 1` (includes `filled === capacity`)
- **Badges**: `● Público` with a `--teal` dot / `🔒 Privado` in `--text-muted`. Private
  teams show **only** the lock — never avatars or member data.
- **Avatar stack**: overlapping circular avatars with initials on a `avatarColor` fill.
  Show at most **5** avatars; if the team has more, show a trailing `+N` chip where
  `N = members.length - 5`. Entire stack is omitted for private teams.
- **Navbar**: top, `position: sticky`, semi-transparent surface with
  `backdrop-filter: blur(...)` (~12px), hairline bottom border `--line`.
- **Footer**: minimal — project wordmark + muted secondary links placeholder; same dark
  surface, hairline top border.

## Responsive

- Mobile-first. Named breakpoints: **640px**, **960px**, **1280px**.
- MUST render with **no horizontal overflow from 360px** upward (hard floor).
- Event grid: 1 col < 640, 2 col ≥ 640, 3 col ≥ 960, 4 col ≥ 1280.
- Team grid: 1 col < 640, 2 col ≥ 960, 3 col ≥ 1280.
- The apply modal is full-width with page gutters at < 640px, centered fixed-max-width above.

## Motion

- Respect `prefers-reduced-motion`: disable ring fill animation and gradient transitions,
  keep instant state changes.
