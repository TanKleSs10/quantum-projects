# 🚀 Quantum Projects

**Quantum Projects** is a **full-stack project management platform** designed for teams that need **clear organization, task control, and actionable metrics** to make better decisions.

The project is structured as a **monorepo**, with a robust backend and a modern frontend, built to evolve from a **functional MVP** into a **scalable SaaS product**.

---

## 🧠 Project Vision

* Centralize **projects, tasks, and teams** in a single platform
* Provide **real visibility** through metrics and summaries
* Maintain a **clean and maintainable architecture**
* Prioritize **security and best practices** from day one

---

## 🔐 Login View

<img width="1366" height="768" alt="Login view" src="https://github.com/user-attachments/assets/b49e83b0-5ac1-4846-b279-4b6c2502aecf" />

---

## 📊 Dashboard View

<img width="1366" height="768" alt="Dashboard view" src="https://github.com/user-attachments/assets/2303e51e-48d7-4cdc-a3d3-8516d51bab1a" />

---

## ✨ Features (MVP)

* Secure authentication using **httpOnly cookies**
* **Team management with roles** (`owner`, `admin`, `member`)
* **Team-based projects** with status management and archiving
* **Project tasks** with assignment and state workflow
* **Dashboard** with key metrics and activity summaries
* Architecture prepared for functional growth

---

## 🗂️ Project Structure

```txt
app/
  backend/   # Main API (Clean Architecture)
  frontend/  # SPA (React + Vite)
```

Clear separation between **domain, infrastructure, and presentation**, enabling easier maintenance and scalability.

---

## 🛠️ Tech Stack

### Backend

* Express
* TypeScript
* MongoDB
* Clean Architecture

### Frontend

* React
* Vite
* TypeScript
* TanStack Query
* Zustand

### Authentication

* **httpOnly cookies**
* No tokens accessible from JavaScript

---

## ⚙️ Requirements

* Node.js (version according to each subproject)
* Docker + Docker Compose (optional, recommended)

---

## 🚀 Quick Setup (Docker Compose)

1. Create the `.env` file from `.env-template` and fill in the required variables.
2. Start the full stack:

```bash
docker compose up --build
```

### Available Services

* **API:** [http://localhost:4000](http://localhost:4000)
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **MongoDB:** mongodb://localhost:27017
* **Grafana:** [http://localhost:3000](http://localhost:3000)
* **Loki:** [http://localhost:3100](http://localhost:3100)

---

## 💻 Local Development (without Docker)

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

## 📚 Documentation

All documentation is centralized in the `/docs` directory.

### Backend

* `docs/backend/PROJECT.md` / `PROJECT.en.md`
* `docs/backend/api-endpoints.md` / `api-endpoints.en.md`
* `docs/backend/branching.md` / `branching.en.md`
* `docs/backend/e2e-warnings.md` / `e2e-warnings.en.md`

### Frontend

* `docs/frontend/CONTEXT.md` / `CONTEXT.en.md`
* `docs/frontend/CONTRIBUTING.md` / `CONTRIBUTING.en.md`
* `docs/frontend/api-endpoints.md` / `api-endpoints.en.md`

### Technical Notes

* `docs/notes/PROJECT_STATUS_NOTE.md` / `PROJECT_STATUS_NOTE.en.md`
* `docs/notes/TASK_STATUS_NOTE.md` / `TASK_STATUS_NOTE.en.md`

---

## 🎯 Project Status

* Functional MVP under active development
* Architecture validated for scaling
* Focused on quality, clarity, and real metrics
