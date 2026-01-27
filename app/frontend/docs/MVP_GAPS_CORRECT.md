# Projects — Scope Definition (MVP vs v1)

Este documento define **qué entra y qué no entra** en el módulo **Projects** para el **MVP de Quantum Projects**.

El objetivo del MVP es que el sistema sea **usable en trabajo real**, no completo ni enterprise.

---

## 🎯 Principios de decisión

- El MVP debe ser **usable por una persona real**
- Se prioriza **claridad y flujo**, no flexibilidad extrema
- No se implementa nada que:
  - no desbloquee uso real
  - complique permisos prematuramente
  - requiera abstracciones tempranas

> Regla guía:  
> **Un MVP no es lo mínimo posible, es lo mínimo usable.**

---

## ✅ Funcionalidades incluidas en el MVP

### 📋 Listado y navegación

#### Listar todos mis proyectos (sin `teamId`)

- Vista global de proyectos del usuario
- Útil cuando el usuario pertenece a múltiples teams
- Reduce fricción mental y navegación excesiva

**Endpoint esperado**

```

GET /projects

```

**UI**

```

/projects → All projects

```

---

### 🔄 Actualización de proyectos

#### Update parcial del proyecto

- Permite modificar solo los campos necesarios
- Evita enviar payloads completos
- Mejora UX y DX

**Endpoint**

```

PATCH /projects/:id

```

---

### 🎨 UX básica (obligatorio)

#### Estados vacíos y de error

Incluye:

- No projects yet
- Loading states
- 401 / 403 / 404 / 500

Esto garantiza que el MVP se perciba **profesional**, no como demo.

---

## ⏳ Funcionalidades planeadas para v1

Estas funcionalidades **aportan valor**, pero **no bloquean** el uso real del MVP.

### 🔍 Filtros

- Por status
- Por tag
- Búsqueda por texto

---

### 🧭 Filtro por team en vista global

- Selector de team en `/projects`
- Útil cuando existen muchos equipos

---

### 🏷️ Tags con consistencia

- Catálogo o sugerencias
- Mejora clasificación cuando hay patrones reales

---

### 🧠 Persistencia de vistas

- Guardar último filtro o vista activa
- Mejora continuidad de uso

---

## ❌ Funcionalidades fuera de alcance (post-v1)

Estas funcionalidades **NO se implementan** en MVP ni v1 inicial.

### 📄 Paginación

- No necesaria con bajo volumen de proyectos
- Añade complejidad prematura

---

### 🔁 Cambiar team de un proyecto

- Complica permisos y ownership
- Riesgo de edge cases innecesarios

---

### 👥 Roles por proyecto

- Roles se heredan del team
- Permisos granulares vienen después

---

## 🧠 Decisión clave del MVP

> Un proyecto **nace y vive dentro de un team**.  
> La visibilidad global es solo una **vista**, no un cambio de ownership.

---

## ✅ Resultado esperado del MVP

El módulo Projects es exitoso si:

- El usuario puede trabajar en múltiples proyectos reales
- Puede ver todo su trabajo en un solo lugar
- Puede detectar estado y progreso sin fricción
- No necesita configuración avanzada para empezar

---

## 🧭 Regla final

> Si una funcionalidad no mejora la ejecución diaria del proyecto,
