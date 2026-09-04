/**
 * Development / default environment.
 *
 * `useMocks` is the single toggle that will flip the whole service layer from the
 * in-memory mock implementation to real `HttpClient` calls once the backend exists.
 * `apiUrl` is intentionally empty in this phase.
 */
export interface Environment {
  readonly production: boolean;
  readonly apiUrl: string;
  readonly useMocks: boolean;
}

export const environment: Environment = {
  production: false,
  apiUrl: '',
  useMocks: true,
};
