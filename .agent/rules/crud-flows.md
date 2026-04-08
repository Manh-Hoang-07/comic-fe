---
rule: crud-flows
description: Standard CRUD UI behavior and lifecycle
enabled: true
---

# CRUD Flow Rules (Frontend)

Follow these rules for standardized CRUD UI behavior.

## 1. List
- Use a list management hook (such as `useListPage`) when available.
- Keep filters, pagination, loading, and empty states consistent.
- Centralize item actions in an `Actions`-style component where possible.

## 2. Detail
- Load details through endpoint helper (`show(id)` style) in edit/detail flows.
- Guard against missing fields and provide fallback rendering.

## 3. Create
- Use form component with Zod + RHF.
- Open via modal and close only after success.
- On success: show toast and refresh listing.

## 4. Update
- Fetch initial data before opening or on modal mount.
- Reuse the same form component as create when practical.
- Preserve unchanged data and only submit expected payload fields.

## 5. Delete
- Always confirm with a modal before delete.
- On success: show toast and refresh list.
- On failure: show API message fallback.

## Lifecycle Summary
- Before submit: validate + normalize values.
- During submit: disable controls and show loading state.
- After success: close modal + refresh + feedback.
- After failure: keep modal open + show actionable error.
