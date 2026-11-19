import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventModel } from '../models/event.model';
import { MOCK_EVENTS } from '../mocks/events.mock';

/** Simulated read latency, ms (FR-021). */
const READ_DELAY_MS = 380;

/**
 * Event catalogue access. Method signatures are backend-final (FR-022): with
 * `environment.useMocks` the data comes from the in-memory mocks; otherwise from the
 * backend through the gateway (`GET {apiUrl}/events`, served by MS.Events).
 *
 * @see specs/001-hackathon-team-frontend/contracts/event-service.md
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly useMocks = environment.useMocks;

  getEvents(): Observable<EventModel[]> {
    if (this.useMocks) {
      return of(MOCK_EVENTS.map((e) => ({ ...e }))).pipe(delay(READ_DELAY_MS));
    }
    return this.http.get<EventModel[]>(`${environment.apiUrl}/events`);
  }

  getEventById(id: string): Observable<EventModel | undefined> {
    if (this.useMocks) {
      const found = MOCK_EVENTS.find((e) => e.id === id);
      return of(found ? { ...found } : undefined).pipe(delay(READ_DELAY_MS));
    }
    // 404 means "evento no encontrado" (undefined), same contract as the mock.
    return this.http
      .get<EventModel>(`${environment.apiUrl}/events/${encodeURIComponent(id)}`)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          err.status === 404 ? of(undefined) : throwError(() => err),
        ),
      );
  }
}
