# Quantum Projects

Monorepo de una app de gestion de proyectos con backend (Express + TypeScript) y
frontend (React + TypeScript). El objetivo actual es completar el MVP.

## Estructura

```
app/
  backend/   # API principal (Clean Architecture)
  frontend/  # SPA (React + Vite)
```

## Stack y principios

- Backend: Express 5, TypeScript, MongoDB, arquitectura limpia.
- Frontend: React 19, Vite, TypeScript, TanStack Query, Zustand.
- Autenticacion por cookies httpOnly (no tokens en JS).
- El backend es la fuente de verdad de reglas de negocio.

## Requisitos

- Node.js (version acorde a cada proyecto)
- Docker + Docker Compose (opcional pero recomendado)

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

## Endpoints base (API)

- Auth: `/auth/*`
- Teams: `/teams/*`
- Users: `/users/me/*`
- Projects y Tasks: disponibles segun los modulos del dominio

## Docs utiles

- Backend: `app/backend/docs/PROJECT.md`
- Frontend: `app/frontend/docs/CONTEXT.md`
- API endpoints: `app/backend/docs/api-endpoints.md`, `app/frontend/docs/api-endpoints.md`

