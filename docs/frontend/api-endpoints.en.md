# Quantum Projects Core API - Endpoints and Schemas

Document generated from the current routes and DTOs in the code.

## Base URL

- Base: `/api/v1`
- Localhost example: `http://localhost:3000/api/v1`

## Authentication

- Use `Authorization: Bearer <access_token>` for protected endpoints.
- The `refresh_token` is delivered as the `refresh_token` cookie (httpOnly).
- Note: Endpoints under `/me`, `/users`, `/teams`, `/projects`, `/tasks`, and `/metrics` require auth.

## Common response format

- Success:
  - `{ "success": true, "data": <payload>, "message"?: string, "token"?: string }`
- Error:
  - `{ "success": false, "message": string, "errors"?: any, "code"?: string }`

## Base schemas (DTOs)

### CreateUserDTO (registration)

```json
{
  "name": "string (min 1)",
  "email": "string (valid email)",
  "password": "string (min 8)",
  "avatarUrl": "string (url, optional)",
  "bio": "string (max 500, optional)",
  "teamIds": "string[] (optional, default [])",
  "projectIds": "string[] (optional, default [])",
  "notificationIds": "string[] (optional, default [])"
}
```

### LogInDTO

```json
{
  "email": "string (valid email)",
  "password": "string (min 8)"
}
```

### ForgotPasswordDTO

```json
{
  "email": "string (valid email)"
}
```

### ResendVerificationDTO

```json
{
  "email": "string (valid email)"
}
```

### UpdateUserDTO

```json
{
  "name": "string (optional)",
  "email": "string (valid email, optional)",
  "password": "string (min 8, optional)",
  "avatarUrl": "string (url, optional)",
  "bio": "string (max 500, optional)",
  "teamIds": "string[] (optional)",
  "projectIds": "string[] (optional)",
  "notificationIds": "string[] (optional)"
}
```

### ChangePassDTO (password change)

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
  "description": "string (max 500, optional)"
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
  "description": "string (max 1000, optional)",
  "tags": "string[] (optional, default [])",
  "deadline": "date (optional, future)",
  "teamId": "string"
}
```

### UpdateProjectDTO

```json
{
  "name": "string (optional)",
  "description": "string (max 1000, optional)",
  "tags": "string[] (optional)",
  "deadline": "date (optional, future)"
}
```

### CreateTaskDTO

```json
{
  "title": "string (min 1)",
  "description": "string (optional)",
  "status": "todo | in_progress | blocked | done (optional, default todo)",
  "priority": "low | medium | high | urgent (optional, default medium)",
  "assigneeId": "string (optional)",
  "dueDate": "date (optional)",
  "tags": "string[] (optional, default [])"
}
```

### UpdateTaskDTO

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "low | medium | high | urgent (optional)",
  "dueDate": "date (optional)",
  "tags": "string[] (optional)"
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
  "status": "todo | in_progress | blocked | done (optional)",
  "priority": "low | medium | high | urgent (optional)",
  "assigneeId": "string (optional)"
}
```

## Response schemas

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
  "status": "active | paused | completed | archived",
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

Registror de user y envior de email de viewificacion.

- Body: `CreateUserDTO`
- Response 201:

```json
{
  "success": true,
  "data": { "user": { "...": "User" } },
  "message": "Check your email tor viewify your account"
}
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "supersecret123",
    "avatarUrl": "https://example.com/avatar.png",
    "bio": "Math & computing"
  }'
```

#### GET /auth/viewify-email/:token

Verifica el email del user.

- Params: `token` (string)
- Response 200:

```json
{
  "success": true,
  "message": "Email viewified successfully",
  "data": { "id": "string", "email": "string", "isVerified": true }
}
```

- Curl:

```bash
curl http://localhost:3000/api/v1/auth/viewify-email/<token>
```

#### POST /auth/resend-viewification

Reenvia el email de viewificacion si existe el user.

- Body: `ResendVerificationDTO`
- Response 200:

```json
{
  "success": true,
  "message": "If the email exists, a viewification link will be sent"
}
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/resend-viewification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com"
  }'
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

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com"
  }'
```

#### POST /auth/login

Inicia sesion y entrega access token. El refresh token se setea comor cookie.

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

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "supersecret123"
  }'
```

#### POST /auth/reset-password

Updates password usandor token de recuperacion.

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

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<reset_token>",
    "password": "newpassword123"
  }'
```

#### POST /auth/refresh

Rota refresh token (cookie) y devuelve nuevor access token.

- Cookies: `refresh_token`
- Response 200:

```json
{ "success": true, "token": "access_token" }
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  --cookie "refresh_token=<refresh_token>"
```

#### POST /auth/logout

Limpia la cookie `refresh_token`.

- Response 200:

```json
{ "success": true, "message": "Logged out successfully" }
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  --cookie "refresh_token=<refresh_token>"
```

### Users

#### GET /users/me

Gets el user actual (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": { "...": "User" } }
```

- Curl:

```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>"
```

#### PUT /users/me

Updates el user actual (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `UpdateUserDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "User" } }
```

- Curl:

```bash
curl -X PUT http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "bio": "Updated bio"
  }'
```

#### PATCH /users/me/change-password

Changes la password del user actual (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `ChangePassDTO`
- Response 200:

```json
{ "success": true, "message": "Password changed successfully" }
```

- Curl:

```bash
curl -X PATCH http://localhost:3000/api/v1/users/me/change-password \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "supersecret123",
    "newPassword": "newpassword123"
  }'
```

#### DELETE /users/me

Deletes the authenticated user (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "message": "User deleted successfully" }
```

- Curl:

```bash
curl -X DELETE http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>"
```

### Teams

Permissions:

- Only the owner can add, remove, promote or demote members.
- Un member can leave the team (auto-removese).
- Only members (including owner) cann view a team by id.

#### POST /teams/

Creates a team (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `CreateTeamDTO`
- Response 201:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/teams/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Core Team",
    "description": "Primary team"
  }'
```

#### GET /teams/

Lists teams por user (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Team" }] }
```

- Curl:

```bash
curl http://localhost:3000/api/v1/teams/ \
  -H "Authorization: Bearer <access_token>"
```

#### GET /teams/:id

Gets a team by id (team members only).

- Params: `id`
- Query (optional): `include=members` or `members=full` tor include user data in `members`.
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Response 200 (include=members):

```json
{ "success": true, "data": { "...": "TeamWithMembers" } }
```

- Note: si el user asociador ya nor existe, `members[].user` sera `null`.

- Curl:

```bash
curl http://localhost:3000/api/v1/teams/<teamId> \
  -H "Authorization: Bearer <access_token>"
```

- Curl (include=members):

```bash
curl "http://localhost:3000/api/v1/teams/<teamId>?include=members" \
  -H "Authorization: Bearer <access_token>"
```

#### POST /teams/:id/members

Agrega un member al team.

- Params: `id` (teamId)
- Body: `InviteMemberDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/teams/<teamId>/members \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<userId>",
    "role": "member"
  }'
```

#### DELETE /teams/:id/members/:userId

Deletes a member team. Only owner, or el mismor member can salir.

- Params: `id` (teamId), `userId`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Curl:

```bash
curl -X DELETE http://localhost:3000/api/v1/teams/<teamId>/members/<userId> \
  -H "Authorization: Bearer <access_token>"
```

#### PATCH /teams/:id/members/:userId/promote

Promotes a admin.

- Params: `id` (teamId), `userId`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Curl:

```bash
curl -X PATCH http://localhost:3000/api/v1/teams/<teamId>/members/<userId>/promote \
  -H "Authorization: Bearer <access_token>"
```

#### PATCH /teams/:id/members/:userId/demote

Demotes a member.

- Params: `id` (teamId), `userId`
- Response 200:

```json
{ "success": true, "data": { "...": "Team" } }
```

- Curl:

```bash
curl -X PATCH http://localhost:3000/api/v1/teams/<teamId>/members/<userId>/demote \
  -H "Authorization: Bearer <access_token>"
```

### Projects

Permissions:

- Only owner/admin team cann crear, actualizar, cambiar estador or eliminar.
- Cualquier member team can view a project by id.
- El user autenticador can listar sus projects con `/projects/user`.

#### POST /projects/

Creates a project (requires auth).

- Headers: `Authorization: Bearer <access_token>`
- Body: `CreateProjectDTO`
- Response 201:

```json
{ "success": true, "data": { "...": "Project" } }
```

- Curl:

```bash
curl -X POST http://localhost:3000/api/v1/projects/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Alpha",
    "description": "Initial project",
    "teamId": "<teamId>",
    "tags": ["core", "mvp"]
  }'
```

#### GET /projects/:id

Gets a project by id (team members only).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

- Curl:

```bash
curl http://localhost:3000/api/v1/projects/<projectId> \
  -H "Authorization: Bearer <access_token>"
```

#### GET /projects?teamId=:teamId

Lists projects por team (team members only).

- Query: `teamId`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Project" }] }
```

- Curl:

```bash
curl "http://localhost:3000/api/v1/projects?teamId=<teamId>" \
  -H "Authorization: Bearer <access_token>"
```

#### GET /projects/user

Lists projects dthe authenticated user.

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Project" }] }
```

- Curl:

```bash
curl http://localhost:3000/api/v1/projects/user \
  -H "Authorization: Bearer <access_token>"
```

#### PUT /projects/:id

Updates a project (owner/admin only).

- Params: `id`
- Body: `UpdateProjectDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

- Curl:

```bash
curl -X PUT http://localhost:3000/api/v1/projects/<projectId> \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Beta",
    "deadline": "2026-01-01T00:00:00.000Z"
  }'
```

#### PATCH /projects/:id

Partially updates a project (owner/admin only).

- Params: `id`
- Body: `UpdateProjectDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

```bash
curl -X PATCH http://localhost:3000/api/v1/projects/<projectId> \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Nueva description"
  }'
```

#### PATCH /projects/:id/pause

Pausa a project (owner/admin only).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/resume

Reanuda a project (owner/admin only).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/complete

Completa a project (owner/admin only).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/archive

Archiva a project (owner/admin only).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### PATCH /projects/:id/unarchive

Desarchiva a project (owner/admin only).

- Params: `id`
- Response 200:

```json
{ "success": true, "data": { "...": "Project" } }
```

#### DELETE /projects/:id

Deletes a project (owner/admin only).

- Params: `id`
- Response 200:

```json
{ "success": true, "message": "Project deleted successfully" }
```

### Tasks

Permissions:

- Only owner/admin team cann crear or asignar tasks.
- Owner/admin or assignee cann actualizar or cambiar estado.
- Cualquier member team can view/listar tasks project.
- El user autenticador can listar sus tasks con `/tasks/user`.

#### POST /projects/:projectId/tasks

Creates a task inside the project.

- Headers: `Authorization: Bearer <access_token>`
- Params: `projectId`
- Body: `CreateTaskDTO`
- Response 201:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### GET /projects/:projectId/tasks

Lists tasks de a project con filtros optionales.

- Params: `projectId`
- Query: `status`, `priority`, `assigneeId`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Task" }] }
```

#### GET /tasks/user

Lists tasks dthe authenticated user.

- Headers: `Authorization: Bearer <access_token>`
- Response 200:

```json
{ "success": true, "data": [{ "...": "Task" }] }
```

#### GET /tasks/:taskId

Gets a task by id.

- Params: `taskId`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### PATCH /tasks/:taskId

Updates data basicos de a task.

- Params: `taskId`
- Body: `UpdateTaskDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### PATCH /tasks/:taskId/status

Changes el estador de a task.

- Params: `taskId`
- Body: `ChangeTaskStatusDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

#### PATCH /tasks/:taskId/assign

Assigns a task a un member team.

- Params: `taskId`
- Body: `AssignTaskDTO`
- Response 200:

```json
{ "success": true, "data": { "...": "Task" } }
```

### Misc

#### GET /welcome

Response simple de texto.

- Response 200: `Welcome tor the Quantum Projects API!`
- Curl:

```bash
curl http://localhost:3000/api/v1/welcome
```

#### GET /health

Healthcheck con estador de DB.

- Response 200:

```json
{ "success": true, "db": "up" }
```

- Response 503:

```json
{ "success": false, "db": "down" }
```

- Curl:

```bash
curl http://localhost:3000/api/v1/health
```

## Notas tecnicas

- Las respuestas de `User` incluyen el campor `password` (hash) segun el dominior actual.
- `User.createdAt` y `User.updatedAt` se serializan comor ISO string al responder JSON.
- Endpoints de users, teams, projects y tasks fallaran si nor se monta el middleware de autenticacion para poblar `req.userId`.