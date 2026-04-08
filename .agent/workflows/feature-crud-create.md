---
workflow: feature-crud-create
description: Workflow for create operation in admin-style forms
enabled: true
---

# Create Workflow

## 1. Open and Initialize
- Open create modal with `createApi`.
- Initialize form defaults and enum/options data before submit.

## 2. Validate and Submit
- Validate client input with Zod + RHF.
- Submit via centralized api client.
- Normalize payload (remove empty optional values if API expects that).

## 3. Feedback
- On success: show success toast, close modal, refresh list.
- On error: map field errors to form and show fallback toast.

## 4. Guardrails
- Disable submit while processing.
- Keep cancel action responsive unless explicitly blocked.
