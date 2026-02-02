# Backend Gaps (Frontend Expectations)

Current frontend references features that do not yet have backend support.

## Dashboard

- Team activity feed
  - No endpoint for recent activity or events.
  - Placeholder: `Team activity` card shows empty state.

## Projects

- Project status model is mixed (lifecycle + visibility).
  - Proposal documented in `docs/PROJECT_STATUS_NOTE.md`.

## Tasks

- Task status transitions are strict (no reopen/backwards).
  - Proposal documented in `docs/TASK_STATUS_NOTE.md`.

## Misc

- Task assignee display relies on team member data.
  - Works now via `GET /teams/:id` and `GET /teams/:id/members`.
