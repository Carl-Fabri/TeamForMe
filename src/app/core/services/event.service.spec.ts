import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { EventService } from './event.service';
import { MOCK_EVENTS } from '../mocks/events.mock';

function setup(): EventService {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  return TestBed.inject(EventService);
}

describe('EventService (mock mode)', () => {
  let service: EventService;

  beforeEach(() => {
    service = setup();
  });

  it('getEvents emits the full catalogue', async () => {
    const result = await firstValueFrom(service.getEvents());
    expect(result.length).toBe(MOCK_EVENTS.length);
    expect(result[0].id).toBe(MOCK_EVENTS[0].id);
  });

  it('getEvents emits copies, not the shared mock references', async () => {
    const result = await firstValueFrom(service.getEvents());
    expect(result[0]).not.toBe(MOCK_EVENTS[0]);
    expect(result[0]).toEqual(MOCK_EVENTS[0]);
  });

  it('getEventById returns the matching event', async () => {
    const result = await firstValueFrom(service.getEventById(MOCK_EVENTS[1].id));
    expect(result?.id).toBe(MOCK_EVENTS[1].id);
  });

  it('getEventById emits undefined for an unknown id', async () => {
    const result = await firstValueFrom(service.getEventById('does-not-exist'));
    expect(result).toBeUndefined();
  });
});

describe('EventService (backend mode)', () => {
  let service: EventService;
  let http: HttpTestingController;

  beforeEach(() => {
    service = setup();
    // Same instance, switched to the HttpClient branch (production uses useMocks: false).
    (service as unknown as { useMocks: boolean }).useMocks = false;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getEvents calls GET {apiUrl}/events', async () => {
    const result = firstValueFrom(service.getEvents());
    http.expectOne((req) => req.method === 'GET' && req.url.endsWith('/events')).flush(MOCK_EVENTS);
    expect((await result).length).toBe(MOCK_EVENTS.length);
  });

  it('getEventById maps a 404 to undefined', async () => {
    const result = firstValueFrom(service.getEventById('nope'));
    http.expectOne((req) => req.url.endsWith('/events/nope')).flush(null, { status: 404, statusText: 'Not Found' });
    expect(await result).toBeUndefined();
  });

  it('getEventById propagates other errors', async () => {
    const result = firstValueFrom(service.getEventById('x'));
    http.expectOne((req) => req.url.endsWith('/events/x')).flush(null, { status: 500, statusText: 'Error' });
    await expect(result).rejects.toBeTruthy();
  });
});
