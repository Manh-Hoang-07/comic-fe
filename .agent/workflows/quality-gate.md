---
workflow: quality-gate
description: Final quality gate before feature completion
enabled: true
---

# Quality Gate Workflow

Run this before marking a feature as done.

## 1. Rule Compliance Check
- Verify architecture placement (`src/app`, `Features`, `UI`, `lib/api`) is correct.
- Verify permission-sensitive actions are guarded (`can`, `canAny`, `canAll`).
- Verify API calls use centralized client and endpoint helpers.

## 2. UX and Error Safety
- Loading, empty, and failure states are visible and actionable.
- Form validation uses Zod + RHF, and API field errors are mapped.
- Success and failure feedback is shown via toast or inline message.

## 3. Data and Payload Safety
- Payload includes only expected fields.
- Nullable/default mappings are normalized for form and UI rendering.
- No hardcoded duplicated endpoints if helper already exists.

## 4. Definition of Done
- List/create/update/delete paths tested for the feature scope.
- No obvious TypeScript/runtime errors.
- Notes for edge cases and known limitations are captured.
