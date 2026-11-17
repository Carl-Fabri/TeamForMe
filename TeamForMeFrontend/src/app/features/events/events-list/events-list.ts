import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EventModel } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';

type LoadState = 'loading' | 'ready' | 'error';

const DATE_FMT = new Intl.DateTimeFormat('es', { dateStyle: 'long', timeStyle: 'short' });

@Component({
  selector: 'tfm-events-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsListComponent {
  private readonly events = inject(EventService);

  protected readonly state = signal<LoadState>('loading');
  protected readonly items = signal<readonly EventModel[]>([]);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.state.set('loading');
    this.events
      .getEvents()
      .pipe(catchError(() => of(null)))
      .subscribe((list) => {
        if (list === null) {
          this.state.set('error');
          return;
        }
        this.items.set(list);
        this.state.set('ready');
      });
  }

  protected formatDate(iso: string): string {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : DATE_FMT.format(d);
  }
}
