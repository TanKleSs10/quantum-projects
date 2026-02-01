# 📡 Quantum Projects — API Endpoints

## 🔐 Auth

Endpoints relacionados con autenticación y gestión de sesión.

- **POST `/auth/register`**  
   Crea un nuevo usuario y envía email de verificación.
- **GET `/auth/verify-email/:token`**  
   Verifica el correo electrónico del usuario.
- **POST `/auth/resend-verification`**  
   Reenvía el email de verificación.
- **POST `/auth/login`**  
   Inicia sesión y genera tokens de acceso.
- **POST `/auth/refresh`**  
   Genera un nuevo access token usando el refresh token.
- **POST `/auth/logout`**  
   Invalida la sesión limpiando el refresh token.
- **POST `/auth/forgot-password`**  
   Envía email para recuperación de contraseña.
- **POST `/auth/reset-password`**  
   Cambia la contraseña usando token de recuperación.

---

## 👤 Me

Endpoints relacionados con el usuario autenticado.

- **GET `/me`**  
   Obtiene el perfil del usuario autenticado.
- **GET `/me/projects`**  
   Lista los proyectos en los que participa el usuario.
- **GET `/me/tasks`**  
   Lista las tareas asignadas al usuario.
- **GET `/me/teams`**  
   Lista los equipos a los que pertenece el usuario.

---

## 👥 Teams

Gestión de equipos de trabajo.

- **POST `/teams`**  
   Crea un nuevo equipo.
- **GET `/teams/:id`**  
   Obtiene el detalle de un equipo.
- **PATCH `/teams/:id`**  
   Actualiza información del equipo.
- **DELETE `/teams/:id`**  
   Elimina un equipo.

### Miembros

- **GET `/teams/:id/members`**  
   Lista los miembros del equipo.
- **POST `/teams/:id/members`**  
   Agrega un miembro al equipo.
- **DELETE `/teams/:id/members/:userId`**  
   Elimina un miembro del equipo.
- **PATCH `/teams/:id/members/:userId/promote`**  
   Promueve un miembro a admin.
- **PATCH `/teams/:id/members/:userId/demote`**  
   Degrada un miembro a member.

---

## 📁 Projects

Gestión de proyectos.

- **POST `/projects`**  
   Crea un proyecto.
- **GET `/projects`**  
   Lista proyectos (con filtros opcionales).
- **GET `/projects/:id`**  
   Obtiene el detalle de un proyecto.
- **PATCH `/projects/:id`**  
   Actualiza parcialmente un proyecto.
- **DELETE `/projects/:id`**  
   Elimina un proyecto.

### Estado del proyecto

- **PATCH `/projects/:id/archive`**  
   Archiva el proyecto.
- **PATCH `/projects/:id/restore`**  
   Restaura un proyecto archivado.
- **PATCH `/projects/:id/complete`**  
   Marca el proyecto como completado.
- **PATCH `/projects/:id/pause`**  
   Pausa el proyecto.

---

## ✅ Tasks

Gestión de tareas dentro de proyectos.

- **GET `/projects/:projectId/tasks`**  
   Lista las tareas de un proyecto.
- **POST `/projects/:projectId/tasks`**  
   Crea una tarea en un proyecto.
- **GET `/tasks/:taskId`**  
   Obtiene el detalle de una tarea.
- **PATCH `/tasks/:taskId`**  
   Actualiza una tarea.
- **DELETE `/tasks/:taskId`**  
   Elimina una tarea.

### Acciones sobre tareas

- **PATCH `/tasks/:taskId/status`**  
   Cambia el estado de la tarea.
- **PATCH `/tasks/:taskId/assign`**  
   Asigna la tarea a un usuario.

---

## 📊 Metrics (MVP)

Métricas básicas de uso y productividad para dashboard.

- **GET `/metrics/overview`**  
   Resumen general del usuario (proyectos activos, tareas totales, tareas completadas).
- **GET `/metrics/projects`**  
   Métricas por proyecto (tareas por estado, progreso).
- **GET `/metrics/tasks`**  
   Métricas de tareas (pendientes, en progreso, completadas, vencidas).
- **GET `/metrics/teams`**  
   Métricas por equipo (miembros, proyectos activos).

> Nota:  
> Estas métricas son **agregaciones simples** (counts, ratios).  
> No incluyen analytics históricos ni BI avanzado (eso queda para V1+).

---

### 🧠 Nota de diseño (importante)

- **Metrics es solo lectura**
- **Toda la lógica vive en backend**
  - El frontend solo consume y presenta
