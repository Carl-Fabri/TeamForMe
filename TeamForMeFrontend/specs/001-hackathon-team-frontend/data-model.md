# Phase 1 Data Model: Hackathon Team Discovery & Join (Frontend)

All types are declared TypeScript `interface` / `type` aliases in `src/app/core/models/`.
No `any`. Shapes mirror the future backend entities (`MS_Events`, `MS_Teams`,
`MS_Applications`, `MS_Users`, `MS_Notifications`).

## Event — `event.model.ts`

| Field            | Type                           | Notes                                                            |
| ---------------- | ------------------------------ | ---------------------------------------------------------------- |
| `id`             | `string`                       | stable identifier                                                |
| `name`           | `string`                       | display name                                                     |
| `date`           | `string`                       | ISO 8601 date/datetime                                           |
| `location`       | `string`                       | human-readable place                                             |
| `coords`         | `{ lat: number; lng: number }` | map centre/marker; may be absent → map hidden (FR-004 edge case) |
| `description?`   | `string`                       | optional summary                                                 |
| `themeGradient?` | `string`                       | optional decorative gradient token                               |

- **Relationships**: one Event has many Teams (`Team.eventId`).
- **Validation**: `date` parseable as a date; `coords.lat` ∈ [-90, 90], `coords.lng` ∈ [-180, 180] when present.

## Team — `team.model.ts`

| Field       | Type           | Notes                                           |
| ----------- | -------------- | ----------------------------------------------- |
| `id`        | `string`       |                                                 |
| `eventId`   | `string`       | FK → Event.id                                   |
| `name`      | `string`       |                                                 |
| `tag`       | `string`       | area/skill label, e.g. "Backend Cloud"          |
| `capacity`  | `number`       | integer ≥ 1, total seats                        |
| `filled`    | `number`       | integer, `0 ≤ filled ≤ capacity`                |
| `isPrivate` | `boolean`      |                                                 |
| `members`   | `TeamMember[]` | MUST be `[]` when `isPrivate === true` (FR-009) |

### Derived (computed in UI / helpers, not stored)

| Name             | Rule                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| `seatsLeft`      | `capacity - filled`                                                              |
| `isFull`         | `filled >= capacity`                                                             |
| `occupancyState` | `available` if `filled/capacity < 0.8`; `almost-full` if `< 1`; `full` if `>= 1` |

- **Validation**: `filled` never exceeds `capacity` (mock store enforces on apply, FR-014/SC-009);
  private teams expose no member data anywhere (SC-003).

## TeamMember — `team.model.ts`

| Field         | Type     | Notes                |
| ------------- | -------- | -------------------- |
| `userId`      | `string` | FK → User.id         |
| `initials`    | `string` | 1–3 chars for avatar |
| `avatarColor` | `string` | CSS color token/hex  |

## Application — `application.model.ts`

```ts
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
```

| Field        | Type                | Notes                                 |
| ------------ | ------------------- | ------------------------------------- |
| `id`         | `string`            | generated on create                   |
| `teamId`     | `string`            | FK → Team.id                          |
| `userId`     | `string`            | FK → User.id (simulated current user) |
| `fullName`   | `string`            | from form, required                   |
| `email`      | `string`            | from form, required, email format     |
| `role`       | `string`            | skill/role offered, required          |
| `motivation` | `string`            | required, free text                   |
| `status`     | `ApplicationStatus` | starts `pending`                      |
| `createdAt`  | `string`            | ISO timestamp                         |

- **State transitions**: `pending → accepted` or `pending → rejected` (one-way, terminal).
  Transition is scheduled by the mock after a delay (FR-018/FR-023). No transition out of a
  terminal state.
- **Creation preconditions**: target team exists and `filled < capacity` (else rejected with
  a typed "team full" error, FR-014).

## User — `user.model.ts`

| Field         | Type     | Notes |
| ------------- | -------- | ----- |
| `id`          | `string` |       |
| `fullName`    | `string` |       |
| `email`       | `string` |       |
| `avatarColor` | `string` |       |

- A single simulated "current user" is provided by `UserService` for avatar/notification context.

## Notification — `notification.model.ts`

```ts
export type NotificationType =
  'application_accepted' | 'application_rejected' | 'application_pending';
```

| Field       | Type               | Notes                    |
| ----------- | ------------------ | ------------------------ |
| `id`        | `string`           |                          |
| `userId`    | `string`           | FK → User.id (recipient) |
| `type`      | `NotificationType` |                          |
| `message`   | `string`           | Spanish text             |
| `createdAt` | `string`           | ISO timestamp            |

- **Relationship**: emitted when an Application transitions to a terminal status.

## Entity relationship summary

```text
Event 1 ──< Team 1 ──< TeamMember >── 1 User
                │
                └──< Application >── 1 User
User 1 ──< Notification
```
