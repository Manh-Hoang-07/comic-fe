---
rule: naming
description: Naming conventions for frontend codebase
enabled: true
---

# Naming Conventions

Follow these naming rules to keep the codebase predictable.

## Files and Directories
- Directories: PascalCase inside `Features` and `UI` trees if existing modules follow that style.
- Route files in `src/app`: Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Component files: PascalCase (`AdminUsers.tsx`, `UserForm.tsx`).
- Utility/store/api files: camel or kebab as existing local style requires (`authStore.ts`, `server-client.ts`).

## Components and Types
- React components: PascalCase.
- Interfaces and types: PascalCase.
- Props interfaces: `[ComponentName]Props`.

## Variables and Functions
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE for true constants and env-like values.
- Hook names: start with `use` and keep them action-oriented (`useListPage`, `useModal`).

## API Endpoints
- Group endpoint maps by domain (`adminEndpoints`, `publicEndpoints`, `userEndpoints`).
- Endpoint helpers should be deterministic and composable (e.g., `show(id)`, `update(id)`).
