# Arquitectura del frontend

## Stack
| Pieza | Tecnología |
|---|---|
| Framework | Angular 21.2 (componentes standalone, signals, `inject()`, `OnPush`) |
| Lenguaje | TypeScript 5.9 con `strict` y `strictTemplates` |
| Renderizado | SSR con `@angular/ssr` + Express 5 e hidratación con *event replay* |
| Estilos | Tailwind CSS 4 + design tokens en `src/styles.css` (tema oscuro) |
| Mapa | Leaflet (solo en el navegador, protegido para SSR) |
| Estado asíncrono | RxJS 7.8 |
| Pruebas | Vitest + jsdom (`ng test`) |

## Estructura
```text
src/
├── app/
│   ├── core/
│   │   ├── models/       # interfaces = contratos del backend (event, team, application, user, notification)
│   │   ├── services/     # acceso a datos: mock hoy, HttpClient mañana (mismas firmas)
│   │   └── mocks/        # datos simulados en memoria
│   ├── shared/           # componentes presentacionales (button, ...) y pipes (occupancy)
│   ├── features/         # una carpeta por pantalla enrutada (lazy)
│   │   ├── events/events-list/
│   │   ├── organizador/  # placeholder
│   │   └── not-found/
│   ├── layout/           # navbar y footer
│   ├── app.routes.ts         # rutas del navegador (loadComponent)
│   ├── app.routes.server.ts  # modo de render por ruta (Prerender)
│   └── app.config*.ts        # providers de cliente y servidor
├── environments/         # apiUrl y useMocks
├── server.ts             # servidor Express de SSR (puerto PORT, 4000 por defecto)
└── styles.css
```

## Rutas
| Ruta | Pantalla | Estado |
|---|---|---|
| `/` | Redirige a `/eventos` | Implementada |
| `/eventos` | Lista de eventos e ideas en búsqueda de grupo | Implementada |
| `/eventos/:id` | Detalle con mapa, aforo y equipos | Pendiente (fase 4 del plan) |
| `/eventos/:eventId/equipos/:teamId/postular` | Modal de postulación | Pendiente |
| `/postulaciones/:id` | Estado de la postulación | Pendiente |
| `/organizador` | Placeholder | Implementada |
| `**` | No encontrado | Implementada |

Todas las pantallas se cargan de forma diferida (`loadComponent`), así que cada una es un
*chunk* separado y el bundle inicial se mantiene pequeño.

## Capa de servicios
Cada servicio expone métodos que devuelven `Observable<T>` con las **firmas finales del backend**.
El *flag* `environment.useMocks` decide si se responde con datos simulados (con latencia
artificial de ~300–400 ms) o, en el futuro, con `HttpClient`:

```ts
getEvents(): Observable<EventModel[]> {
  if (this.useMocks) {
    return of(MOCK_EVENTS.map((e) => ({ ...e }))).pipe(delay(READ_DELAY_MS));
  }
  // return this.http.get<EventModel[]>(`${environment.apiUrl}/events`);
}
```

| Servicio | Estado | Endpoint real (vía gateway) |
|---|---|---|
| `EventService` | Implementado (mock) | `GET /api/events`, `GET /api/events/{id}` |
| `TeamService` | Pendiente | `GET /api/events/{id}/teams`, `GET /api/teams/{id}`, `POST /api/teams/{id}/applications` |
| `ApplicationService` | Pendiente | `GET /api/applications/{id}` |
| `UserService` | Pendiente | `GET /api/users/me`, `GET /api/users/{id}` |
| `NotificationService` | Pendiente | `GET /api/users/{id}/notifications` |

Los contratos detallados están en [`specs/.../contracts/`](../specs/001-hackathon-team-frontend/contracts/).

## SSR e hidratación
- `server.ts` sirve los estáticos de `dist/TeamForMe/browser` y renderiza el resto con `AngularNodeAppEngine`.
- `app.routes.server.ts` usa `RenderMode.Prerender` para todas las rutas.
- Las APIs que solo existen en el navegador (Leaflet, `document`, `window`) se protegen con
  `isPlatformBrowser` / `afterNextRender`, y en el servidor se emite un placeholder del mismo tamaño
  para no causar saltos de diseño al hidratar.
- Angular 21 valida la cabecera `Host` en SSR (`security.allowedHosts` en `angular.json`, que hoy
  está vacío). Detrás de un proxy hay que permitir el nombre con el que llega la petición; ver
  [contenedor-y-despliegue.md](contenedor-y-despliegue.md#ssr-detrás-del-gateway).
