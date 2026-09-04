import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Out of scope this phase (FR-028) — placeholder route only. */
@Component({
  selector: 'tfm-organizador-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="empty">
      <h1>Panel del organizador</h1>
      <p>Esta sección estará disponible en una fase posterior.</p>
    </section>
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
    }
  `,
})
export class OrganizadorPlaceholderComponent {}
