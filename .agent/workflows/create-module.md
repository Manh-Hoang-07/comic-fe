---
workflow: create-module
description: Create a new frontend feature module with consistent CRUD structure
enabled: true
---

# Create New Module Workflow

Use this workflow to scaffold a new feature in the current frontend style.

## 1. Decide Scope
- Identify audience: `admin`, `public`, or `user`.
- Confirm route location under `src/app`.
- Confirm feature component location under `src/components/Features`.

## 2. Create Route Entry
- Add `page.tsx` under the correct route segment.
- Keep route file minimal: metadata + compose client/feature component.

## 3. Create Feature Components
- For admin CRUD, create:
  - `Admin[Entity]s.tsx`
  - `Create[Entity].tsx`
  - `Edit[Entity].tsx`
  - `[Entity]Form.tsx`
- Reuse `Modal`, `ConfirmModal`, `Pagination`, `Actions`, `SkeletonLoader`.

## 4. Wire API Endpoints
- Add endpoint constants/helpers in `src/lib/api/endpoints/*` if missing.
- Use centralized api client from `src/lib/api/client.ts`.

## 5. Form and Validation
- Add Zod schema in form component.
- Use RHF + `zodResolver`.
- Handle API field errors through `setError`.

## 6. Verify Behavior
- List: load, filter, paginate, empty state.
- Create/update/delete: success and failure feedback.
- Permission-sensitive actions follow auth store checks.
