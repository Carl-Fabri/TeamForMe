import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tfm-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="empty">
      <h1>Página no encontrada</h1>
      <p>La ruta que buscas no existe.</p>
      <a routerLink="/eventos">Volver a eventos</a>
    </section>
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 4rem 1rem;
    }
    .empty a {
      color: var(--violet);
    }
  `,
})
export class NotFoundComponent {}
