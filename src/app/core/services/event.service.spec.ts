import { firstValueFrom } from 'rxjs';
import { EventService } from './event.service';
import { MOCK_EVENTS } from '../mocks/events.mock';

describe('EventService (mock mode)', () => {
  let service: EventService;

  beforeEach(() => {
    service = new EventService();
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
