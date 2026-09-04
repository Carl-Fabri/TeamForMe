# Contract: UserService

`src/app/core/services/user.service.ts` — `@Injectable({ providedIn: 'root' })`

| Method | Signature | Mock behavior | Backend equivalent |
|--------|-----------|---------------|--------------------|
| `getCurrentUser` | `getCurrentUser(): Observable<UserModel>` | `of(MOCK_CURRENT_USER).pipe(delay(~200))` | `GET {apiUrl}/users/me` |
| `getUserById` | `getUserById(id: string): Observable<UserModel \| undefined>` | filtered lookup from `MOCK_USERS` + `delay(~200)` | `GET {apiUrl}/users/{id}` |

**Purpose**: supplies the simulated current participant (id, avatar color) used for
application `userId` and notification context. No authentication in this phase (Assumptions).

**Consumers**: `TeamJoinFormComponent` (US3), `ApplicationStatusComponent` (US4), navbar.
