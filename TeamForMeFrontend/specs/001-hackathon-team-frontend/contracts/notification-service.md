# Contract: NotificationService

`src/app/core/services/notification.service.ts` — `@Injectable({ providedIn: 'root' })`

| Method                      | Signature                                                           | Mock behavior                                                                                                                     | Backend equivalent                          |
| --------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `getNotifications`          | `getNotifications(userId: string): Observable<NotificationModel[]>` | returns the in-memory notifications for the user; `delay(~200)`                                                                   | `GET {apiUrl}/users/{userId}/notifications` |
| `notifyApplicationResolved` | `notifyApplicationResolved(app: ApplicationModel): void`            | internal: pushes a `NotificationModel` (`type` from `app.status`, Spanish `message`) when an application reaches a terminal state | server-side event in production             |

**Relationship**: driven by `ApplicationService` state transitions (FR-023). Surfacing
notifications in the UI is optional for this phase; the contract exists so the future
backend swap is signature-stable.

**Consumers**: `ApplicationService` (internal), optionally the navbar.
