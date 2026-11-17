import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button';

@Component({
  imports: [ButtonComponent],
  template: `
    <tfm-button [variant]="variant()" [disabled]="disabled()" (pressed)="count.set(count() + 1)">
      Enviar
    </tfm-button>
  `,
})
class HostComponent {
  readonly variant = signal<'primary' | 'ghost'>('primary');
  readonly disabled = signal(false);
  readonly count = signal(0);
}

async function render(configure?: (host: HostComponent) => void) {
  await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  const fixture = TestBed.createComponent(HostComponent);
  configure?.(fixture.componentInstance);
  fixture.detectChanges();
  return fixture;
}

describe('ButtonComponent', () => {
  it('projects content and applies the variant class', async () => {
    const fixture = await render();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Enviar');
    expect(btn.className).toContain('tfm-btn--primary');
  });

  it('emits pressed on click when enabled', async () => {
    const fixture = await render();
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(fixture.componentInstance.count()).toBe(1);
  });

  it('is disabled and does not emit when disabled is true', async () => {
    const fixture = await render((host) => host.disabled.set(true));
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(fixture.componentInstance.count()).toBe(0);
  });
});
