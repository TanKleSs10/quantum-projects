# Quantum Projects Core API - Endpoints y Schemas

Documento generado a partir de las rutas y DTOs actuales en el codigo.

## Base URL

- Base: `/api/v1`
- Ejemplo de host local: `http://localhost:3000/api/v1`

## Autenticacion

- Se usa `Authorization: Bearer <access_token>` para endpoints protegidos.
- El `refresh_token` se entrega como cookie `refresh_token` (httpOnly).
- Nota: Los endpoints bajo `/me`, `/users`, `/teams`, `/projects`, `/tasks` y `/metrics` requieren auth.

## Formato de respuesta comun

- Exitoso:
  - `{ "success": true, "data": <payload>, "message"?: string, "token"?: string }`
- Error:
  - `{ "success": false, "message": string, "errors"?: any, "code"?: string }`

## Schemas base (DTOs)

### CreateUserDTO (registro)

```json
{
  "name": "string (min 1)",
  "email": "string (email valido)",
  "password": "string (min 8)",
  "avatarUrl": "string (url, opcional)",
  "bio": "string (max 500, opcional)",
  "teamIds": "string[] (opcional, default [])",
  "projectIds": "string[] (opcional, default [])",
  "notificationIds": "string[] (opcional, default [])"
}
```

### LogInDTO

```json
{
  "email": "string (email valido)",
  "password": "string (min 8)"
}
```

### ForgotPasswordDTO

```json
{
  "email": "string (email valido)"
}
```

### ResendVerificationDTO

```json
{
  "email": "string (email valido)"
}
```

### UpdateUserDTO

```json
{
  "name": "string (opcional)",
  "email": "string (email valido, opcional)",
  "password": "string (min 8, opcional)",
  "avatarUrl": "string (url, opcional)",
  "bio": "string (max 500, opcional)",
  "teamIds": "string[] (opcional)",
  "projectIds": "string[] (opcional)",
  "notificationIds": "string[] (opcional)"
}
```

### ChangePassDTO (cambio de password)

```json
{
  "currentPassword": "string (min 8)",
  "newPassword": "string (min 8)"
}
```

### CreateTeamDTO

```json
{
  "name": "string (min 1)",
  "description": "string (max 500, opcional)"
}
```

### InviteMemberDTO

```json
{
  "userId": "string",
  "role": "admin | member"
}
```

### CreateProjectDTO

```json
{
  "name": "string (min 1)",
  "description": "string (max 1000, opcional)",
  "tags": "string[] (opcional, default [])",
  "deadline": "date (opcional, futuro)"
}
```

### UpdateProjectDTO

```json
{
  "name": "string (opcional)",
  "description": "string (max 1000, opcional)",
  "tags": "string[] (opcional)",
  "deadline": "date (opcional, futuro)"
}
```

### CreateTaskDTO

```json
{
  "title": "string (min 1)",
  "description": "string (opcional)",
  "status": "todo | in_progress | blocked | done (opcional, default todo)",
  "priority": "low | medium | high | urgent (opcional, default medium)",
  "assigneeId": "string (opcional)",
  "dueDate": "date (opcional)",
  "tags": "string[] (opcional, default [])"
}
```

### UpdateTaskDTO

```json
{
  "title": "string (opcional)",
  "description": "string (opcional)",
  "priority": "low | medium | high | urgent (opcional)",
  "dueDate": "date (opcional)",
  "tags": "string[] (opcional)"
}
```

### ChangeTaskStatusDTO

```json
{
  "status": "todo | in_progress | blocked | done"
}
```

### AssignTaskDTO

```json
{
  "assigneeId": "string"
}
```

### ListTasksByProjectDTO (query)

```json
{
  "status": "todo | in_progress | blocked | done (opcional)",
  "priority": "low | medium | high | urgent (opcional)",
  "assigneeId": "string (opcional)"
}
```

## Schemas de respuesta

### User (dominio)

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (hash)",
  "isVerified": "boolean",
  "avatarUrl": "string | undefined",
  "bio": "string | undefined",
  "teamIds": "string[]",
  "projectIds": "string[]",
  "notificationIds": "string[]",
  "createdAt": "string (ISO)",
  "updatedAt": "string (ISO)"
}
```

### UserLoginInfo

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "isVerified": "boolean"
}
```

### Team (dominio)

```json
{
  "id": "string",
  "name": "string",
  "ownerId": "string",
  "description": "string | undefined",
  "members": [
    {
      "userId": "string",
      "role": "owner | admin | member"
    }
  ]
}
```

### TeamWithMembers (include=members)

```json
{
  "id": "string",
  "name": "string",
  "ownerId": "string",
  "description": "string | undefined",
  "members": [
    {
      "userId": "string",
      "role": "owner | admin | member",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "avatarUrl": "string | undefined"
      } | null
    }
  ]
}
```

### Project (dominio)

```json
{
  "id": "string",
  "name": "string",
  "teamId": "string",
  "createdBy": "string",
  "status": "active | paused | completed",
  "archived": "boolean",
  "description": "string | undefined",
  "tags": "string[]",
  "deadline": "string (ISO) | undefined"
}
```

### Task (dominio)

```json
{
  "id": "string",
  "title": "string",
  "description": "string | undefined",
  "status": "todo | in_progress | blocked | done",
  "priority": "low | medium | high | urgent",
  "projectId": "string",
  "assigneeId": "string | null",
  "createdBy": "string",
  "dueDate": "string (ISO) | undefined",
  "tags": "string[]"
}
```

## Endpoints

### Auth

#### POST /auth/register

Registro de usuario y envio de email de verificacion.

- Body: `CreateUserDTO`
- Response 201:

```json
{
  "success": true,
  "data": { "user": { "...": "User" } },
  "message": "Check your email to verify your account"
}
```

#### GET /auth/verify-email/:token

Verifica el email del usuario.

- Params: `token` (string)
- Response 200:

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": { "id": "string", "email": "string", "isVerified": true }
}
```

#### POST /auth/resend-verification

Reenvia el email de verificacion si existe el usuario.

- Body: `ResendVerificationDTO`
- Response 200:

```json
{
  "success": true,
  "message": "If the email exists, a verification link will be sent"
}
```

#### POST /auth/forgot-password

Solicita email de recuperacion de password.

- Body: `ForgotPasswordDTO`
- Response 200:

```json
{
  "success": true,
  "message": "If the email exists, a reset link will be sent"
}
```

#### POST /auth/login

Inicia sesion y entrega access token. El refresh token se setea como cookie.

- Body: `LogInDTO`
- Rate limit: 10 intentos cada 15 min por IP.
- Response 200:

```json
{
  "success": true,
  "data": { "user": { "...": "UserLoginInfo" } },
  "token": "access_token"
}
```

#### POST /auth/reset-password

Actualiza password usando token de recuperacion.

- Body:

```json
{
  "token": "string",
  "password": "string (min 8)"
}
```

- Rate limit: 5 intentos cada 15 min por IP.
- Response 200:

```json
{ "success": true, "message": "Password updated successfully" }
```

#### POST /auth/refresh

Rota refresh token (cookie) y devuelve nuevo access token.

- Cookies: `refresh_token`
- Response 200:

```json
{ "success": true, "token": "access_token" }
```

#### POST /auth/logout

Limpia la cookie `refresh_token`.

- Response 200:

```json
{ "success": true, "message": "Logged out successfully" }
```

### Me

#### GET /me

Obtiene el usuario actual (requiere auth).

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": { "...": "User" } }
```

#### GET /me/projects

Lista proyectos del usuario autenticado.

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Project" }] }
```

#### GET /me/tasks

Lista tareas del usuario autenticado.

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Task" }] }
```

#### GET /me/teams

Lista equipos del usuario autenticado.

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Team" }] }
```

### Users

#### PUT /users

Actualiza el usuario actual (requiere auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `UpdateUserDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "User" } }
```

#### PATCH /users/change-password

Cambia la password del usuario actual (requiere auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `ChangePassDTO`
- Response 200:

```json
{ "success": true, "message": "Password changed successfully" }
```

#### DELETE /users

Elimina el usuario autenticado (requiere auth).

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "message": "User deleted successfully" }
```

### Teams

Permisos:

- Solo el owner puede agregar, remover, promover o degradar miembros.
- Un miembro puede salir del equipo (auto-removerse).
- Solo miembros (incluido owner) pueden ver un team por id.

#### POST /teams/

Crea un equipo (requiere auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `CreateTeamDTO`
- Response 201:

```json
{ "success": true, "data": { "...": "Team" } }
```

#### GET /teams/:id

Obtiene un equipo por id (solo miembros del team).

- Params: `id`
- Query (opcional): `include=members` o `members=full` para incluir datos de usuario en `members`.
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Response 200 (include=members):

```json
{ "success": true, "data": { "...": "TeamWithMembers" } }
```

- Nota: si el usuario asociado ya no existe, `members[].user` sera `null`.

#### PATCH /teams/:id

Actualiza informacion del equipo (owner/admin).

- Params: `id`
- Body: `UpdateTeamDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

#### DELETE /teams/:id

Elimina un equipo (solo owner).

- Params: `id`
- Response 200:

```json
{ "success": true, "message": "Team deleted successfully" }
```

#### POST /teams/:id/members

Agrega un miembro al equipo.

- Params: `id` (teamId)
- Body: `InviteMemberDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

#### GET /teams/:id/members

Lista miembros del equipo.

- Params: `id` (teamId)
- Response 200:

```json
{ "success": true, "data": [{ "...": "TeamMember" }] }
```

#### DELETE /teams/:id/members/:userId

Elimina un miembro del equipo. Solo owner, o el mismo miembro puede salir.

- Params: `id` (teamId), `userId`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

#### PATCH /teams/:id/members/:userId/promote

Promueve a admin.

- Params: `id` (teamId), `userId`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

#### PATCH /teams/:id/members/:userId/demote

Degrada a member.

- Params: `id` (teamId), `userId`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

### Projects

Permisos:

- Solo owner/admin del team pueden crear, actualizar, cambiar estado o eliminar.
- Cualquier miembro del team puede ver un proyecto por id.
- El usuario autenticado puede listar sus proyectos con `/me/projects`.
- Cualquier miembro del team puede listar proyectos del team con `/teams/:teamId/projects`.

#### POST /teams/:teamId/projects

Crea un proyecto dentro de un team (requiere auth).

- Headers: `Authorization: Bearer <access_token>`
- Params: `teamId`
- Body: `CreateProjectDTO` (sin `teamId`)
- Response 201:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### GET /teams/:teamId/projects

Lista proyectos por team (miembros del team).

- Params: `teamId`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Project" }] }
```

#### GET /projects/:id

Obtiene un proyecto por id (solo miembros del team).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id

Actualiza parcialmente un proyecto (solo owner/admin).

- Params: `id`
- Body: `UpdateProjectDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/pause

Alterna entre `paused` y `active` (solo owner/admin).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/complete

Completa un proyecto (solo owner/admin).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/archive

Alterna el flag `archived` (solo owner/admin).

#### PATCH /projects/:id/reopen

Reabre un proyecto completado (`completed` -> `active`) y limpia `archived` si aplica.

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### DELETE /projects/:id

Elimina un proyecto (solo owner/admin).

- Params: `id`
- Response 200:

```json
{ "success": true, "message": "Project deleted successfully" }
```

### Tasks

Permisos:

- Solo owner/admin del team pueden crear o asignar tareas.
- Solo owner/admin pueden editar tareas.
- Owner/admin o assignee pueden cambiar estado.
- Cualquier miembro del team puede ver/listar tareas del proyecto.
- El usuario autenticado puede listar sus tareas con `/me/tasks`.
- Owner/admin ven todas las tareas del team en `/teams/:teamId/tasks`; members solo las asignadas.

#### POST /projects/:projectId/tasks

Crea una tarea dentro del proyecto.

- Headers: `Authorization: Bearer <access_token>`
- Params: `projectId`
- Body: `CreateTaskDTO`
- Response 201:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### GET /projects/:projectId/tasks

Lista tareas de un proyecto con filtros opcionales.

- Params: `projectId`
- Query: `status`, `priority`, `assigneeId`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Task" }] }
```

#### GET /teams/:teamId/tasks

Lista tareas de un team (owner/admin ven todo; member solo asignadas).

- Params: `teamId`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Task" }] }
```

#### GET /tasks/:taskId

Obtiene una tarea por id.

- Params: `taskId`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### PATCH /tasks/:taskId

Actualiza datos basicos de una tarea.

- Params: `taskId`
- Body: `UpdateTaskDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### PATCH /tasks/:taskId/status

Cambia el estado de una tarea.

- Params: `taskId`
- Body: `ChangeTaskStatusDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### PATCH /tasks/:taskId/assign

Asigna una tarea a un miembro del team.

- Params: `taskId`
- Body: `AssignTaskDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### DELETE /tasks/:taskId

Elimina una tarea.

- Params: `taskId`
- Response 200:

```json
{ "success": true, "message": "Task deleted successfully" }
```

### Metrics

#### GET /metrics/overview

Resumen general del usuario (proyectos activos, tareas totales, tareas completadas).

#### GET /metrics/projects

Métricas por proyecto (tareas por estado, progreso).

#### GET /metrics/tasks

Métricas de tareas (pendientes, en progreso, completadas, vencidas).

#### GET /metrics/teams

Métricas por equipo (miembros, proyectos activos).

## Curl examples (new endpoints)

```bash
# Me
curl http://localhost:3000/api/v1/me -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/me/projects -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/me/tasks -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/me/teams -H "Authorization: Bearer <access_token>"

# Users
curl -X PUT http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Ada Lovelace" }'
curl -X PATCH http://localhost:3000/api/v1/users/change-password \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "currentPassword": "oldpass123", "newPassword": "newpass123" }'
curl -X DELETE http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <access_token>"

# Teams
curl -X POST http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Core Team" }'
curl http://localhost:3000/api/v1/teams/<teamId> -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/teams/<teamId>/members -H "Authorization: Bearer <access_token>"
curl -X POST http://localhost:3000/api/v1/teams/<teamId>/members \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "userId": "<userId>", "role": "member" }'

# Projects (team-scoped)
curl -X POST http://localhost:3000/api/v1/teams/<teamId>/projects \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Project Alpha" }'
curl http://localhost:3000/api/v1/teams/<teamId>/projects -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/projects/<projectId> -H "Authorization: Bearer <access_token>"
curl -X PATCH http://localhost:3000/api/v1/projects/<projectId> \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "description": "Updated description" }'
curl -X DELETE http://localhost:3000/api/v1/projects/<projectId> \
  -H "Authorization: Bearer <access_token>"

# Tasks
curl -X POST http://localhost:3000/api/v1/projects/<projectId>/tasks \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Draft kickoff agenda" }'
curl http://localhost:3000/api/v1/projects/<projectId>/tasks -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/tasks/<taskId> -H "Authorization: Bearer <access_token>"
curl -X PATCH http://localhost:3000/api/v1/tasks/<taskId>/status \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "done" }'
curl -X PATCH http://localhost:3000/api/v1/tasks/<taskId>/assign \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "assigneeId": "<userId>" }'
curl -X DELETE http://localhost:3000/api/v1/tasks/<taskId> \
  -H "Authorization: Bearer <access_token>"

# Metrics
curl http://localhost:3000/api/v1/metrics/overview -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/metrics/projects -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/metrics/tasks -H "Authorization: Bearer <access_token>"
curl http://localhost:3000/api/v1/metrics/teams -H "Authorization: Bearer <access_token>"
```

### Misc

#### GET /welcome

Respuesta simple de texto.

- Response 200: `Welcome to the Quantum Projects API!`

#### GET /health

Healthcheck con estado de DB.

- Response 200:

```json
{ "success": true, "db": "up" }
```

- Response 503:

```json
{ "success": false, "db": "down" }
```

## Notas tecnicas

- Las respuestas de `User` incluyen el campo `password` (hash) segun el dominio actual.
- `User.createdAt` y `User.updatedAt` se serializan como ISO string al responder JSON.
- Endpoints de usuarios, equipos, proyectos y tareas fallaran si no se monta el middleware de autenticacion para poblar `req.userId`.
