# Contract: ApplicationService

`src/app/core/services/application.service.ts` — `@Injectable({ providedIn: 'root' })`

Holds the in-memory application store and simulates asynchronous resolution (broker-like).

| Method               | Signature                                                                        | Mock behavior                                                                                                                                                                                                                                                               | Backend equivalent                                      |
| -------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `createApplication`  | `createApplication(input: CreateApplicationInput): Observable<ApplicationModel>` | build record: new `id`, `status: 'pending'`, `createdAt = now`; push to store; schedule one transition to `'accepted'` or `'rejected'` after `RESOLVE_DELAY_MS` (deterministic rule; seed at least one always-`rejected` team); emit the created record after `delay(~300)` | `POST {apiUrl}/applications`                            |
| `getApplicationById` | `getApplicationById(id: string): Observable<ApplicationModel \| undefined>`      | returns a stream: current record then every subsequent status change (backed by a per-application `BehaviorSubject` / store `Subject`); `undefined` if id unknown                                                                                                           | `GET {apiUrl}/applications/{id}` (+ future stream/poll) |

**State machine**: `pending → accepted` \| `pending → rejected`; terminal states never change
again (FR-017, FR-018, FR-023).

**Edge**: unknown id → stream emits `undefined` once; consumer shows "postulación no
encontrada" (FR-019).

**Consumers**: `TeamService.applyToTeam` (US3, delegation), `ApplicationStatusComponent` (US4).
