import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';
import { EventsListComponent } from './events-list';
import { EventService } from '../../../core/services/event.service';
import { EventModel } from '../../../core/models/event.model';

const SAMPLE: EventModel[] = [
  { id: 'a', name: 'Alpha Hack', date: '2026-09-01T10:00:00Z', location: 'Cali' },
  { id: 'b', name: 'Beta Hack', date: '2026-10-01T10:00:00Z', location: 'Remoto' },
];

function setup(getEvents: () => Observable<EventModel[]>) {
  TestBed.configureTestingModule({
    imports: [EventsListComponent],
    providers: [provideRouter([]), { provide: EventService, useValue: { getEvents } }],
  });
  const fixture = TestBed.createComponent(EventsListComponent);
  fixture.detectChanges();
  return fixture;
}

describe('EventsListComponent', () => {
  it('shows a loading status while events are pending', () => {
    const pending = new Subject<EventModel[]>();
    const fixture = setup(() => pending.asObservable());
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.status')?.textContent).toContain('Cargando');
  });

  it('renders one card per event once loaded', () => {
    const fixture = setup(() => of(SAMPLE));
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('.card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Alpha Hack');
    expect(el.querySelector('.card__link')?.getAttribute('href')).toBe('/eventos/a');
  });

  it('shows an explicit empty message when there are no events', () => {
    const fixture = setup(() => of([]));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.grid')).toBeNull();
    expect(el.querySelector('.status')?.textContent).toContain('No hay eventos');
  });

  it('shows an error state with a retry control when loading fails', () => {
    const fixture = setup(() => throwError(() => new Error('boom')));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.status--error')).toBeTruthy();
    expect(el.querySelector('.status--error button')?.textContent).toContain('Reintentar');
  });
});
