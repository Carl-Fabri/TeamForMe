export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

/**
 * A participant's request to join a team. Mirrors the future backend
 * `MS_Applications` entity. Starts as 'pending' and resolves once (FR-023).
 */
export interface ApplicationModel {
  readonly id: string;
  readonly teamId: string;
  readonly userId: string;
  readonly fullName: string;
  readonly email: string;
  /** Role / skill the applicant brings. */
  readonly role: string;
  readonly motivation: string;
  readonly status: ApplicationStatus;
  /** ISO 8601 timestamp. */
  readonly createdAt: string;
}

/**
 * Input accepted by `TeamService.applyToTeam` / `ApplicationService.createApplication`.
 * This is the backend-final request shape (FR-022).
 */
export interface CreateApplicationInput {
  readonly teamId: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: string;
  readonly motivation: string;
}
