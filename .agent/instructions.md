# Agent Instructions - Comic Frontend Project

Welcome. You are assisting in the development of a Next.js frontend for a comic/content platform.

## Project Context
- Framework: Next.js App Router (React + TypeScript)
- Styling: Tailwind CSS
- Data Fetching: Axios client + modular endpoint map
- Forms: React Hook Form + Zod
- State: Zustand (auth and shared UI state)
- Auth/Context: JWT token + group context (`X-Group-Id`) sent from client

## Core Principles
1. Consistency first: follow existing feature patterns under `src/components/Features/*`.
2. UX safety: preserve loading states, toast feedback, and modal lifecycle behavior.
3. Type safety: keep strict types for forms, API payloads, and component props.
4. Context-aware requests: do not break auth token and group header behavior in API client.

## Navigating the Project
- See `rules/architecture.md` for structure and layering guidelines.
- See `rules/naming.md` for naming conventions.
- See `rules/error-handling.md` for frontend error handling standards.
- See `rules/secure-rbac.md` for permission and context behavior on the client.
- See `rules/crud-flows.md` for standardized CRUD UI implementation.
- See `rules/system-priority.md` for rule conflict resolution order.
- Detailed workflows:
  - `workflows/feature-crud-list.md`
  - `workflows/feature-crud-detail.md`
  - `workflows/feature-crud-create.md`
  - `workflows/feature-crud-update.md`
  - `workflows/feature-crud-delete.md`
  - `workflows/create-module.md`
  - `workflows/quality-gate.md`
- Use `knowledge/schema.md` to align with API response and pagination assumptions.

## Rule and Workflow Toggle
- Rules in `rules/*.md` support `enabled: true/false` in frontmatter.
- Workflows in `workflows/*.md` support `enabled: true/false` in frontmatter.
- Keep files in place and toggle the flag instead of deleting guidance.

## Communication Style
- Be concise and technical.
- Propose implementation plan before major multi-file changes.
- Prefer small, safe refactors over broad rewrites.
