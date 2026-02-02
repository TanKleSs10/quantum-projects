# Task Status Transitions Note

Current behavior

The backend enforces strict transitions in `TaskStatus`:

- todo -> in_progress | blocked | done
- in_progress -> blocked | done
- blocked -> in_progress | done
- done -> (no transitions)

This produces 400 errors like `Invalid task status transition` when the UI
allows moving back to earlier states (e.g. done -> in_progress).

Recommendation (MVP)

Most project management tools allow reversing task status (reopen tasks).
For MVP usability, allow flexible transitions (or at least allow returning
from done to in_progress/todo).

Next steps

- Decide policy:
  - Strict transitions (keep backend, restrict UI options)
  - Flexible transitions (relax backend rules)

- If flexible is chosen, update the backend TaskStatus transitions to allow
  backward moves and add tests for allowed transitions.
