/** A member shown on a public team's avatar stack. */
export interface TeamMember {
  readonly userId: string;
  /** 1-3 character initials for the avatar. */
  readonly initials: string;
  /** CSS color (hex or token) used as the avatar fill. */
  readonly avatarColor: string;
}

/** Occupancy state derived from `filled / capacity` (see FR-007). */
export type OccupancyState = 'available' | 'almost-full' | 'full';

/**
 * A team within an event. Mirrors the future backend `MS_Teams` entity.
 * `members` is always `[]` when `isPrivate` is true (FR-009).
 */
export interface TeamModel {
  readonly id: string;
  readonly eventId: string;
  readonly name: string;
  /** Area / skill label, e.g. "Backend Cloud". */
  readonly tag: string;
  readonly capacity: number;
  readonly filled: number;
  readonly isPrivate: boolean;
  readonly members: readonly TeamMember[];
  /**
   * Mock-only flag: when true the simulated resolution of any application to this
   * team always ends in 'rejected' (FR-023). Not part of the real backend contract.
   */
  readonly alwaysRejects?: boolean;
}

/** Seats still open on a team. */
export function seatsLeft(team: Pick<TeamModel, 'capacity' | 'filled'>): number {
  return Math.max(0, team.capacity - team.filled);
}

/** Whether the team has reached capacity. */
export function isTeamFull(team: Pick<TeamModel, 'capacity' | 'filled'>): boolean {
  return team.filled >= team.capacity;
}

/** Occupancy bucket for the capacity ring color (FR-007). */
export function occupancyState(team: Pick<TeamModel, 'capacity' | 'filled'>): OccupancyState {
  const ratio = team.capacity <= 0 ? 1 : team.filled / team.capacity;
  if (ratio >= 1) {
    return 'full';
  }
  if (ratio >= 0.8) {
    return 'almost-full';
  }
  return 'available';
}
