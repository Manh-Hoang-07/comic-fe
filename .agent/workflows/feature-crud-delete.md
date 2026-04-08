---
workflow: feature-crud-delete
description: Workflow for delete operation with confirmation modal
enabled: true
---

# Delete Workflow

## 1. Confirm
- Open confirm modal with enough context (name/id).
- Require explicit user confirmation before API call.

## 2. Execute
- Call delete endpoint from helper map.
- Handle loading state if delete can take noticeable time.

## 3. Feedback and Refresh
- On success: toast + close modal + refresh list.
- On failure: keep modal state predictable and show error message.

## 4. Safety
- Never perform delete directly from table click without confirmation.
