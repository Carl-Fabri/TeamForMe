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

`NG_ALLOWED_HOSTS` está configurado en `docker-compose.yml` y en `infra/modules/containerapps.bicep`,
pero no está confirmado que la versión instalada de Angular la lea. Si en los logs aparece una
advertencia de host no permitido, la solución definitiva es agregar los hosts en `angular.json`:
```json
"security": { "allowedHosts": ["frontend", "*.azurecontainerapps.io", "localhost"] }
```

## Ejecución en el entorno completo
- **Local:** forma parte de `docker-compose.yml` en la raíz `TeamForMe/` (límite de 0,5 CPU y 384 MB),
  accesible en http://localhost:8080 a través del gateway.
- **Azure Container Apps:** la app `frontend` es **interna** (solo el gateway la ve), con
  0,5 vCPU / 1 GiB, de 0 a 3 réplicas y escalado HTTP de 30 peticiones concurrentes por réplica.
  Con 0 réplicas no consume crédito; la primera visita después de un rato sin tráfico tarda unos
  segundos (arranque en frío).
- La imagen se publica en ACR como `teamforme/frontend:<tag>` con `scripts/azure/deploy.ps1`.

Guía paso a paso: [`microservices/docs/despliegue/GUIA-AZURE-STUDENTS.md`](../../microservices/docs/despliegue/GUIA-AZURE-STUDENTS.md).
