# Agent Config Guide

This folder defines project guidance for AI-assisted development.

## Structure
- `instructions.md`: entrypoint and navigation for the assistant.
- `rules/*.md`: coding and architecture constraints.
- `workflows/*.md`: step-by-step implementation playbooks.
- `knowledge/*.md`: shared assumptions about API/data shape.
- `rules/system-priority.md`: conflict resolution order for all rules.
- `workflows/quality-gate.md`: final checklist before feature completion.

## Toggle On/Off
- Each `rules/*.md` file has:
  - `rule`
  - `description`
  - `enabled: true|false`
- Each `workflows/*.md` file has:
  - `workflow`
  - `description`
  - `enabled: true|false`

Set `enabled: false` to temporarily disable a rule/workflow without removing it.

## Suggested Maintenance
- Keep one concern per file.
- Prefer short, concrete guidance.
- When adding a new feature domain, add:
  1. one rule (if new constraint is needed),
  2. one workflow (if repeatable process exists).
