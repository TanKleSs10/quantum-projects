# Contributing Guide - Quantum Projects Frontend

Thanks for contributing to **Quantum Projects Frontend**.
This document defines **technical and style rules** to keep the project **clean, scalable, and maintainable**.

>  This is not an experimental project.
> Decisions here prioritize **clarity, security, and control**.

---

## Core principles

- The **backend is the source of truth**
- The frontend **does not replicate domain logic**
- Less abstraction is better than premature abstraction
- Explicit code > clever code
- Consistent UX is part of the product

---

## Overall architecture

The project follows a **layered** architecture with clear responsibilities:

```

pages  components  hooks  features  api

```

Absolute rule:
No layer can skip another.

---

## Folder structure

```txt
src/
 app/                # Bootstrap, router, providers
 pages/              # Views (route level)
 components/         # Reusable UI components
 features/           # Domain logic (API + hooks)
 store/              # Zustand (UI / session state)
 api/                # HTTP client and error handling
 hooks/              # Generic hooks
 types/              # Global types
 utils/              # Helpers
 styles/             # Global styles
```

---

## Code conventions

### React components

- **PascalCase**
- One component per file

```tsx
LoginPage.tsx;
ProjectTasksPage.tsx;
```

---

### Hooks

- Required `use` prefix
- camelCase

```ts
useAuth();
useProjects();
```

---

### Variables

- camelCase
- Semantic names

```ts
isAuthenticated;
selectedProjectId;
```

 `data`, `flag`, `res`

---

### Constants

- SCREAMING_SNAKE_CASE

```ts
DEFAULT_PAGE_SIZE;
AUTH_ROUTES;
```

---

### Types / Interfaces

- PascalCase
- No `I` prefix

```ts
User;
Project;
ApiResponse<T>;
```

---

## State and data

### Server state

- **TanStack Query**
- Cache, invalidation, refetch
- Examples:
  - teams
  - projects
  - tasks
  - user (`/users/me`) via `features/user`

 Do not use Zustand for backend data.

---

### Global UI state

- **Zustand**
- Only for:
  - layout
  - modals
  - session flags
  - visual state

 No tokens
 No domain data

---

### Interaction state

- `useState`
- Forms, toggles, inputs

---

## Authentication

- Tokens **do NOT** live in JavaScript

- Authentication based on `httpOnly` cookies

- Frontend validates session with:

  ```http
  GET /users/me
  ```

- Implementation: `features/user` (API + hooks).

- All requests use:

  ```ts
  credentials: "include";
  ```

---

## Features (rules)

Each feature must follow this structure:

```txt

features/projects/
 projects.api.ts
 projects.hooks.ts
 projects.types.ts

```

Rules:

-  No JSX
-  No UI state
-  Data logic only

---

## Forms

- React Hook Form + Zod
- One Zod schema per form
- Validation ALWAYS with resolver

```ts
const schema = z.object({
  email: z.string().email(),
});
```

---

## Error handling

- 401  logout + redirect
- 403  Forbidden UI
- 404  Not Found
- 500  retry + toast

 No `console.log(error)`
 Clear user messages

---

## Styles (Tailwind)

- No inline styles
- Colors via CSS variables
- Use `clsx` for conditionals

```tsx

className={clsx(
  'rounded-md px-4 py-2',
  isPrimary && 'bg-primary'
)}

```

---

## Imports

Required order:

1. External libraries
2. Absolute imports (`@/`)
3. Relative imports (`./`)

---

## Git workflow

Branch workflow:

- `main`  production
- `develop`  active development

Process:

1. Create a task branch from `develop`: `git checkout -b feat/dashboard`.
2. Commit small, focused changes with clear messages.
3. Rebase on `develop` before opening a PR if the branch is long-lived.
4. Open a PR targeting `develop` and describe the change clearly.

---

## Commit convention

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

## Validation schemas (Zod)

Validation schemas define user interaction rules.
They do not describe domain, do not replace DTOs, and do not live in types/.

Location

Schemas live in a dedicated folder:

src/
 schemas/
  auth/
   login.schema.ts
   register.schema.ts
   verifyEmail.schema.ts
   resetPassword.schema.ts
  projects/
   createProject.schema.ts
  tasks/
  createTask.schema.ts

---

## Rule

Schemas are grouped by feature / use case, not by technical type.

Naming conventions

Files

- kebab-case
- Required suffix `.schema.ts`

login.schema.ts
createProject.schema.ts

 schemaLoginValidation.ts
 loginValidation.ts

Exports

One main schema per file

Name in camelCase + Schema

export const loginSchema = z.object({ ... })

Derived types

Types are derived from the schema, not duplicated manually:

export type LoginSchema = z.infer<typeof loginSchema>

 Do not define parallel interfaces
 Do not repeat types in types/

Design rules

- One schema per form
- No complex conditional logic
- No backend-dependent validations
- No side-effects
- No imports of components, hooks, or API

The schema validates user input, not system state.

Relationship with backend

- Backend remains the source of truth
- Frontend schema:
  - validates format
  - improves UX
  - reduces invalid requests

 Do not duplicate critical domain rules
 Do not assume internal backend rules

Usage example

import { loginSchema } from '@/schemas/auth/login.schema'

const form = useForm<LoginSchema>({
  resolver: zodResolver(loginSchema),
})

---

## Schemas next to the component?

Only allowed if:

- The form is local and disposable
- It does not represent a product flow

Valid examples:

- filters
- searches
- temporary inputs
