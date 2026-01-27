# Projects — Pending Use Cases

Este documento lista casos de uso que faltan para completar el módulo de Projects.

---

## Listado y navegación

- [ ] Listar proyectos sin `teamId` (todos mis proyectos)
  - Aporta: vista global para usuarios en múltiples equipos.
- [ ] Filtro por team en Projects UI (selector + carga por `teamId`)
  - Aporta: navegación cuando no existe endpoint "projects by user".
- [ ] Filtros básicos (status, tag, búsqueda por texto)
  - Aporta: encontrar proyectos rápido sin navegar por cada team.
- [ ] Paginación (page/limit o cursor)
  - Aporta: escalabilidad cuando el número de proyectos crece.

---

## Actualización y estados

- [ ] `PATCH /projects/:id` para update parcial
  - Aporta: evita enviar payload completo en cambios pequeños.
- [ ] Cambiar team del proyecto (si se permite)
  - Aporta: movilidad entre equipos o reorganización.

---

## Colaboración y metadata

- [ ] Tags con sugerencias o catálogo
  - Aporta: consistencia en clasificación.
- [ ] Roles por proyecto (si difieren del team)
  - Aporta: permisos más granulares.

---

## UX / Producto

- [ ] Vacíos + estados de error para listados y detalle
  - Aporta: experiencia clara cuando no hay datos.
- [ ] Guardar última vista/filtro
  - Aporta: continuidad para el usuario.
