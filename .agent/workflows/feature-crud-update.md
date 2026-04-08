---
workflow: feature-crud-update
description: Workflow for update operation in shared form-based modals
enabled: true
---

# Update Workflow

## 1. Prepare
- Fetch existing record and hydrate form.
- Preserve immutable fields unless API explicitly allows update.

## 2. Submit
- Validate with shared schema.
- Call update endpoint helper (`update(id)` style).
- Send only expected fields and normalized values.

## 3. Feedback
- On success: success toast + close modal + refresh list.
- On error: inline field errors + fallback message.

## 4. Safety
- Keep current data visible when API fails to avoid user data loss.
