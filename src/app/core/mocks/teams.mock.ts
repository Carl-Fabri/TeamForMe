import { TeamModel } from '../models/team.model';

/**
 * Simulated teams. Includes: a public team with seats, a full team, a private team,
 * and one seeded `alwaysRejects` team so the rejection path is demoable (FR-023).
 */
export const MOCK_TEAMS: readonly TeamModel[] = [
  {
    id: 'team-cloud-cats',
    eventId: 'evt-hackcloud-2026',
    name: 'Cloud Cats',
    tag: 'Backend Cloud',
    capacity: 5,
    filled: 3,
    isPrivate: false,
    members: [
      { userId: 'u-2', initials: 'ML', avatarColor: '#7C5CFF' },
      { userId: 'u-3', initials: 'JR', avatarColor: '#2DDDA6' },
      { userId: 'u-4', initials: 'AC', avatarColor: '#F5B14C' },
    ],
  },
  {
    id: 'team-pixel-forge',
    eventId: 'evt-hackcloud-2026',
    name: 'Pixel Forge',
    tag: 'Diseño UX/UI',
    capacity: 4,
    filled: 4,
    isPrivate: false,
    members: [
      { userId: 'u-5', initials: 'SD', avatarColor: '#FF5D72' },
      { userId: 'u-6', initials: 'KP', avatarColor: '#7C5CFF' },
      { userId: 'u-7', initials: 'BN', avatarColor: '#2DDDA6' },
      { userId: 'u-8', initials: 'TQ', avatarColor: '#F5B14C' },
    ],
  },
  {
    id: 'team-stealth',
    eventId: 'evt-hackcloud-2026',
    name: 'Stealth Startup',
    tag: 'Producto',
    capacity: 6,
    filled: 2,
    isPrivate: true,
    members: [],
  },
  {
    id: 'team-hard-pass',
    eventId: 'evt-hackcloud-2026',
    name: 'Hard Pass',
    tag: 'Machine Learning',
    capacity: 5,
    filled: 1,
    isPrivate: false,
    members: [{ userId: 'u-9', initials: 'RV', avatarColor: '#5B3FE0' }],
    alwaysRejects: true,
  },
  {
    id: 'team-open-data',
    eventId: 'evt-datathon-med',
    name: 'Open Data Collective',
    tag: 'Data Engineering',
    capacity: 5,
    filled: 2,
    isPrivate: false,
    members: [
      { userId: 'u-10', initials: 'FG', avatarColor: '#2DDDA6' },
      { userId: 'u-11', initials: 'LM', avatarColor: '#F5B14C' },
    ],
  },
];
