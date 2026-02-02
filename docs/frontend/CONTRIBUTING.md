# Contributing Guide — Quantum Projects Frontend

Gracias por contribuir a **Quantum Projects Frontend**.  
Este documento define **las reglas técnicas y de estilo** que garantizan que el proyecto se mantenga **limpio, escalable y mantenible**.

> ⚠️ Este no es un proyecto experimental.  
> Las decisiones aquí priorizan **claridad, seguridad y control**.

---

## 🧠 Principios Fundamentales

- El **backend es la fuente de verdad**
- El frontend **no replica lógica de dominio**
- Menos abstracción es mejor que abstracción prematura
- Código explícito > código “inteligente”
- UX consistente es parte del producto

---

## 🏗️ Arquitectura General

El proyecto sigue una arquitectura **por capas**, con responsabilidades claras:

```

pages → components → hooks → features → api

```

📌 **Regla absoluta:**  
Ninguna capa puede saltarse a otra.

---

## 📁 Estructura de Carpetas

```txt
src/
├── app/                # Bootstrap, router, providers
├── pages/              # Vistas (nivel ruta)
├── components/         # Componentes UI reutilizables
├── features/           # Lógica por dominio (API + hooks)
├── store/              # Zustand (estado UI / sesión)
├── api/                # HTTP client y manejo de errores
├── hooks/              # Hooks genéricos
├── types/              # Tipos globales
├── utils/              # Helpers
├── styles/             # Estilos globales
```

---

## ✍️ Convenciones de Código

### Componentes React

- **PascalCase**
- Un componente por archivo

```tsx
LoginPage.tsx;
ProjectTasksPage.tsx;
```

---

### Hooks

- Prefijo obligatorio `use`
- camelCase

```ts
useAuth();
useProjects();
```

---

### Variables

- camelCase
- Nombres semánticos

```ts
isAuthenticated;
selectedProjectId;
```

❌ `data`, `flag`, `res`

---

### Constantes

- SCREAMING_SNAKE_CASE

```ts
DEFAULT_PAGE_SIZE;
AUTH_ROUTES;
```

---

### Tipos / Interfaces

- PascalCase
- Sin prefijo `I`

```ts
User;
Project;
ApiResponse<T>;
```

---

## 🔄 Estado y Datos

### Server State

- **TanStack Query**
- Cache, invalidación y refetch
- Ejemplos:
  - teams
  - projects
  - tasks
  - user (`/users/me`) via `features/user`

❌ No usar Zustand para datos del backend.

---

### UI State Global

- **Zustand**
- Solo para:
  - layout
  - modales
  - flags de sesión
  - estados visuales

❌ No tokens
❌ No datos de dominio

---

### Interaction State

- `useState`
- Formularios, toggles, inputs

---

## 🔐 Autenticación

- Tokens **NO** viven en JavaScript

- Autenticación basada en cookies `httpOnly`

- El frontend valida sesión con:

  ```http
  GET /users/me
  ```

- Implementación: `features/user` (API + hooks).

- Todas las requests usan:

  ```ts
  credentials: "include";
  ```

---

## 📡 Features (Reglas)

Cada feature debe tener esta estructura:

```txt

features/projects/
├── projects.api.ts
├── projects.hooks.ts
├── projects.types.ts

```

Reglas:

- ❌ Nada de JSX
- ❌ Nada de estado UI
- ✅ Solo lógica de datos

---

## 🧾 Formularios

- React Hook Form + Zod
- Un schema Zod por formulario
- Validación SIEMPRE con resolver

```ts
const schema = z.object({
  email: z.string().email(),
});
```

---

## 🚨 Manejo de Errores

- 401 → logout + redirect
- 403 → Forbidden UI
- 404 → Not Found
- 500 → retry + toast

❌ No `console.log(error)`
✅ Mensajes claros al usuario

---

## 🎨 Estilos (Tailwind)

- No estilos inline
- Colores vía variables CSS
- Usar `clsx` para condicionales

```tsx

className={clsx(
  'rounded-md px-4 py-2',
  isPrimary && 'bg-primary'
)}

```

---

## 📦 Imports

Orden obligatorio:

1. Librerías externas
2. Imports absolutos (`@/`)
3. Imports relativos (`./`)

---

## 🧩 Git Workflow (English)

Branch workflow:

- `main` → production
- `develop` → active development

Process:

1. Create a task branch from `develop`: `git checkout -b feat/dashboard`.
2. Commit small, focused changes with clear messages.
3. Rebase on `develop` before opening a PR if the branch is long-lived.
4. Open a PR targeting `develop` and describe the change clearly.

---

## ✅ Commit Convention (English)

Format:

```
type(scope): short summary
```

Examples:

```
feat(auth): add auth pages structure
fix(router): correct auth route paths
chore(docs): document git workflow
```

Rules:

- Use English, imperative mood.
- Keep summary under 72 characters.
- `type` must be one of: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

---

## Schemas de Validación (Zod)

Los schemas de validación definen reglas de interacción del usuario.
No describen dominio, no reemplazan DTOs, y no viven en types/.

📁 Ubicación

Los schemas viven en una carpeta dedicada:

src/
├── schemas/
│ ├── auth/
│ │ ├── login.schema.ts
│ │ ├── register.schema.ts
│ │ ├── verifyEmail.schema.ts
│ │ └── resetPassword.schema.ts
│ ├── projects/
│ │ └── createProject.schema.ts
│ └── tasks/
│ └── createTask.schema.ts

---

## Regla

Los schemas se agrupan por feature / caso de uso, no por tipo técnico.

🏷️ Naming conventions
Archivos

kebab-case

Sufijo obligatorio .schema.ts

login.schema.ts
createProject.schema.ts

❌ schemaLoginValidation.ts
❌ loginValidation.ts

Exports

Un schema principal por archivo

Nombre en camelCase + Schema

export const loginSchema = z.object({ ... })

Tipos derivados

Los tipos se derivan del schema, no se duplican manualmente:

export type LoginSchema = z.infer<typeof loginSchema>

❌ No definir interfaces paralelas
❌ No repetir tipos en types/

📐 Reglas de Diseño

Un schema por formulario

Sin lógica condicional compleja

Sin validaciones dependientes del backend

Sin side-effects

Sin imports de componentes, hooks o API

📌 El schema valida input del usuario, no estado del sistema.

🔄 Relación con Backend

El backend sigue siendo la fuente de verdad

El schema frontend:

valida formato

mejora UX

reduce requests inválidas

❌ No duplicar reglas críticas del dominio
❌ No asumir reglas internas del backend

🧩 Uso correcto (ejemplo)
import { loginSchema } from '@/schemas/auth/login.schema'

const form = useForm<LoginSchema>({
resolver: zodResolver(loginSchema),
})

---

## ¿Schemas junto al componente?

Solo permitido si:

El formulario es local y desechable

No representa un flujo del producto

Ejemplos válidos:

filtros

búsquedas

inputs temporales

Para auth, projects, tasks → SIEMPRE en schemas/

🚫 Anti-patrones

❌ Schemas en types/

❌ Schemas genéricos reutilizados para múltiples flujos

❌ Schemas “inteligentes” con lógica de negocio

❌ Un solo schema para login + register

🧠 Regla Clave

Types describen datos.
Schemas validan interacciones.
Nunca son intercambiables.

---

## 💬 Comentarios

- ❌ No comentar lo obvio
- ✅ Explicar **por qué**, no **qué**

---

## ✅ Checklist antes de un PR

- [ ] Cumple arquitectura por capas
- [ ] No duplica estado
- [ ] No introduce abstracciones innecesarias
- [ ] Maneja errores correctamente
- [ ] Respeta convenciones de nombres
- [ ] No rompe autenticación

---

## 🧠 Regla Final

> Si dudas dónde poner algo,
> probablemente no debería existir todavía.

---

Gracias por mantener **Quantum Projects Frontend** limpio y escalable 🚀
