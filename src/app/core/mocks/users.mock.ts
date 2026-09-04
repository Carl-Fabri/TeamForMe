import { UserModel } from '../models/user.model';

export const MOCK_USERS: readonly UserModel[] = [
  { id: 'u-1', fullName: 'Ana Participante', email: 'ana@example.com', avatarColor: '#7C5CFF' },
  { id: 'u-2', fullName: 'Mateo López', email: 'mateo@example.com', avatarColor: '#2DDDA6' },
  { id: 'u-3', fullName: 'Julia Ramírez', email: 'julia@example.com', avatarColor: '#F5B14C' },
];

/** The simulated "current participant" used where identity is needed (no auth this phase). */
export const MOCK_CURRENT_USER: UserModel = MOCK_USERS[0];
