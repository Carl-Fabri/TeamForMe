import { Environment } from './environment.model';

/**
 * Production environment. Swapped in via `fileReplacements` in angular.json.
 * `useMocks` stays true until the backend is connected; `apiUrl` will be set then.
 */
export const environment: Environment = {
  production: true,
  apiUrl: '',
  useMocks: true,
};
