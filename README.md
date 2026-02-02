# Quantum Projects

Plataforma full-stack para gestion de proyectos con equipos, tareas y metricas.
Monorepo con backend (Express + TypeScript) y frontend (React + Vite).

## Caracteristicas (MVP)

- Autenticacion con cookies httpOnly.
- Equipos con roles (owner/admin/member).
- Proyectos por equipo con estados y archivado.
- Tareas por proyecto con asignacion y flujo de estado.
- Dashboard con metricas y resumenes.

## Estructura

```
app/
  backend/   # API principal (Clean Architecture)
  frontend/  # SPA (React + Vite)
```

## Stack

- Backend: Express, TypeScript, MongoDB.
- Frontend: React, Vite, TypeScript, TanStack Query, Zustand.
- Auth: cookies httpOnly (sin tokens en JS).

## Requisitos

- Node.js (version acorde a cada proyecto)
- Docker + Docker Compose (opcional)

## Configuracion rapida (Docker Compose)

1. Crea `.env` a partir de `.env-template` y completa variables.
2. Levanta todo el stack:

```bash
docker compose up --build
```

Servicios:
- API: `http://localhost:4000`
- Frontend: `http://localhost:5173`
- MongoDB: `mongodb://localhost:27017`
- Grafana: `http://localhost:3000`
- Loki: `http://localhost:3100`

## Desarrollo local (sin Docker)

Backend:

```bash
cd app/backend
npm install
npm run dev
```

Frontend:

```bash
cd app/frontend
npm install
npm run dev
```

## Documentacion (centralizada en /docs)

Backend:
- `docs/backend/PROJECT.md`
- `docs/backend/api-endpoints.md`
- `docs/backend/branching.md`
- `docs/backend/e2e-warnings.md`

Frontend:
- `docs/frontend/CONTEXT.md`
- `docs/frontend/CONTRIBUTING.md`
- `docs/frontend/api-endpoints.md`

Notas tecnicas:
- `docs/notes/PROJECT_STATUS_NOTE.md`
- `docs/notes/TASK_STATUS_NOTE.md`
- `docs/notes/BACKEND_GAPS.md`
