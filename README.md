# TeamForMe

Plataforma de eventos e ideas en búsqueda de grupo: descubrirlos, ver los grupos que se están formando y postularse a uno.

```text
TeamForMe/
├── TeamForMeFrontend/     Angular 21 SSR (participante)        → docs/ del frontend
├── TeamForMeBackend/      Plantilla gRPC original (.NET 10)    → docs/ de la plantilla
├── microservices/         5 microservicios .NET 10 + librería  → docs/ del backend y la nube
├── gateway/               API Gateway (nginx)
├── observability/         Prometheus (TSDB) + Grafana
├── k8s/ms-events/         Módulo MS.Events en Kubernetes (Kustomize)
├── infra/                 Infraestructura Azure (Bicep)
├── scripts/azure/         Despliegue, AKS y control de costos
└── docker-compose.yml     Entorno local completo
```

## Inicio rápido (local)
```bash
cp .env.example .env
```
```bash
docker compose up -d --build
```
App y API en http://localhost:8080 (`/api/events`), Prometheus en http://localhost:9090 y
Grafana en http://localhost:3000.

## Azure (Azure for Students)
```powershell
az login
```
```powershell
./scripts/azure/deploy.ps1 -ResourceGroup rg-teamforme -ResourceLocation centralus -UseAcrBuild
```

Guía completa: [microservices/docs/despliegue/GUIA-AZURE-STUDENTS.md](microservices/docs/despliegue/GUIA-AZURE-STUDENTS.md)

Algoritmos de infraestructura aplicados en el lanzamiento (balanceo, autoescalado, canary,
token bucket, circuit breaker): [microservices/docs/algoritmos/](microservices/docs/algoritmos/README.md)

## Documentación por solución
| Solución | Documentación |
|---|---|
| Frontend | [TeamForMeFrontend/docs/](TeamForMeFrontend/docs/README.md) |
| Backend de microservicios, nube y despliegue | [microservices/docs/](microservices/docs/README.md) |
| Plantilla gRPC | [TeamForMeBackend/docs/](TeamForMeBackend/docs/README.md) |
