---
rule: architecture
description: Frontend architecture and layering standards
enabled: true
---

# Frontend Architecture Standards (Next.js + Feature Components)

This document defines the expected frontend architecture. AI assistants should follow this structure when adding or updating features.

## 1. Layering by Responsibility
- `src/app/`: route entrypoints, metadata, and page composition.
- `src/components/Features/`: feature-specific UI and business interaction (admin/public/user).
- `src/components/UI/`: reusable generic UI building blocks (forms, feedback, data display, navigation).
- `src/lib/api/`: HTTP client, endpoint constants, and API modules (`admin`, `public`, `user`).
- `src/lib/store/`: global state slices (auth and shared state).
- `src/hooks/`: reusable logic (list pages, modal logic, UI/UX helpers).

## 2. Route Composition Rules
- Keep `src/app/**/page.tsx` thin: metadata + high-level composition.
- Move real logic into client components (for interactive pages).
- Prefer feature clients like `UsersClient` or `Admin*` component wrappers.

## 3. Feature CRUD Pattern
- Admin CRUD lives in `src/components/Features/**/Admin`.
- Typical set:
  - `Admin[Entity]s.tsx`: list page table + actions + modal orchestration.
  - `Create[Entity].tsx`, `Edit[Entity].tsx`: API bridge wrappers around form.
  - `[Entity]Form.tsx`: form UI + validation + controlled inputs.
- Reuse shared UI for actions, pagination, modal, confirm dialog, and skeleton loaders.

## 4. API Layer Rules
- Use `src/lib/api/client.ts` as the single axios source.
- Define endpoint paths in `src/lib/api/endpoints/*`.
- Do not hardcode duplicated URLs in components when endpoint helper exists.
- Keep auth token and `X-Group-Id` request behavior intact.

## 5. Forms and Validation
- Use `react-hook-form` with `zodResolver`.
- Keep schema close to form component.
- Map API field errors back to form fields (`setError`) when possible.

## 6. Data and Feedback
- Loading: always show skeleton/loading state for async views.
- Success/error feedback: use toast context where available.
- Keep optimistic assumptions minimal unless explicitly required.
