# AGENTS.md - Developer Guidelines

This document provides guidelines for AI agents working in this Tauri + React codebase.

## Project Overview

- **Desktop Framework:** Tauri v2
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Validation:** Zod v4
- **Backend:** Rust (src-tauri)

## Build Commands

```bash
# Frontend development
npm run dev                    # Start Vite dev server

# Full Tauri development
npm run tauri dev              # Start Tauri app in dev mode

# Production builds
npm run build                  # TypeScript compile + Vite build
npm run tauri build            # Build Tauri desktop app

# Preview
npm run preview                # Preview production build
```

## Testing (Rust Backend)

```bash
# Run tests
cd src-tauri ; cargo test

# Coverage (Requires cargo-tarpaulin)
cd src-tauri ; cargo tarpaulin
```

**Note:** The Rust backend aims for 100% code coverage. For the frontend, no testing framework is configured yet.

## Code Style Guidelines

### Formatting (Prettier)

| Option          | Value                  |
| --------------- | ---------------------- |
| Indentation     | 4 spaces               |
| Semicolons      | No (`false`)           |
| Quotes          | Double (`"`)           |
| Trailing Commas | All                    |
| Import Sorting  | By length (descending) |

### TypeScript (Strict Mode)

- Always enable strict type checking
- Avoid `any`, use `unknown` when type is uncertain
- Use explicit return types for functions
- Prefer interfaces over types for object shapes

```typescript
// Good
interface User {
    id: string
    name: string
}

function getUser(id: string): User | null {
    // ...
}

// Avoid
function getUser(id: string): any {
    // ...
}
```

### Naming Conventions

| Type                  | Convention               | Example                                             |
| --------------------- | ------------------------ | --------------------------------------------------- |
| **Files** (all types) | kebab-case               | `user-profile.tsx`, `api-client.ts`, `constants.ts` |
| **Components**        | PascalCase               | `UserProfile.tsx`, `LoginForm.tsx`                  |
| **Functions**         | camelCase                | `getUserById()`, `handleSubmit()`                   |
| **Variables**         | camelCase                | `userData`, `isLoading`                             |
| **Constants**         | SCREAMING_SNAKE_CASE     | `API_BASE_URL`, `MAX_RETRY_COUNT`                   |
| **Interfaces/Types**  | PascalCase               | `User`, `ApiResponse` (no "I" prefix)               |
| **Enums**             | PascalCase               | `UserRole`, `HttpStatus`                            |
| **Enum values**       | SCREAMING_SNAKE_CASE     | `UserRole.ADMIN`, `HttpStatus.OK`                   |
| **React Hooks**       | camelCase (prefix "use") | `useAuth()`, `useUserData()`                        |
| **Custom hooks**      | camelCase (prefix "use") | `useAuth.ts`, `useFormValidation.ts`                |

### Imports

Imports are auto-sorted by line length (descending) via `@trivago/prettier-plugin-sort-imports`:

```typescript
// Third-party imports first, then local imports
import { useState, useEffect } from "react"
import { z } from "zod"

import { UserProfile } from "./components/user-profile"
import { Button } from "./components/ui/button"
```

### React Patterns

- Use functional components with hooks
- Use `useCallback` and `useMemo` sparingly (only when there's measurable performance benefit)
- Keep components small and focused
- Extract reusable logic into custom hooks
- Place contexts in `src/components/providers/`

### Error Handling

- Use Zod for runtime validation of external data (API responses, form inputs)
- Use try/catch for async operations
- Display user-friendly error messages
- Log errors appropriately for debugging

### Project Structure

```
src/
├── components/
│   ├── providers/     # React contexts
│   └── ui/            # Base UI components (shadcn/ui)
├── services/          # API calls and business logic
├── schemas/           # Zod validation schemas
├── types/             # Global TypeScript types
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

### Tailwind CSS

- Use Tailwind CSS 4 utility classes
- Keep custom CSS in component files or App.css
- Use semantic class names when possible

### Rust/Tauri

- Rust code lives in `src-tauri/`
- Use Tauri v2 plugins for system integration
- Follow standard Rust conventions (snake_case for functions/variables)

## Working with shadcn/ui

This project uses shadcn/ui for UI components. When adding new components:

1. Use the official CLI: `npx shadcn@latest add [component]`
2. Place components in `src/components/ui/`
3. Do NOT manually copy components from other projects

## Icons

Use `react-icons` with **Lucide** icons:

```typescript
import { LuUser, LuSettings } from "react-icons/lu"
```

## Pre-Commit Checklist

Before committing (if git is initialized):

1. Run `npm run format` to format code
2. Run `npm run lint` to check for errors
3. Ensure `npm run build` succeeds
4. Verify no secrets or keys are committed
