import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonType = 'button' | 'submit';

/**
 * Shared action button. Presentational only — emits `pressed` and exposes a native
 * `type` for use inside forms. No routing or side effects here.
 */
@Component({
  selector: 'tfm-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      [class]="classes()"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './button.css',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);

  readonly pressed = output<void>();

  protected readonly classes = computed(() => `tfm-btn tfm-btn--${this.variant()}`);
}
