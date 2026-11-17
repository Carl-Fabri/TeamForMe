/** A participant. Mirrors the future backend `MS_Users` entity. */
export interface UserModel {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  /** CSS color used as the avatar fill. */
  readonly avatarColor: string;
}
