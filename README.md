# 🚀 Quantum Projects

**Quantum Projects** es una **plataforma full-stack de gestión de proyectos** orientada a equipos que necesitan **organización clara, control de tareas y métricas accionables** para tomar mejores decisiones.

El proyecto está diseñado como un **monorepo**, con un backend robusto y un frontend moderno, pensado para evolucionar de **MVP funcional** a **producto SaaS escalable**.

---

## 🧠 Visión del proyecto

* Centralizar **proyectos, tareas y equipos** en una sola plataforma
* Ofrecer **visibilidad real** mediante métricas y resúmenes
* Mantener una **arquitectura limpia y mantenible**
* Priorizar **seguridad y buenas prácticas** desde el inicio

---

## 🔐 Vista de Login

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/b49e83b0-5ac1-4846-b279-4b6c2502aecf" />

---

## 📊 Vista de Dashboard

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/2303e51e-48d7-4cdc-a3d3-8516d51bab1a" />

---

## ✨ Características (MVP)

* Autenticación segura mediante **cookies httpOnly**
* Gestión de **equipos con roles** (`owner`, `admin`, `member`)
* **Proyectos por equipo** con estados y archivado
* **Tareas por proyecto** con asignación y flujo de estados
* **Dashboard** con métricas clave y resúmenes de actividad
* Arquitectura preparada para crecimiento funcional

---

## 🗂️ Estructura del proyecto

```txt
app/
  backend/   # API principal (Clean Architecture)
  frontend/  # SPA (React + Vite)
```

Separación clara entre **dominio, infraestructura y presentación**, facilitando mantenimiento y escalabilidad.

---

## 🛠️ Stack tecnológico

### Backend

* Express
* TypeScript
* MongoDB
* Arquitectura limpia (Clean Architecture)

### Frontend

* React
* Vite
* TypeScript
* TanStack Query
* Zustand

### Autenticación

* Cookies **httpOnly**
* Sin tokens accesibles desde JavaScript

---

## ⚙️ Requisitos

* Node.js (versión acorde a cada subproyecto)
* Docker + Docker Compose (opcional, recomendado)

---

## 🚀 Configuración rápida (Docker Compose)

1. Crear el archivo `.env` a partir de `.env-template` y completar las variables.
2. Levantar todo el stack:

```bash
docker compose up --build
```

### Servicios disponibles

* **API:** [http://localhost:4000](http://localhost:4000)
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **MongoDB:** mongodb://localhost:27017
* **Grafana:** [http://localhost:3000](http://localhost:3000)
* **Loki:** [http://localhost:3100](http://localhost:3100)

---

## 💻 Desarrollo local (sin Docker)

### Backend

```bash
cd app/backend
npm install
npm run dev
```

### Frontend

```bash
cd app/frontend
npm install
npm run dev
```

---

## 📚 Documentación

Toda la documentación está centralizada en la carpeta `/docs`.

Backend

docs/backend/PROJECT.md / PROJECT.en.md

docs/backend/api-endpoints.md / api-endpoints.en.md

docs/backend/branching.md / branching.en.md

docs/backend/e2e-warnings.md / e2e-warnings.en.md

Frontend

docs/frontend/CONTEXT.md / CONTEXT.en.md

docs/frontend/CONTRIBUTING.md / CONTRIBUTING.en.md

docs/frontend/api-endpoints.md / api-endpoints.en.md

Notas técnicas

docs/notes/PROJECT_STATUS_NOTE.md / PROJECT_STATUS_NOTE.en.md

docs/notes/TASK_STATUS_NOTE.md / TASK_STATUS_NOTE.en.md

---

## 🎯 Estado del proyecto

* MVP funcional en desarrollo activo
* Arquitectura validada para escalar
* Enfoque en calidad, claridad y métricas reales

