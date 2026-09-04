import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Minimal footer: wordmark + placeholder secondary links (FR-029). */
@Component({
  selector: 'tfm-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="foot">
      <span class="foot__brand">TeamForMe</span>
      <nav aria-label="Enlaces secundarios">
        <a href="#">Acerca de</a>
        <a href="#">Contacto</a>
      </nav>
    </footer>
  `,
  styleUrl: './footer.css',
})
export class FooterComponent {}
