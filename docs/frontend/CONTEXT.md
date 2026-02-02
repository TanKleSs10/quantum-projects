# Project Context — Quantum Projects Frontend (MVP)

Este documento describe **el contexto del producto** y **los límites del frontend** de Quantum Projects.

No define reglas de código ni convenciones.  
Su propósito es evitar **malas decisiones por falta de contexto**.

---

## 🚀 ¿Qué es Quantum Projects?

**Quantum Projects** es una aplicación web de **gestión de proyectos colaborativa**, con enfoque social, construida inicialmente como **MVP**.

El sistema permite:

- gestionar equipos
- crear proyectos
- organizar tareas
- colaborar entre usuarios

Este repositorio corresponde **únicamente al frontend**.

---

## 🎯 Objetivo del Frontend

El frontend existe para:

- Consumir la **Quantum Projects Core API**
- Presentar información al usuario
- Gestionar interacciones y flujos de UI
- Mantener estado visual y de sesión

El frontend **NO**:

- implementa reglas de negocio
- decide permisos
- valida lógica crítica
- persiste datos

La **fuente de verdad es el backend**.

---

## 🧩 Tipo de aplicación

- **SPA (Single Page Application)**
- Autenticada
- Post-login
- No SEO-first
- No SSR
- No file-based routing

El frontend está diseñado para:

- alta interacción
- estado dinámico
- crecimiento progresivo

---

## 🔐 Modelo de seguridad (resumen)

- Autenticación basada en cookies `httpOnly`
- Tokens **no accesibles desde JavaScript**
- El frontend no almacena credenciales
- La sesión se valida vía `GET /users/me` (feature `user`)

La seguridad **no se negocia por conveniencia de UI**.

---

## 📦 Alcance del MVP

Incluido en el MVP:

- Login / registro / verificación
- Dashboard básico
- Gestión de teams
- Gestión de proyectos
- Gestión de tareas
- Manejo de errores y estados UX

Fuera de alcance (por ahora):

- Branding avanzado
- Animaciones complejas
- Internacionalización
- Tiempo real (WebSockets)
- Mobile app
- Testing extensivo

---

## 🧠 Decisiones ya tomadas (no debatibles)

- React + Vite
- SPA declarativa
- Backend desacoplado
- TanStack Query para datos
- Zustand solo para UI / sesión
- Tokens fuera de JS
- Simplicidad > sobreingeniería

Si algo contradice esto, **está fuera del scope**.

---

## 🧭 Filosofía del proyecto

Este frontend prioriza:

- claridad
- control
- seguridad
- escalabilidad

No busca ser:

- un experimento
- un showcase de librerías
- un playground de patrones

---

## 📌 Regla final

> Si una decisión no respeta este contexto,  
> probablemente no pertenece a este proyecto.
