import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar';

describe('NavbarComponent', () => {
  it('renders the brand and an Eventos link', async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.brand')?.textContent).toContain('TeamForMe');
    const link = el.querySelector('nav a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Eventos');
    expect(link.getAttribute('href')).toBe('/eventos');
  });
});
