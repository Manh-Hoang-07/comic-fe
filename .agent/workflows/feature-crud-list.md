---
workflow: feature-crud-list
description: Workflow for implementing list/table CRUD page
enabled: true
---

# Get List Workflow

## 1. Data Hook and Endpoints
- Initialize list state via shared hook (`useListPage`) or equivalent.
- Bind `endpoint` from endpoint map (avoid hardcoded URL strings).

## 2. UI Structure
- Header with title and create button.
- Filter component connected to list filter updater.
- Table/list body with loading skeleton and empty-state row.
- Pagination component shown when data exists.

## 3. Actions
- Use action controls for edit/delete and optional domain actions.
- Keep action handlers pure and refresh list after successful mutations.

## 4. Quality Rules
- Never render stale loaders forever (always clear loading paths).
- Keep serial/index logic consistent with page + limit metadata.
