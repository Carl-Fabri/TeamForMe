import { Environment } from './environment.model';

/**
 * Development / default environment.
 *
 * `useMocks` is the single toggle between the in-memory mocks and real `HttpClient` calls.
 * Development keeps the mocks so `ng serve` works without the backend. To develop against
 * the backend set `useMocks: false`, `apiUrl: '/api'` and run `ng serve` with a proxy to the
 * gateway (see docs/integracion-backend.md).
 */
export const environment: Environment = {
  production: false,
  apiUrl: '',
  useMocks: true,
};
