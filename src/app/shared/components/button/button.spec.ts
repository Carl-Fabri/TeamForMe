import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button';

@Component({
  imports: [ButtonComponent],
  template: `
    <tfm-button [variant]="variant" [disabled]="disabled" (pressed)="count = count + 1">
      Enviar
    </tfm-button>
  `,
})
class HostComponent {
  variant: 'primary' | 'ghost' = 'primary';
  disabled = false;
  count = 0;
}

describe('ButtonComponent', () => {
  async function render() {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('projects content and applies the variant class', async () => {
    const fixture = await render();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Enviar');
    expect(btn.className).toContain('tfm-btn--primary');
  });

  it('emits pressed on click when enabled', async () => {
    const fixture = await render();
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(fixture.componentInstance.count).toBe(1);
  });

  it('is disabled and does not emit when disabled is true', async () => {
    const fixture = await render();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(fixture.componentInstance.count).toBe(0);
  });
});
