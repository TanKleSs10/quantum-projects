# Project Context - Quantum Projects Frontend (MVP)

This document describes the **product context** and **frontend boundaries** of Quantum Projects.

It does not define coding rules or conventions.
Its purpose is to avoid **bad decisions due to lack of context**.

---

## What is Quantum Projects?

**Quantum Projects** is a web app for **collaborative project management**, with a social focus, built initially as an **MVP**.

The system allows:

- manage teams
- create projects
- organize tasks
- collaborate between users

This repo corresponds **only to the frontend**.

---

## Frontend goal

The frontend exists to:

- Consume the **Quantum Projects Core API**
- Present information to the user
- Manage UI interactions and flows
- Maintain visual and session state

The frontend **does NOT**:

- implement business rules
- decide permissions
- validate critical logic
- persist data

The **source of truth is the backend**.

---

## App type

- **SPA (Single Page Application)**
- Authenticated
- Post-login
- Not SEO-first
- No SSR
- No file-based routing

The frontend is designed for:

- high interaction
- dynamic state
- progressive growth

---

## Security model (summary)

- Authentication via `httpOnly` cookies
- Tokens **not accessible from JavaScript**
- Frontend does not store credentials
- Session validated via `GET /users/me` (feature `user`)

Security **is not negotiated for UI convenience**.

---

## MVP scope

Included in MVP:

- Login / register / verification
- Basic dashboard
- Team management
- Project management
- Task management
- Error handling and UX states

Out of scope (for now):

- Advanced branding
- Complex animations
- Internationalization
- Real time (WebSockets)
- Mobile app
- Extensive testing

---

## Decisions already made (non-negotiable)

- React + Vite
- Declarative SPA
- Decoupled backend
- TanStack Query for data
- Zustand only for UI / session
- Tokens outside JS
- Simplicity > overengineering

If something contradicts this, it is **out of scope**.

---

## Project philosophy

This frontend prioritizes:

- clarity
- control
- security
- scalability

It is not meant to be:

- an experiment
- a library showcase
- a patterns playground

---

## Final rule

> If a decision does not respect this context,
> it probably does not belong in this project.
