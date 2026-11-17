import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventModel } from '../models/event.model';
import { MOCK_EVENTS } from '../mocks/events.mock';

/** Simulated read latency, ms (FR-021). */
const READ_DELAY_MS = 380;

/**
 * Event catalogue access. Method signatures are backend-final (FR-022): when the API
 * exists, only the bodies change (mock -> HttpClient), not the contract.
 *
 * @see specs/001-hackathon-team-frontend/contracts/event-service.md
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly useMocks = environment.useMocks;

  getEvents(): Observable<EventModel[]> {
    if (this.useMocks) {
      return of(MOCK_EVENTS.map((e) => ({ ...e }))).pipe(delay(READ_DELAY_MS));
    }
    // return this.http.get<EventModel[]>(`${environment.apiUrl}/events`);
    throw new Error('HTTP backend not wired yet');
  }

  getEventById(id: string): Observable<EventModel | undefined> {
    if (this.useMocks) {
      const found = MOCK_EVENTS.find((e) => e.id === id);
      return of(found ? { ...found } : undefined).pipe(delay(READ_DELAY_MS));
    }
    // return this.http.get<EventModel>(`${environment.apiUrl}/events/${id}`);
    throw new Error('HTTP backend not wired yet');
  }
}
