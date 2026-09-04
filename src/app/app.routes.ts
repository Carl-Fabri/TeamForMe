import { Routes } from '@angular/router';

/**
 * Feature routes are lazy-loaded via `loadComponent` (Constitution Principle V).
 *
 * MVP increment (Phases 1-3) wires the events list, the organizador placeholder and
 * the not-found route. `eventos/:id`, `.../postular` and `postulaciones/:id` are added
 * in Phases 4-6 as their components land.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'eventos' },
  {
    path: 'eventos',
    loadComponent: () =>
      import('./features/events/events-list/events-list').then((m) => m.EventsListComponent),
  },
  {
    path: 'organizador',
    loadComponent: () =>
      import('./features/organizador/organizador-placeholder').then(
        (m) => m.OrganizadorPlaceholderComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
