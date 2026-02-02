# Quantum Projects Core API - Endpoints and Schemas (English Summary)

This document is an English summary of the current API routes.
For full schema details (DTOs and examples), refer to the Spanish version:
`docs/backend/api-endpoints.md`.

## Base URL

- Base: `/api/v1`
- Local host example: `http://localhost:3000/api/v1`

## Authentication

- Use `Authorization: Bearer <access_token>` for protected endpoints.
- The `refresh_token` is delivered as the `refresh_token` cookie (httpOnly).
- Endpoints under `/me`, `/users`, `/teams`, `/projects`, `/tasks`, and `/metrics` require auth.

## Common response format

- Success:
  - `{ "success": true, "data": <payload>, "message"?: string, "token"?: string }`
- Error:
  - `{ "success": false, "message": string, "errors"?: any, "code"?: string }`

## Auth

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh tokens
- `POST /auth/verify-email` - Send verification email
- `GET /auth/verify-email/:token` - Verify email token
- `POST /auth/forgot-password` - Request reset
- `POST /auth/reset-password/:token` - Reset password

## Me

- `GET /me` - Current user profile
- `PATCH /me` - Update profile
- `PATCH /me/change-password` - Change password
- `DELETE /me` - Delete account
- `GET /me/projects` - My projects
- `GET /me/tasks` - My tasks
- `GET /me/teams` - My teams

## Users

- `PATCH /users` - Update own user
- `PATCH /users/change-password` - Change own password
- `DELETE /users` - Delete own user

## Teams

- `POST /teams` - Create team
- `GET /teams/:id` - Get team detail
- `PATCH /teams/:id` - Update team
- `DELETE /teams/:id` - Delete team

### Members

- `GET /teams/:id/members` - List team members
- `POST /teams/:id/members` - Add member
- `DELETE /teams/:id/members/:userId` - Remove member
- `PATCH /teams/:id/members/:userId/promote` - Promote to admin
- `PATCH /teams/:id/members/:userId/demote` - Demote to member

## Projects

- `POST /teams/:teamId/projects` - Create project in team
- `GET /teams/:teamId/projects` - List team projects
- `GET /projects/:id` - Get project detail
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Project status

- `PATCH /projects/:id/pause` - Toggle active/paused
- `PATCH /projects/:id/complete` - Mark as completed
- `PATCH /projects/:id/reopen` - Reopen (completed  active)
- `PATCH /projects/:id/archive` - Toggle archived flag

## Tasks

- `GET /projects/:projectId/tasks` - List tasks in project
- `POST /projects/:projectId/tasks` - Create task in project
- `GET /tasks/:taskId` - Get task detail
- `PATCH /tasks/:taskId` - Update task
- `DELETE /tasks/:taskId` - Delete task

### Task actions

- `PATCH /tasks/:taskId/status` - Change status
- `PATCH /tasks/:taskId/assign` - Assign user

## Metrics

- `GET /metrics/overview` - User overview
- `GET /metrics/projects` - Project metrics
- `GET /metrics/tasks` - Task metrics
- `GET /metrics/teams` - Team metrics
