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

## Important Notes
- NO TypeScript configuration
- NO Tailwind configuration
- NO Svelte configuration
- Pure JavaScript development
- React + Vite + Zustand stack 