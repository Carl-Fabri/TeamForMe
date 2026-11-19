import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TeamService } from './team.service';
import { MOCK_TEAMS } from '../mocks/teams.mock';

function setup(): TeamService {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  return TestBed.inject(TeamService);
}

describe('TeamService (mock mode)', () => {
  let service: TeamService;

  beforeEach(() => {
    service = setup();
  });

  it('getTeamsByEvent returns only the teams of that event', async () => {
    const eventId = MOCK_TEAMS[0].eventId;
    const result = await firstValueFrom(service.getTeamsByEvent(eventId));
    expect(result.length).toBe(MOCK_TEAMS.filter((t) => t.eventId === eventId).length);
    expect(result.every((t) => t.eventId === eventId)).toBe(true);
  });

  it('private teams never expose members', async () => {
    const privateTeam = MOCK_TEAMS.find((t) => t.isPrivate)!;
    const result = await firstValueFrom(service.getTeamsByEvent(privateTeam.eventId));
    expect(result.find((t) => t.id === privateTeam.id)?.members).toEqual([]);
  });

  it('does not leak the mock-only alwaysRejects flag', async () => {
    const result = await firstValueFrom(service.getTeamsByEvent(MOCK_TEAMS[0].eventId));
    expect(result.some((t) => 'alwaysRejects' in t)).toBe(false);
  });

  it('getTeamById emits undefined for an unknown id', async () => {
    expect(await firstValueFrom(service.getTeamById('nope'))).toBeUndefined();
  });
});

describe('TeamService (backend mode)', () => {
  let service: TeamService;
  let http: HttpTestingController;

  beforeEach(() => {
    service = setup();
    (service as unknown as { useMocks: boolean }).useMocks = false;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getTeamsByEvent calls GET {apiUrl}/events/{id}/teams', async () => {
    const result = firstValueFrom(service.getTeamsByEvent('evt-1'));
    http
      .expectOne((req) => req.method === 'GET' && req.url.endsWith('/events/evt-1/teams'))
      .flush([]);
    expect(await result).toEqual([]);
  });

  it('getTeamById maps a 404 to undefined', async () => {
    const result = firstValueFrom(service.getTeamById('x'));
    http
      .expectOne((req) => req.url.endsWith('/teams/x'))
      .flush(null, { status: 404, statusText: 'Not Found' });
    expect(await result).toBeUndefined();
  });
});
