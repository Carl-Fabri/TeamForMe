# Contract: EventService

`src/app/core/services/event.service.ts` — `@Injectable({ providedIn: 'root' })`

Method signatures are backend-final: swapping mock for `HttpClient` changes only the method
body, never the signature (FR-022, SC-005).

| Method         | Signature                                                       | Mock behavior                                              | Backend equivalent         |
| -------------- | --------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------- |
| `getEvents`    | `getEvents(): Observable<EventModel[]>`                         | `of(MOCK_EVENTS).pipe(delay(~400))`                        | `GET {apiUrl}/events`      |
| `getEventById` | `getEventById(id: string): Observable<EventModel \| undefined>` | `of(MOCK_EVENTS.find(e => e.id === id)).pipe(delay(~300))` | `GET {apiUrl}/events/{id}` |

**Error/edge**: `getEventById` emits `undefined` for an unknown id (consumer shows "evento no
encontrado", spec edge case). A simulated failure path (`throwError`) MUST be exercisable so
views can render an error state (FR-021).

**Consumers**: `EventsListComponent` (US1), `EventDetailComponent` (US2).
