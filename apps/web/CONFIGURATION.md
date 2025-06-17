# AlphaFrame Configuration Guide

## Core Configuration Files

### vite.config.js
- **Purpose**: Main build configuration for Vite
- **Key Settings**:
  - React plugin for JSX support
  - Path aliases for clean imports
  - Development server settings

### .eslintrc.js
- **Purpose**: JavaScript linting rules
- **Key Settings**:
  - React and React Hooks rules
  - Accessibility rules (jsx-a11y)
  - Prettier integration
  - No TypeScript or Tailwind dependencies

### package.json
- **Purpose**: Project dependencies and scripts
- **Key Dependencies**:
  - React 18
  - React Router DOM
  - Zustand (state management)
- **Dev Dependencies**:
  - Vite
  - ESLint
  - Prettier
  - Testing libraries
  - Husky (git hooks)

## Development Environment

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- Git

### Environment Variables
- `.env` files for environment-specific settings
- Never commit sensitive data
- Use `.env.example` as a template

## Build and Test Configuration

### Development
```bash
pnpm dev        # Start development server
pnpm build      # Create production build
pnpm preview    # Preview production build
```

### Testing
```bash
pnpm test       # Run unit tests
pnpm lint       # Run linter
```

## Code Quality Tools

### ESLint
- JavaScript-only configuration
- React best practices
- Accessibility rules
- No TypeScript

### Prettier
- Code formatting
- Integration with ESLint
- Consistent style across the project

### Husky
- Pre-commit hooks
- Lint-staged integration
- Automated code quality checks

## State Management: Zustand

- **File:** `src/store/useAppStore.js`
- **Purpose:** Provides a simple global state store using Zustand.
- **Example State:** Counter with increment and reset actions.
- **Usage:**
  ```js
  import { useAppStore } from '@/store/useAppStore';
  const counter = useAppStore((state) => state.counter);
  const increment = useAppStore((state) => state.increment);
  ```
- **Notes:**
  - Zustand is used for global state management.
  - State logic is kept separate from UI components.

## Environment Variables

- **Files:** `.env`, `.env.example`
- **Purpose:** Store environment-specific settings (e.g., API URLs).
- **How to use:**
  1. Copy `.env.example` to `.env` in the project root.
  2. Fill in your actual values (e.g., `VITE_PUBLIC_API_URL`).
  3. Never commit `.env` with real secrets to version control.
- **Example:**
  ```env
  VITE_PUBLIC_API_URL=https://api.example.com
  ```
- **Notes:**
  - Vite exposes variables prefixed with `VITE_` to the client.
  - Use `import.meta.env.VITE_PUBLIC_API_URL` in your code to access the value.

## Important Notes
- NO TypeScript configuration
- NO Tailwind configuration
- NO Svelte configuration
- Pure JavaScript development
- React + Vite + Zustand stack 