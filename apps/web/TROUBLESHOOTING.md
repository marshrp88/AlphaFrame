# AlphaFrame Troubleshooting Guide

## Common Issues and Solutions

### Build Issues

#### Development Server Won't Start
1. Check if port 5173 is available
2. Verify Node.js version (18+ required)
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

#### Build Fails
1. Check for syntax errors
2. Verify all dependencies are installed
3. Clear build cache:
   ```bash
   pnpm clean
   pnpm install
   ```

### Dependency Issues

#### Package Installation Fails
1. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```
2. Delete lock file and reinstall:
   ```bash
   rm pnpm-lock.yaml
   pnpm install
   ```

#### Version Conflicts
1. Check package.json for correct versions
2. Ensure no TypeScript dependencies
3. Verify no Tailwind dependencies
4. Remove any Svelte-related packages

### Testing Issues

#### Tests Fail to Run
1. Check Vitest configuration
2. Verify test environment setup
3. Check for missing dependencies

#### Component Tests Fail
1. Verify component imports
2. Check for missing props
3. Ensure proper test setup

### Code Quality Issues

#### ESLint Errors
1. Run linter to identify issues:
   ```bash
   pnpm lint
   ```
2. Fix formatting issues:
   ```bash
   pnpm format
   ```

#### Prettier Conflicts
1. Check .prettierrc configuration
2. Run formatter:
   ```bash
   pnpm format
   ```

### Environment Issues

#### Environment Variables
1. Check .env file exists
2. Verify all required variables are set
3. Restart development server

#### API Connection Issues
1. Verify API endpoints
2. Check network connectivity
3. Verify authentication

## Development Environment

### VS Code Setup
1. Install recommended extensions:
   - ESLint
   - Prettier
   - React Developer Tools
2. Configure settings:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

### Git Issues

#### Branch Conflicts
1. Pull latest changes:
   ```bash
   git pull origin main
   ```
2. Resolve conflicts
3. Run tests after resolution

#### Commit Hooks Fail
1. Check Husky configuration
2. Verify lint-staged setup
3. Run pre-commit checks manually:
   ```bash
   pnpm lint
   pnpm test
   ```

## Performance Issues

### Slow Development Server
1. Check for large dependencies
2. Verify no TypeScript compilation
3. Monitor system resources

### Slow Build Times
1. Check for unnecessary dependencies
2. Verify build configuration
3. Consider build optimization

## Security Issues

### Dependency Vulnerabilities
1. Run security audit:
   ```bash
   pnpm audit
   ```
2. Update vulnerable packages
3. Verify no TypeScript or Tailwind in updates

### Environment Variables
1. Never commit .env files
2. Use .env.example as template
3. Verify sensitive data handling

## Getting Help

### Internal Resources
- Check CONFIGURATION.md
- Review DEVELOPMENT.md
- Search existing issues

### External Resources
- React Documentation
- Vite Documentation
- Zustand Documentation

## Best Practices

### Code Organization
- Follow component structure
- Keep state management clean
- Maintain proper file structure

### Testing
- Write tests for new features
- Maintain test coverage
- Run smoke tests regularly

### Documentation
- Update docs with changes
- Keep troubleshooting guide current
- Document new issues and solutions 