# Project Status Model Proposal

Motivation

The current project status model mixes lifecycle state with visibility state.
It uses a single `status` field to represent both workflow progression
(active, paused, completed) and visibility (archived). This makes it hard
(or impossible) to express some common transitions, such as reopening a
completed project without unarchiving it, or hiding a completed project
without changing its lifecycle state.

Proposed model

Use two concerns:

- `status`: `active | paused | completed`
- `archived`: boolean

This keeps lifecycle and visibility separate and easier to reason about.

Proposed endpoints

- `PATCH /projects/:id/pause` -> toggle `active` <-> `paused`
- `PATCH /projects/:id/complete` -> set `status = completed`
- `PATCH /projects/:id/reopen` -> set `status = active`
- `PATCH /projects/:id/archive` -> toggle `archived` flag

Frontend behavior

- Show `Archive` or `Restore` based on `archived`.
- Show `Reopen project` when `status = completed`.
- Keep `Pause/Resume` based on `status`.

Notes

- This proposal reduces inconsistencies and makes the API clearer.
- Implemented in backend (status + archived flag + reopen).
