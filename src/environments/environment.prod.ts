import { Environment } from './environment.model';

/**
 * Production environment. Swapped in via `fileReplacements` in angular.json.
 *
 * Real backend: the API Gateway (repository TeamForMeBackend) serves this app on `/` and the
 * microservices on `/api/*` under the same origin, so `apiUrl` is relative. Open the app
 * through the gateway URL; on the bare frontend URL `/api` does not exist.
 */
export const environment: Environment = {
  production: true,
  apiUrl: '/api',
  useMocks: false,
};
