import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';
import { EventDetailComponent } from './event-detail';
import { EventService } from '../../../core/services/event.service';
import { TeamService } from '../../../core/services/team.service';
import { EventModel } from '../../../core/models/event.model';
import { TeamModel } from '../../../core/models/team.model';

const EVENT: EventModel = {
  id: 'e1',
  name: 'Ideas Abiertas',
  date: '2026-09-01T10:00:00Z',
  location: 'Evento remoto',
  description: 'Proyectos en búsqueda de grupo.',
};

const TEAMS: TeamModel[] = [
  {
    id: 't-open',
    eventId: 'e1',
    name: 'Open',
    tag: 'Backend',
    capacity: 5,
    filled: 2,
    isPrivate: false,
    members: [
      { userId: 'u1', initials: 'AA', avatarColor: '#7C5CFF' },
      { userId: 'u2', initials: 'BB', avatarColor: '#2DDDA6' },
    ],
  },
  {
    id: 't-full',
    eventId: 'e1',
    name: 'Full',
    tag: 'UX',
    capacity: 3,
    filled: 3,
    isPrivate: false,
    members: [],
  },
  {
    id: 't-priv',
    eventId: 'e1',
    name: 'Secret',
    tag: 'Producto',
    capacity: 4,
    filled: 1,
    isPrivate: true,
    members: [],
  },
];

function setup(
  getEventById: () => Observable<EventModel | undefined>,
  getTeamsByEvent: () => Observable<TeamModel[]> = () => of(TEAMS),
) {
  TestBed.configureTestingModule({
    imports: [EventDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ id: 'e1' }) } },
      },
      { provide: EventService, useValue: { getEventById } },
      { provide: TeamService, useValue: { getTeamsByEvent } },
    ],
  });
  const fixture = TestBed.createComponent(EventDetailComponent);
  fixture.detectChanges();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('EventDetailComponent', () => {
  it('shows a loading status while data is pending', () => {
    const { el } = setup(() => new Subject<EventModel>().asObservable());
    expect(el.querySelector('.status')?.textContent).toContain('Cargando');
  });

  it('renders the event header, aggregate capacity and one card per team', () => {
    const { el } = setup(() => of(EVENT));
    expect(el.querySelector('h1')?.textContent).toContain('Ideas Abiertas');
    expect(el.querySelector('.capacity__value')?.textContent?.replace(/\s+/g, ' ')).toContain(
      '6 / 12',
    );
    expect(el.querySelectorAll('.team').length).toBe(3);
  });

  it('never shows members of a private team', () => {
    const { el } = setup(() => of(EVENT));
    const priv = Array.from(el.querySelectorAll('.team')).find((t) =>
      t.textContent?.includes('Secret'),
    )!;
    expect(priv.querySelector('.avatars')).toBeNull();
    expect(priv.textContent).toContain('equipo privado');
  });

  it('filters teams by occupancy', () => {
    const { fixture, el } = setup(() => of(EVENT));
    const full = Array.from(el.querySelectorAll<HTMLButtonElement>('.filter')).find((b) =>
      b.textContent?.includes('Llenos'),
    )!;
    full.click();
    fixture.detectChanges();
    const names = Array.from(el.querySelectorAll('.team__name')).map((n) => n.textContent?.trim());
    expect(names).toEqual(['Full']);
    expect(full.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows "evento no encontrado" for an unknown event', () => {
    const { el } = setup(() => of(undefined));
    expect(el.textContent).toContain('Evento no encontrado');
  });

  it('shows an error state with retry when loading fails', () => {
    const { el } = setup(() => throwError(() => new Error('boom')));
    expect(el.querySelector('.status--error button')?.textContent).toContain('Reintentar');
  });

  it('hides the map when the event has no coordinates', () => {
    const { el } = setup(() => of(EVENT));
    expect(el.querySelector('.map')).toBeNull();
  });
});
