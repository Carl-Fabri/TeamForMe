# Integración con el backend

El backend son 5 microservicios .NET detrás de un API Gateway nginx
(ver [`microservices/docs`](../../microservices/docs/README.md)). El gateway publica la app y la
API en el **mismo origen**: `/` es el frontend y `/api/*` los microservicios. Así no hace falta CORS
ni configurar URLs distintas por entorno.

## Estado actual
El frontend sigue con `useMocks: true`. Los modelos JSON del backend (en camelCase) son idénticos
a las interfaces de `src/app/core/models/`, de modo que el cambio no toca componentes ni plantillas.

## Pasos para conectar
1. **Registrar `HttpClient`** en `src/app/app.config.ts`, con `fetch` para que funcione en SSR:
   ```ts
   import { provideHttpClient, withFetch } from '@angular/common/http';
   // providers: [..., provideHttpClient(withFetch())]
   ```
2. **Configurar el entorno** (`environment.ts` y `environment.prod.ts`):
   ```ts
   export const environment: Environment = { production: true, apiUrl: '/api', useMocks: false };
   ```
3. **Implementar el cuerpo HTTP** de cada servicio, sin cambiar su firma:
   ```ts
   private readonly http = inject(HttpClient);

   getEventById(id: string): Observable<EventModel | undefined> {
     return this.http.get<EventModel>(`${environment.apiUrl}/events/${id}`).pipe(
       catchError((e: HttpErrorResponse) => (e.status === 404 ? of(undefined) : throwError(() => e))),
     );
   }
   ```
4. **Traducir los errores del backend** a los tipos que ya esperan los componentes:

   | Respuesta del backend | Tipo en el frontend |
   |---|---|
   | `404` en `GET /events/{id}`, `/teams/{id}`, `/applications/{id}` | `undefined` (pantalla "no encontrado") |
   | `409 {"error":"team_full"}` en `POST .../applications` | `TeamFullError(teamId)` |
   | `400` (`ValidationProblem`, con `errors.email`, etc.) | Errores de formulario por campo |
   | `5xx` / red | Estado de error de la vista |

5. **Estado de la postulación:** el backend no empuja cambios. `getApplicationById` puede hacer
   *polling* (`timer(0, 2000)` + `switchMap`) y detenerse con `takeWhile(a => a.status === 'pending', true)`
   cuando llega a `accepted` o `rejected`.

6. **SSR:** en el servidor una URL relativa (`/api/...`) no tiene origen. Hay dos opciones: un
   interceptor que anteponga el origen de la petición entrante, o hacer las peticiones de datos
   solo en el navegador. Para listas públicas como `/eventos` conviene la primera, porque el HTML
   llega ya con datos.

## Probar contra el backend local
Con el stack levantado (`docker compose up -d` en la raíz `TeamForMe/`):
```bash
curl http://localhost:8080/api/events
```
Para desarrollar con `ng serve` contra esa API se puede crear `proxy.conf.json`:
```json
{ "/api": { "target": "http://localhost:8080", "changeOrigin": true } }
```
y arrancar con `ng serve --proxy-config proxy.conf.json`. Cambia el puerto si en tu `.env`
definiste otro `GATEWAY_PORT`.
