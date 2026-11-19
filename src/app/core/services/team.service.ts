import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TeamModel } from '../models/team.model';
import { MOCK_TEAMS } from '../mocks/teams.mock';

/** Simulated read latency, ms (FR-021). */
const READ_DELAY_MS = 380;

/**
 * Teams of an event. Mock data in development; in production the backend through the
 * gateway (`GET {apiUrl}/events/{eventId}/teams`, served by MS.Teams). The backend already
 * returns private teams with `members: []` (FR-009); the mock applies the same rule.
 *
 * @see specs/001-hackathon-team-frontend/contracts/team-service.md
 */
@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly useMocks = environment.useMocks;

  getTeamsByEvent(eventId: string): Observable<TeamModel[]> {
    if (this.useMocks) {
      const teams = MOCK_TEAMS.filter((t) => t.eventId === eventId).map(toPublicTeam);
      return of(teams).pipe(delay(READ_DELAY_MS));
    }
    return this.http.get<TeamModel[]>(
      `${environment.apiUrl}/events/${encodeURIComponent(eventId)}/teams`,
    );
  }

  getTeamById(teamId: string): Observable<TeamModel | undefined> {
    if (this.useMocks) {
      const found = MOCK_TEAMS.find((t) => t.id === teamId);
      return of(found ? toPublicTeam(found) : undefined).pipe(delay(READ_DELAY_MS));
    }
    return this.http
      .get<TeamModel>(`${environment.apiUrl}/teams/${encodeURIComponent(teamId)}`)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          err.status === 404 ? of(undefined) : throwError(() => err),
        ),
      );
  }
}

/** Copy without mock-only fields; private teams never expose their members (FR-009). */
function toPublicTeam(team: TeamModel): TeamModel {
  const { alwaysRejects: _ignored, ...rest } = team;
  return { ...rest, members: team.isPrivate ? [] : [...team.members] };
}
