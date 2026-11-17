import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';

describe('FooterComponent', () => {
  it('renders the wordmark and placeholder links', async () => {
    await TestBed.configureTestingModule({ imports: [FooterComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.foot__brand')?.textContent).toContain('TeamForMe');
    expect(el.querySelectorAll('nav a').length).toBe(2);
  });
});
