---
workflow: feature-crud-detail
description: Workflow for loading and handling detail/edit data
enabled: true
---

# Get One (Detail) Workflow

## 1. Trigger
- Open detail/edit modal with target info (`id`, `fetchApi`, `updateApi`).

## 2. Data Load
- Fetch by id via endpoint helper.
- Map response payload to form-friendly shape.
- Provide safe defaults for nullable/missing fields.

## 3. UI Handling
- Show modal loading while detail is being fetched.
- Keep modal closable on fetch failure and display clear error toast.

## 4. Output
- Pass normalized detail object into shared form component for editing.
