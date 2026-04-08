---
rule: system-priority
description: Rule priority and conflict resolution order
enabled: true
---

# System Rule Priority

Use this order when guidance conflicts:

1. Security and context integrity (`secure-rbac`).
2. Architecture boundaries (`architecture`).
3. Error handling and UX safety (`error-handling`).
4. CRUD behavior consistency (`crud-flows`).
5. Naming and stylistic consistency (`naming`).

## Resolution Rules
- Never violate auth/group header and permission constraints for convenience.
- Prefer refactor over bypass when architecture and speed conflict.
- If a rule must be intentionally broken, document reason in PR/task note.
