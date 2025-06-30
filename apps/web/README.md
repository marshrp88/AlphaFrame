# 🚀 **AlphaFrame** - Financial Intelligence Platform

## ⚠️ **CRITICAL TECH STACK RESTRICTIONS**

**This project uses ONLY the following technologies:**
- ✅ **React** (with JSX)
- ✅ **Vanilla JavaScript** (ES6+)
- ✅ **Modular CSS** (with design tokens)
- ✅ **HTML5**

**The following technologies are EXPLICITLY FORBIDDEN:**
- ❌ **TypeScript** - Use vanilla JavaScript only
- ❌ **Tailwind CSS** - Use our design tokens and modular CSS only
- ❌ **Svelte** - Use React only
- ❌ **Any other CSS frameworks** - Use our custom design system only

**All components must use our design tokens defined in `src/styles/tokens.css` and follow the established patterns.**

---

## 📋 **Project Overview**

AlphaFrame is a comprehensive financial intelligence platform designed to provide users with advanced financial analysis, automated insights, and personalized recommendations. Built with modern web technologies and a focus on user experience, AlphaFrame helps users make informed financial decisions through data-driven insights and intuitive interfaces.

### **Key Features:**
- 🔐 **Secure Financial Data Integration** - Connect bank accounts securely via Plaid
- 📊 **Advanced Analytics Dashboard** - Real-time financial insights and trends
- 🤖 **AI-Powered Recommendations** - Personalized financial advice and suggestions
- 📱 **Mobile-First Design** - Responsive interface optimized for all devices
- 🔒 **Enterprise-Grade Security** - Bank-level encryption and data protection
- 🎯 **Personalized Experience** - Customizable dashboards and preferences

### **Current Status:**
- ✅ **Helios VX.3** - Production ready (COMPLETED)
- 🚀 **Phoenix Initiative V3.0** - Productization in progress
- 📈 **Galileo Initiative** - Future roadmap

---

## 🛠 **Technology Stack**

### **Frontend:**
- **Framework:** React 18+ (NO TypeScript, NO Svelte)
- **Styling:** Modular CSS with design tokens (NO Tailwind)
- **Build Tool:** Vite
- **Package Manager:** pnpm
- **Testing:** Jest + React Testing Library
- **Icons:** Lucide React

### **Backend Services:**
- **Authentication:** Custom auth system with JWT
- **Financial Data:** Plaid API integration
- **Encryption:** NaCl for secure data handling
- **Storage:** Local storage with encryption

### **Development Tools:**
- **Linting:** ESLint with custom rules
- **Formatting:** Prettier
- **Git Hooks:** Husky for pre-commit checks
- **Documentation:** JSDoc comments

---

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js 18+ 
- pnpm (recommended) or npm
- Modern web browser

### **Installation:**
```bash
# Clone the repository
git clone <repository-url>
cd AlphaFrame

# Install dependencies
pnpm install

# Set up environment variables
cp env.dev.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

### **Environment Variables:**
Create a `.env.local` file with the following variables:
```env
# Plaid Configuration
VITE_PLAID_CLIENT_ID=your_plaid_client_id
VITE_PLAID_SECRET=your_plaid_secret
VITE_PLAID_ENV=sandbox

# Application Configuration
VITE_APP_NAME=AlphaFrame
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📁 **Project Structure**

```
apps/web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Core UI components (Button, Card, Input, etc.)
│   │   ├── dashboard/      # Dashboard-specific components
│   │   └── framesync/      # FrameSync feature components
│   ├── features/           # Feature-specific components
│   │   ├── onboarding/     # Onboarding flow
│   │   ├── pro/           # AlphaPro features
│   │   └── status/        # Status and sync components
│   ├── pages/             # Page components
│   ├── lib/               # Utility functions and services
│   │   ├── services/      # API services and business logic
│   │   ├── store/         # State management
│   │   └── utils/         # Helper functions
│   ├── styles/            # Global styles and design tokens
│   └── tests/             # Test files
├── public/                # Static assets
├── docs/                  # Documentation
└── e2e/                   # End-to-end tests
```

---

## 🎨 **Design System**

AlphaFrame uses a comprehensive design system built with CSS custom properties (design tokens) for consistent styling across all components.

### **Design Tokens:**
- **Colors:** Semantic color palette with light/dark mode support
- **Typography:** Consistent font sizes, weights, and line heights
- **Spacing:** Standardized spacing scale
- **Shadows:** Elevation and depth system
- **Border Radius:** Consistent corner rounding

### **Component Library:**
- **Button:** Primary, secondary, and variant styles
- **Card:** Container components with consistent styling
- **Input:** Form inputs with validation states
- **Select:** Dropdown selection components
- **Progress:** Progress indicators and loading states
- **Dialog:** Modal and overlay components

### **Usage:**
All components use CSS classes that reference design tokens:
```css
.button {
  background-color: var(--color-primary-600);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}
```

---

## 🧪 **Testing**

### **Running Tests:**
```bash
# Unit tests
pnpm test

# Unit tests with coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e

# All tests
pnpm test:all
```

### **Test Structure:**
- **Unit Tests:** Component and utility function testing
- **Integration Tests:** Service and API integration testing
- **E2E Tests:** Full user journey testing
- **Accessibility Tests:** WCAG compliance verification

### **Test Coverage:**
- **Target:** >80% code coverage
- **Critical Paths:** 100% coverage required
- **Components:** All components must have tests
- **Services:** All business logic must be tested

---

## 📚 **Documentation**

### **Technical Documentation:**
- [Phoenix Initiative V3.0](./docs/PHOENIX_INITIATIVE_V3.0.md) - Productization plan
- [Development Guide](./docs/DEVELOPMENT.md) - Development setup and guidelines
- [Testing Guide](./TESTING_GUIDE.md) - Testing strategies and best practices
- [Component Library](./src/pages/DesignSystem.jsx) - Interactive component showcase

### **User Documentation:**
- [User Guide](./docs/USER_GUIDE.md) - Feature documentation
- [Onboarding Guide](./docs/ONBOARDING.md) - Getting started guide
- [FAQ](./docs/FAQ.md) - Common questions and answers

---

## 🔧 **Development Guidelines**

### **Code Standards:**
- **JavaScript:** ES6+ with modern syntax
- **React:** Functional components with hooks
- **CSS:** Modular CSS with design tokens
- **Naming:** Descriptive, consistent naming conventions
- **Comments:** JSDoc comments for all functions and components

### **Component Development:**
```jsx
/**
 * Component Name - Phoenix Initiative V3.1
 * 
 * Purpose: Brief description of component purpose
 * 
 * Procedure: 
 * 1. Step-by-step description of component logic
 * 2. Key implementation details
 * 3. Important considerations
 * 
 * Conclusion: Expected outcome and benefits
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './ComponentName.css';

const ComponentName = ({ 
  prop1, 
  prop2 = 'default',
  className = '',
  ...props 
}) => {
  return (
    <div className={cn('component-name', className)} {...props}>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### **CSS Guidelines:**
```css
/**
 * Component Styles - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent styling using design tokens
 * instead of Tailwind classes for better maintainability.
 * 
 * Procedure:
 * 1. Use CSS custom properties from tokens.css
 * 2. Define base styles with proper states
 * 3. Create variants and responsive behavior
 * 4. Support accessibility and dark mode
 * 
 * Conclusion: Centralized styling that maintains design system
 * consistency with vanilla CSS only.
 */

.component-name {
  /* Use design tokens for all values */
  background-color: var(--color-background-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

---

## 🚀 **Deployment**

### **Build Process:**
```bash
# Development build
pnpm build:dev

# Production build
pnpm build:prod

# Preview build
pnpm preview
```

### **Environment Configuration:**
- **Development:** Local development with hot reload
- **Staging:** Pre-production testing environment
- **Production:** Live application deployment

### **Deployment Checklist:**
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Performance optimized
- [ ] Accessibility verified
- [ ] Security audit completed

---

## 🤝 **Contributing**

### **Development Process:**
1. **Feature Branch:** Create feature branch from main
2. **Development:** Implement feature with tests
3. **Code Review:** Submit pull request for review
4. **Testing:** Ensure all tests pass
5. **Documentation:** Update relevant documentation
6. **Merge:** Merge after approval

### **Code Review Guidelines:**
- **Functionality:** Does the code work as expected?
- **Performance:** Are there any performance implications?
- **Accessibility:** Is the feature accessible?
- **Security:** Are there any security concerns?
- **Documentation:** Is the code well-documented?

---

## 📄 **License**

This project is proprietary software. All rights reserved.

---

## 📞 **Support**

For technical support or questions:
- **Documentation:** Check the docs folder
- **Issues:** Create an issue in the repository
- **Team:** Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Phoenix Initiative V3.0 - Phase 0 Complete
