---
rule: error-handling
description: Frontend error handling and fallback behavior
enabled: true
---

# Error Handling Standards (Frontend)

## General Rules
- Catch API errors at interaction boundaries (submit handlers, delete confirms, async loaders).
- Surface user-friendly messages via toast UI or inline form errors.
- Keep technical details for `console.error` only when needed for debugging.

## Form Errors
- Use Zod for client validation before API calls.
- When API returns field-level errors, map into `react-hook-form` via `setError`.
- Keep submit buttons disabled during `isSubmitting` or explicit loading state.

## Request Errors
- Handle common status codes:
  - 401: clear auth/session state and redirect to login through centralized client behavior.
  - 403: inform permission issue in UI flow.
  - 5xx: show generic fallback message and log useful context.
- Avoid swallowing errors silently in user actions.

## Rendering Safety
- Always protect UI with loading and empty-state fallback.
- Avoid assuming nested fields from API are always present.
