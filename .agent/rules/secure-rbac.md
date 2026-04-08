---
rule: secure-rbac
description: Client-side RBAC and group context constraints
enabled: true
---

# Secure RBAC and Context Rules (Client Side)

The frontend must respect both auth identity and active group context.

## Authorization Levels
1. Authenticated user context (token-based identity).
2. Group-scoped context via `selected_group_id` / `X-Group-Id`.
3. Permission-gated UI actions via user permissions in auth store.

## Implementation Rules
- Always use centralized API client to attach `Authorization` and `X-Group-Id`.
- Use auth store helpers (`can`, `canAny`, `canAll`) for permission-dependent UI actions.
- Hide/disable sensitive actions (create, update, delete, assign role) when permission is missing.
- Do not trust client checks as security boundary; backend remains source of truth.

## Group Context Safety
- Keep selected group lifecycle consistent on login/logout.
- Avoid direct request calls that bypass group-aware client configuration.
