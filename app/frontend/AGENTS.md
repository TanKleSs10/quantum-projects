# Repository Guidelines — Quantum Projects Frontend

Este repositorio contiene el **frontend del sistema Quantum Projects**, una SPA construida con React y Vite, diseñada para consumir una API propia y escalar como producto real.

Estas guías existen para **mantener coherencia, seguridad y escalabilidad**.

---

## 🏗️ Project Structure & Module Organization

El proyecto sigue una **arquitectura por capas**, con responsabilidades estrictas.

```

src/
├── main.tsx              # Bootstrap de React + Router + Providers
├── app/
│   ├── App.tsx           # Root de la aplicación
│   ├── router.tsx        # Definición de rutas
│   └── providers.tsx     # QueryClient, stores, etc.
│
├── pages/                # Vistas a nivel ruta (screens)
├── components/           # Componentes UI reutilizables
├── features/             # Lógica por dominio (API + hooks)
├── store/                # Zustand (estado UI / sesión)
├── api/                  # HTTP client, errores, helpers
├── hooks/                # Hooks genéricos reutilizables
├── types/                # Tipos globales (API / dominio)
├── utils/                # Helpers puros
├── styles/               # Estilos globales (Tailwind + tokens)
├── assets/               # Imágenes / SVG locales
└── public/               # Archivos estáticos copiados tal cual

```

### Reglas clave

- `pages/` **NO** contiene lógica de datos
- `features/` **NO** contiene JSX
- `components/` **NO** llaman APIs
- El frontend **no replica reglas de negocio**

---

## ⚙️ Build, Development & Scripts

Scripts estándar del proyecto:

```bash
npm install        # Instala dependencias
npm run dev        # Dev server (Vite + HMR)
npm run build      # Build de producción (tsc + Vite)
npm run preview    # Preview del build
npm run lint       # ESLint
```

---

## 🧠 Stack Tecnológico

- React 18
- Vite + SWC
- TypeScript
- React Router (modo declarativo)
- TanStack Query (server state)
- Zustand (UI / sesión)
- React Hook Form + Zod
- Tailwind CSS
- Toast notifications (sonner / equivalente)

---

## 🔐 Autenticación & Seguridad

- **NO** se almacenan tokens en JS

- Autenticación basada en cookies `httpOnly`

- Todas las requests usan:

  ```ts
  credentials: "include";
  ```

- La sesión se valida con:

  ```http
  GET /users/me
  ```

Zustand **NO** guarda tokens.
Solo mantiene:

- `isAuthenticated`
- `authChecked`
- snapshot ligero del usuario

---

## ✍️ Coding Style & Naming Conventions

### General

- TypeScript + React funcional
- Claridad > cleverness
- No lógica innecesaria

### Formato

- Indentación: **2 espacios**
- Comillas simples
- Sin punto y coma

### Archivos

- **PascalCase** para componentes y páginas

  ```tsx
  LoginPage.tsx;
  ProjectTasksPage.tsx;
  ```

### Hooks

- Prefijo obligatorio `use`
- camelCase

  ```ts
  useProjects();
  useCreateTask();
  ```

### Variables

- camelCase
- Nombres semánticos

  ```ts
  isAuthenticated;
  selectedProjectId;
  ```

### Tipos

- PascalCase
- Sin prefijos `I`

  ```ts
  User;
  Project;
  ApiResponse<T>;
  ```

---

## 🔄 Estado & Data Fetching

### Server State

- Manejado **exclusivamente** por TanStack Query
- Cache, invalidación y refetch explícitos
- Ejemplos:
  - projects
  - tasks
  - teams
  - user (`/users/me`)

❌ No usar Zustand para datos del backend.

---

### UI State Global

- Zustand
- Solo para:
  - layout (sidebar, modales)
  - flags visuales
  - sesión (sin tokens)

---

### Interaction State

- `useState`
- Formularios, toggles, inputs

---

## 🧩 Features (Dominio Frontend)

Cada feature debe seguir esta estructura:

```
features/projects/
├── projects.api.ts      # Llamadas HTTP puras
├── projects.hooks.ts    # TanStack Query
├── projects.types.ts    # Tipos
```

Reglas:

- ❌ Nada de JSX
- ❌ Nada de estado UI
- ✅ Lógica de datos solamente

---

## 🧾 Formularios

- React Hook Form + Zod
- Un schema por formulario
- Validación SIEMPRE con resolver

```ts
const schema = z.object({
  email: z.string().email(),
});
```

---

## 🚨 Error Handling

- `401` → logout + redirect a `/login`
- `403` → vista Forbidden
- `404` → Not Found
- `500` → retry + toast

❌ No `console.log(error)`
✅ Mensajes claros al usuario

---

## 🎨 Estilos (Tailwind)

- No estilos inline
- Colores vía variables CSS
- Usar `clsx` para clases condicionales

---

## 🧪 Testing Guidelines

Actualmente no hay framework de testing configurado.

Si se agregan tests:

- Usar **Vitest**
- Colocar `*.test.tsx` cerca del archivo testeado
- Priorizar:
  - lógica de hooks
  - helpers
  - edge cases críticos

---

## 📦 Commits & Pull Requests

### Commits

- Mensajes cortos, imperativos

  ```
  add login form
  fix auth redirect
  ui: add sidebar
  ```

### Pull Requests

Un PR debe incluir:

- Descripción clara
- Contexto del cambio
- Screenshots si hay UI
- Verificación manual del flujo afectado

---

## ✅ Checklist antes de merge

- [ ] Respeta arquitectura por capas
- [ ] No duplica estado
- [ ] No introduce abstracciones prematuras
- [ ] Maneja errores correctamente
- [ ] No rompe auth
- [ ] Mantiene UX funcional

---

## 🧠 Regla Final

> Si dudas dónde poner algo,
> probablemente no debería existir todavía.
