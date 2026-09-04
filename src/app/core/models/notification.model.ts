export type NotificationType =
  | 'application_accepted'
  | 'application_rejected'
  | 'application_pending';

/**
 * An advisory message for a user about an application outcome.
 * Mirrors the future backend `MS_Notifications` entity.
 */
export interface NotificationModel {
  readonly id: string;
  readonly userId: string;
  readonly type: NotificationType;
  /** Spanish user-facing text. */
  readonly message: string;
  /** ISO 8601 timestamp. */
  readonly createdAt: string;
}
