# Documentación · TeamForMeFrontend

Web del participante de TeamForMe: descubrir hackathons, ver equipos y postularse.

| Documento | Contenido |
|---|---|
| [arquitectura.md](arquitectura.md) | Stack, estructura de carpetas, rutas, capa de servicios y SSR |
| [integracion-backend.md](integracion-backend.md) | Cómo pasar de los datos simulados (mocks) a la API real a través del gateway |
| [contenedor-y-despliegue.md](contenedor-y-despliegue.md) | Imagen Docker, ejecución local y en Azure Container Apps |

Documentación relacionada:
- Especificación funcional, plan y contratos: [`specs/001-hackathon-team-frontend/`](../specs/001-hackathon-team-frontend/)
- Backend, microservicios, temas cloud y guía de despliegue en Azure: [`microservices/docs/`](../../microservices/docs/README.md)

## Inicio rápido
```bash
npm install
```
```bash
npm start
```
La app queda en http://localhost:4200. Para el build y las pruebas: `npm run build` y `npm test` (Vitest).
