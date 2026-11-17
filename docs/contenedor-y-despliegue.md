# Contenedor y despliegue del frontend

## Imagen Docker (`Dockerfile`)
Construcción en dos etapas:

| Etapa | Base | Qué hace |
|---|---|---|
| `build` | `node:22-alpine` | `npm ci` con todas las dependencias y `npm run build` (navegador + servidor SSR) |
| `final` | `node:22-alpine` | Solo dependencias de producción (`npm ci --omit=dev`) + `dist/`; usuario `node` (no root) |

Arranque: `node dist/TeamForMe/server/server.mjs`, escuchando en `PORT` (4000).
`.dockerignore` excluye `node_modules`, `dist`, `.angular`, `.git`, `specs` y `.specify` para que
el contexto de build sea pequeño.

```bash
docker build -t teamforme/frontend:local .
```
```bash
docker run --rm -p 4000:4000 teamforme/frontend:local
```
Verificado: la imagen compila y responde 200 en `/eventos` con el `<title>TeamForMe</title>`
renderizado en el servidor.

## Variables de entorno
| Variable | Valor | Uso |
|---|---|---|
| `PORT` | `4000` | Puerto del servidor Express |
| `NODE_ENV` | `production` | Fijado en la imagen |
| `NG_ALLOWED_HOSTS` | `frontend,localhost` (compose) · `frontend` (Azure) | Hosts permitidos por la validación de `Host` de Angular SSR |

## SSR detrás del gateway
El gateway nginx reenvía `/` al frontend sin reescribir la cabecera `Host`, así que la petición
llega con el nombre interno del servicio (`frontend` en compose, el FQDN interno en Azure).
Angular 21 valida ese `Host` contra `security.allowedHosts` (en `angular.json`, hoy vacío). Si
el host no está permitido, el servidor no hace SSR y la app se renderiza solo en el cliente.

`NG_ALLOWED_HOSTS` está configurado en `cloud/docker-compose.yml` y en `cloud/infra/modules/containerapps.bicep` del repositorio TeamForMeBackend,
pero no está confirmado que la versión instalada de Angular la lea. Si en los logs aparece una
advertencia de host no permitido, la solución definitiva es agregar los hosts en `angular.json`:
```json
"security": { "allowedHosts": ["frontend", "*.azurecontainerapps.io", "localhost"] }
```

## Ejecución en el entorno completo
- **Local:** forma parte de `cloud/docker-compose.yml` del repositorio TeamForMeBackend (toma este frontend desde `../../TeamForMeFrontend`) (límite de 0,5 CPU y 384 MB),
  accesible en http://localhost:8080 a través del gateway.
- **Azure Container Apps (hoy):** la app `teamforme-frontend` (Central US) es **pública**, con
  0,5 vCPU / 1 GiB y de 0 a 3 réplicas. Con 0 réplicas no consume crédito; la primera visita
  después de un rato sin tráfico tarda unos segundos (arranque en frío). En el diseño completo
  del backend, el frontend queda detrás del gateway.
- **Despliegue continuo:** el workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
  de este repositorio corre en cada push a `main` (salvo cambios solo en `docs/`, `specs/` o `*.md`):
  1. CI ([`ci.yml`](../.github/workflows/ci.yml)): `npm ci`, Vitest, build SSR e imagen Docker.
  2. Lee la imagen actual de `teamforme-frontend` (variable `FRONTEND_APP`) y publica la nueva en el
     **mismo** registro y repositorio, con el tag `yyyyMMddHHmm-<sha7>` (más `latest`).
  3. `az containerapp update --image …`, espera a que la revisión quede `Provisioned`/`Healthy` y
     comprueba que la URL responda 200. El resumen de la ejecución muestra la imagen anterior y la nueva.

  Variables necesarias en GitHub (Settings → Secrets and variables → Actions → Variables):
  `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`; opcionales `AZURE_RESOURCE_GROUP`
  (por defecto `rg-teamforme`) y `FRONTEND_APP` (por defecto `teamforme-frontend`). Entorno: `production`.

Guía de Azure: repositorio [TeamForMeBackend](https://github.com/Carl-Fabri/TeamForMeBackend), `cloud/microservices/docs/despliegue/GUIA-AZURE-STUDENTS.md`.
