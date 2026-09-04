import { EventModel } from '../models/event.model';

/** Simulated event catalogue. One entry deliberately has no `coords` (FR-004 edge case). */
export const MOCK_EVENTS: readonly EventModel[] = [
  {
    id: 'evt-hackcloud-2026',
    name: 'HackCloud 2026',
    date: '2026-09-19T09:00:00-05:00',
    location: 'Bogotá, Colombia',
    coords: { lat: 4.6533, lng: -74.0836 },
    description:
      'Cuarenta y ocho horas construyendo soluciones cloud-native con equipos multidisciplinarios.',
    themeGradient: 'radial-gradient(circle at 20% 0%, var(--violet-soft), transparent 60%)',
  },
  {
    id: 'evt-datathon-med',
    name: 'Datathon Medellín',
    date: '2026-10-03T08:30:00-05:00',
    location: 'Medellín, Colombia',
    coords: { lat: 6.2447, lng: -75.5748 },
    description: 'Reto de datos abiertos para movilidad urbana.',
  },
  {
    id: 'evt-ux-online',
    name: 'UX Sprint Online',
    date: '2026-11-14T13:00:00Z',
    location: 'Evento remoto',
    description: 'Sprint de diseño de producto completamente en línea.',
  },
];
