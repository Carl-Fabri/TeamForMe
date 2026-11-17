/**
 * Shape of the environment config. Kept in its own file so both `environment.ts`
 * and `environment.prod.ts` can import it without the production `fileReplacements`
 * swap breaking the type reference.
 */
export interface Environment {
  readonly production: boolean;
  readonly apiUrl: string;
  readonly useMocks: boolean;
}
