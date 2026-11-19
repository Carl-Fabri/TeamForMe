import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import type { Map as LeafletMap } from 'leaflet';
import { EventModel } from '../../../core/models/event.model';
import { TeamModel, isTeamFull, seatsLeft } from '../../../core/models/team.model';
import { EventService } from '../../../core/services/event.service';
import { TeamService } from '../../../core/services/team.service';
import { OccupancyPipe } from '../../../shared/pipes/occupancy.pipe';

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';
export type TeamFilter = 'todos' | 'con-cupo' | 'llenos';

/** Avatars shown per public team before collapsing into "+N". */
const MAX_AVATARS = 4;

const DATE_FMT = new Intl.DateTimeFormat('es', { dateStyle: 'full', timeStyle: 'short' });

/**
 * Event detail (US2): map, aggregate capacity and the event's teams with an occupancy
 * filter. Data comes from EventService + TeamService (mocks in dev, gateway API in prod)
 * and is fetched in the browser only; the route is client-rendered (app.routes.server.ts).
 */
@Component({
  selector: 'tfm-event-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, OccupancyPipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailComponent implements OnDestroy {
  private readonly events = inject(EventService);
  private readonly teamsApi = inject(TeamService);
  private readonly injector = inject(Injector);
  private readonly eventId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  private readonly mapHost = viewChild<ElementRef<HTMLElement>>('map');
  private map?: LeafletMap;

  protected readonly state = signal<LoadState>('loading');
  protected readonly event = signal<EventModel | undefined>(undefined);
  protected readonly teams = signal<readonly TeamModel[]>([]);
  protected readonly filter = signal<TeamFilter>('todos');

  protected readonly filters: readonly { value: TeamFilter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'con-cupo', label: 'Con cupo' },
    { value: 'llenos', label: 'Llenos' },
  ];

  protected readonly visibleTeams = computed(() => {
    const f = this.filter();
    return this.teams().filter((t) =>
      f === 'todos' ? true : f === 'llenos' ? isTeamFull(t) : !isTeamFull(t),
    );
  });

  protected readonly totals = computed(() => {
    const list = this.teams();
    const filled = list.reduce((sum, t) => sum + t.filled, 0);
    const capacity = list.reduce((sum, t) => sum + t.capacity, 0);
    return { filled, capacity, percent: capacity ? Math.round((filled / capacity) * 100) : 0 };
  });

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.load();
    }
  }

  protected load(): void {
    this.state.set('loading');
    forkJoin({
      event: this.events.getEventById(this.eventId),
      teams: this.teamsApi.getTeamsByEvent(this.eventId),
    })
      .pipe(catchError(() => of(null)))
      .subscribe((result) => {
        if (result === null) {
          this.state.set('error');
          return;
        }
        if (!result.event) {
          this.state.set('not-found');
          return;
        }
        this.event.set(result.event);
        this.teams.set(result.teams);
        this.state.set('ready');
        // The map container exists only after this render.
        afterNextRender(() => this.renderMap(), { injector: this.injector });
      });
  }

  protected setFilter(value: TeamFilter): void {
    this.filter.set(value);
  }

  protected formatDate(iso: string): string {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : DATE_FMT.format(d);
  }

  protected seatsLeft(team: TeamModel): number {
    return seatsLeft(team);
  }

  protected percent(team: TeamModel): number {
    return team.capacity ? Math.min(100, Math.round((team.filled / team.capacity) * 100)) : 100;
  }

  protected avatars(team: TeamModel) {
    return team.members.slice(0, MAX_AVATARS);
  }

  protected extraMembers(team: TeamModel): number {
    return Math.max(0, team.members.length - MAX_AVATARS);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  /** Leaflet is browser-only: loaded lazily, never during SSR (Constitution V). */
  private renderMap(): void {
    const coords = this.event()?.coords;
    const host = this.mapHost()?.nativeElement;
    if (!coords || !host || this.map) {
      return;
    }
    import('leaflet')
      .then((L) => {
        this.map = L.map(host, { scrollWheelZoom: false }).setView([coords.lat, coords.lng], 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(this.map);
        // circleMarker avoids Leaflet's default marker image assets.
        L.circleMarker([coords.lat, coords.lng], { radius: 9, color: '#7c5cff', fillOpacity: 0.8 })
          .addTo(this.map)
          .bindTooltip(this.event()?.location ?? '');
      })
      .catch(() => {
        // Map is decorative: if Leaflet fails the rest of the page keeps working.
      });
  }
}
