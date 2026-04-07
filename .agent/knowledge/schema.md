# API Schema and Data Access Notes (Frontend)

This frontend assumes a consistent API response envelope and endpoint grouping.

## 1. Response Envelope (Typical)
- `success`: boolean status.
- `data`: payload object/array.
- `message`: user-displayable or debug message.
- `errors`: optional field-level errors for forms.

## 2. Pagination Shape (Typical List Views)
- Data list + metadata for page, limit, total.
- UI components expect enough metadata to compute serial number and page navigation.

## 3. Context Headers
- `Authorization: Bearer <token>` set by central axios client.
- `X-Group-Id` injected from selected group context.

## 4. Endpoint Grouping
- `adminEndpoints`: admin CRUD and protected operations.
- `publicEndpoints`: public read-focused data.
- `userEndpoints`: authenticated user operations.

## 5. Frontend Mapping Rules
- Normalize nullable values before binding to forms.
- Convert API enum payloads into `{ value, label }` for select components.
- Prefer endpoint helpers over duplicated path strings.
