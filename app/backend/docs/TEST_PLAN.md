# Test Plan — New/Updated Endpoints

Plan de implementacion de pruebas para endpoints nuevos/actualizados.

## 1) Metrics (unit tests)
- `OverviewUseCase`: caso feliz + repos vacios.
- `ProjectMetricsUseCase`: conteo por proyecto + calculo de progreso.
- `TaskMetricsUseCase`: conteo por estado + overdue.
- `TeamMetricsUseCase`: membersCount + proyectos activos.

## 2) Me endpoints (e2e)
- `GET /me`: retorna perfil.
- `GET /me/projects`: lista (vacio + con data).
- `GET /me/tasks`: lista.
- `GET /me/teams`: lista.
- Unauthorized: 401 para cada endpoint.

## 3) Teams (e2e)
- `PATCH /teams/:id`: owner/admin ok, member fail.
- `DELETE /teams/:id`: owner ok, admin/member fail.
- `GET /teams/:id/members`: lista miembros.

## 4) Projects under team (e2e)
- `POST /teams/:id/projects`: crea proyecto.
- `GET /teams/:id/projects`: lista por team.

## 4.1) Project status toggles (unit + e2e)
- `PauseProjectUseCase`: alterna `active` <-> `paused`.
- `ArchiveProjectUseCase`: alterna `completed` <-> `archived`.

## 5) Tasks under project (e2e)
- `POST /projects/:projectId/tasks`: crea tarea.
- `GET /projects/:projectId/tasks`: lista tareas.

## 6) Task delete (unit + e2e)
- `DeleteTaskUseCase`: owner/admin ok, member fail.
- `DELETE /tasks/:taskId`: endpoint.

## 7) Task status transitions (unit)
- `TaskStatus.canTransition`: permite cambios entre todos los estados.
- `Task.changeStatus`: no falla al volver a estados previos.
- `ChangeTaskStatusUseCase`: actualiza status valido.

## 8) Cleanup de e2e desactualizados
- Remover/actualizar tests de `PATCH /projects/:id/resume` y `/unarchive`.
