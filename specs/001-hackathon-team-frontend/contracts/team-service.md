# Contract: TeamService

`src/app/core/services/team.service.ts` — `@Injectable({ providedIn: 'root' })`

| Method | Signature | Mock behavior | Backend equivalent |
|--------|-----------|---------------|--------------------|
| `getTeamsByEvent` | `getTeamsByEvent(eventId: string): Observable<TeamModel[]>` | `of(MOCK_TEAMS.filter(t => t.eventId === eventId)).pipe(delay(~400))`; private teams returned with `members: []` | `GET {apiUrl}/events/{eventId}/teams` |
| `getTeamById` | `getTeamById(teamId: string): Observable<TeamModel \| undefined>` | filtered lookup + `delay(~300)` | `GET {apiUrl}/teams/{teamId}` |
| `applyToTeam` | `applyToTeam(input: CreateApplicationInput): Observable<ApplicationModel>` | validates capacity against the mock team store; if `filled >= capacity` → `throwError(() => new TeamFullError(teamId))`; else increments `filled`, delegates record creation to `ApplicationService`, returns the created `ApplicationModel` (`status: 'pending'`) after `delay(~400)` | `POST {apiUrl}/teams/{teamId}/applications` |

```ts
export interface CreateApplicationInput {
  teamId: string;
  fullName: string;
  email: string;
  role: string;
  motivation: string;
}
export class TeamFullError extends Error { constructor(public readonly teamId: string) { super('Equipo lleno'); } }
```

**Rules**: `filled` MUST never exceed `capacity` (FR-014, SC-009). Filtering by occupancy
(`todos` / `con cupo` / `llenos`, FR-010) is a pure UI concern over the returned list, not a
service method.

**Consumers**: `EventDetailComponent` (US2), `TeamCardComponent` (US2), `TeamJoinFormComponent` (US3).
