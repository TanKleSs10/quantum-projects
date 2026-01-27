# MVP Gaps — Quantum Projects

Checklist de funcionalidades pendientes para completar un MVP funcional.

## Teams

- [ ] Invitar miembros (`POST /teams/:id/members`)
- [ ] Remover miembros / salir del team (`DELETE /teams/:id/members/:userId`)
- [ ] Promover a admin (`PATCH /teams/:id/members/:userId/promote`)
- [ ] Degradar a member (`PATCH /teams/:id/members/:userId/demote`)

## Tasks

- [ ] Editar tarea (`PATCH /tasks/:taskId`)
- [ ] Reasignar tarea (`PATCH /tasks/:taskId/assign`)
- [ ] Filtros en listado (`GET /projects/:projectId/tasks` con status/priority/assigneeId)

## Auth

- [ ] Alinear endpoint de reenvio de verificacion (`POST /auth/resend-verification`)

## Projects

- [ ] Listado global de proyectos del usuario (endpoint pendiente)

## Dashboard

- [ ] Conectar metricas y listas a API real
- [ ] CTAs principales conectadas (crear proyecto / tarea)

## UX Base

- [ ] Estados vacios y errores consistentes en listados
- [ ] Manejo claro de sesion expirada en rutas privadas
