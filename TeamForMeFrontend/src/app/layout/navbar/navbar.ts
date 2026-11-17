import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Sticky, translucent top navigation. */
@Component({
  selector: 'tfm-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <a class="brand" routerLink="/eventos"> <span class="brand__mark">◆</span> TeamForMe </a>
      <nav aria-label="Navegación principal">
        <a routerLink="/eventos" routerLinkActive="is-active">Eventos</a>
      </nav>
    </header>
  `,
  styleUrl: './navbar.css',
})
export class NavbarComponent {}
