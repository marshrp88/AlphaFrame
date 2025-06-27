# AlphaFrame VX.1 - Figma Component Specifications
**Based on Implemented Design System**

**Purpose:** Provide exact specifications for creating 1:1 matching components in Figma based on the implemented AlphaFrame design system.

**Version:** X.1 (Final Implementation)
**Date:** Generated from live codebase

---

## Design Tokens Foundation

### Color Palette
```css
/* Primary Colors */
--color-primary-50: #EFF6FF
--color-primary-100: #DBEAFE
--color-primary-200: #BFDBFE
--color-primary-300: #93C5FD
--color-primary-400: #60A5FA
--color-primary-500: #3B82F6
--color-primary-600: #2563EB
--color-primary-700: #1D4ED8
--color-primary-800: #1E40AF
--color-primary-900: #1E3A8A

/* Neutral Colors */
--color-gray-50: #F9FAFB
--color-gray-100: #F3F4F6
--color-gray-200: #E5E7EB
--color-gray-300: #D1D5DB
--color-gray-400: #9CA3AF
--color-gray-500: #6B7280
--color-gray-600: #4B5563
--color-gray-700: #374151
--color-gray-800: #1F2937
--color-gray-900: #111827

/* Semantic Colors */
--color-success-500: #10B981
--color-success-600: #059669
--color-warning-500: #F59E0B
--color-warning-600: #D97706
--color-error-500: #EF4444
--color-error-600: #DC2626

/* Surface Colors */
--color-surface: #FFFFFF
--color-background-secondary: #F9FAFB
--color-border-primary: #E5E7EB
--color-border-secondary: #F3F4F6
```

### Typography
```css
/* Font Family */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

/* Font Sizes */
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 30px

/* Font Weights */
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

/* Line Heights */
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.625
```

### Spacing
```css
--space-0: 0px
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### Border Radius
```css
--radius-none: 0px
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px
--radius-xl: 12px
--radius-2xl: 16px
--radius-full: 9999px
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

---

## Component Specifications

### 1. CompositeCard Component

#### Base Card (Default Variant)
- **Width:** Auto (flexible)
- **Height:** Auto (content-based)
- **Background:** #FFFFFF
- **Border:** 1px solid #E5E7EB
- **Border Radius:** 8px
- **Box Shadow:** 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **Padding:** 24px
- **Margin:** 0 0 16px 0

#### Elevated Variant
- **Background:** #FFFFFF
- **Border:** 1px solid #E5E7EB
- **Box Shadow:** 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- **All other properties:** Same as default

#### Outlined Variant
- **Background:** #FFFFFF
- **Border:** 2px solid #E5E7EB
- **Box Shadow:** None
- **All other properties:** Same as default

#### Card Header
- **Display:** Flex
- **Align Items:** Flex-start
- **Gap:** 16px
- **Margin Bottom:** 16px

#### Card Icon
- **Width:** 24px
- **Height:** 24px
- **Color:** #2563EB (Primary-600)
- **Font Size:** 18px
- **Display:** Flex
- **Align Items:** Center
- **Justify Content:** Center

#### Card Title
- **Font Family:** Inter
- **Font Size:** 18px
- **Font Weight:** 600 (Semibold)
- **Color:** #111827 (Gray-900)
- **Line Height:** 1.25
- **Margin:** 0 0 4px 0

#### Card Subtitle
- **Font Family:** Inter
- **Font Size:** 14px
- **Font Weight:** 400 (Normal)
- **Color:** #6B7280 (Gray-500)
- **Line Height:** 1.5
- **Margin:** 0

#### Interactive States
- **Hover:** 
  - Box Shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
  - Transform: translateY(-1px)
- **Focus:**
  - Outline: 2px solid #3B82F6 (Primary-500)
  - Outline Offset: 2px
- **Active:**
  - Transform: translateY(0)
  - Box Shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)

---

### 2. StyledButton Component

#### Primary Button (Default)
- **Display:** Inline-flex
- **Align Items:** Center
- **Justify Content:** Center
- **Font Family:** Inter
- **Font Weight:** 500 (Medium)
- **Font Size:** 16px
- **Line Height:** 1.5
- **Background:** #2563EB (Primary-600)
- **Color:** #FFFFFF
- **Border:** None
- **Border Radius:** 6px
- **Box Shadow:** 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **Padding:** 12px 16px
- **Min Width:** 40px
- **Min Height:** 40px
- **Cursor:** Pointer

#### Button Sizes
- **Small (sm):**
  - Font Size: 14px
  - Padding: 8px 12px
  - Min Width: 32px
  - Min Height: 32px
- **Medium (md):** Default values
- **Large (lg):**
  - Font Size: 18px
  - Padding: 16px 24px
  - Min Width: 48px
  - Min Height: 48px

#### Button Variants
- **Primary:**
  - Background: #2563EB
  - Color: #FFFFFF
  - Hover: #1D4ED8 (Primary-700)
  - Active: #1E40AF (Primary-800)
- **Secondary:**
  - Background: #FFFFFF
  - Color: #1D4ED8 (Primary-700)
  - Border: 1px solid #BFDBFE (Primary-200)
  - Hover: #EFF6FF (Primary-50)
  - Active: #DBEAFE (Primary-100)
- **Icon:**
  - Background: Transparent
  - Color: #1D4ED8 (Primary-700)
  - Padding: 8px
  - Min Width: 32px
  - Min Height: 32px
  - Border Radius: 50%

#### Button States
- **Disabled:**
  - Background: #E5E7EB (Gray-200)
  - Color: #9CA3AF (Gray-400)
  - Cursor: Not-allowed
  - Box Shadow: None
- **Loading:**
  - Opacity: 0.7
  - Pointer Events: None
- **Focus:**
  - Outline: 2px solid #3B82F6 (Primary-500)
  - Outline Offset: 2px

#### Button Icon
- **Display:** Inline-flex
- **Align Items:** Center
- **Justify Content:** Center
- **Font Size:** 1.25em
- **Line Height:** 1
- **Margin Left/Right:** 8px (when positioned)

---

### 3. Form Components

#### Form Input
- **Width:** 100%
- **Padding:** 16px
- **Border:** 1px solid #E5E7EB
- **Border Radius:** 6px
- **Font Size:** 16px
- **Font Family:** Inter
- **Background:** #FFFFFF
- **Color:** #111827
- **Focus:**
  - Border Color: #3B82F6 (Primary-500)
  - Box Shadow: 0 0 0 3px #EFF6FF (Primary-50)
- **Error:**
  - Border Color: #EF4444 (Error-500)
  - Box Shadow: 0 0 0 3px #FEF2F2 (Error-50)

#### Form Label
- **Display:** Block
- **Font Size:** 14px
- **Font Weight:** 500 (Medium)
- **Color:** #111827 (Gray-900)
- **Margin Bottom:** 8px
- **Font Family:** Inter

#### Form Error
- **Font Size:** 14px
- **Color:** #DC2626 (Error-600)
- **Margin Top:** 4px
- **Font Weight:** 500 (Medium)

---

### 4. Navigation Components

#### NavBar
- **Width:** 100%
- **Background:** #F9FAFB (Gray-50)
- **Border Bottom:** 1px solid #E5E7EB (Gray-200)
- **Font Family:** Inter
- **Font Size:** 16px
- **Font Weight:** 500 (Medium)
- **Height:** 64px (Desktop), 56px (Mobile)

#### NavBar List
- **Display:** Flex
- **Flex Direction:** Row
- **Align Items:** Center
- **Gap:** 16px
- **Padding:** 0 24px
- **Height:** 64px

#### NavBar Link
- **Display:** Flex
- **Align Items:** Center
- **Color:** #1D4ED8 (Primary-700)
- **Padding:** 8px 12px
- **Border Radius:** 6px
- **Text Decoration:** None
- **Hover:**
  - Background: #EFF6FF (Primary-50)
  - Color: #1E40AF (Primary-800)
- **Active:**
  - Background: #DBEAFE (Primary-100)
  - Color: #1E3A8A (Primary-900)
  - Font Weight: 600 (Semibold)

---

## Responsive Breakpoints

- **Mobile:** 375px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

## Dark Mode Support

### Dark Mode Colors
```css
/* Dark Mode Surface Colors */
--color-surface-dark: #1F2937
--color-background-secondary-dark: #111827
--color-border-primary-dark: #374151
--color-text-primary-dark: #F9FAFB
--color-text-secondary-dark: #D1D5DB
```

### Dark Mode Component Adjustments
- **CompositeCard:** Background changes to #1F2937
- **StyledButton:** Primary background changes to #3B82F6
- **Form Inputs:** Background changes to #1F2937, border to #374151
- **Navigation:** Background changes to #111827

---

## Accessibility Guidelines

### Focus States
- **Focus Outline:** 2px solid #3B82F6 (Primary-500)
- **Focus Offset:** 2px
- **Focus Visible:** Only on keyboard navigation

### Color Contrast
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text:** Minimum 3:1 contrast ratio
- **Interactive Elements:** Minimum 3:1 contrast ratio

### Screen Reader Support
- **ARIA Labels:** Provided for all interactive elements
- **ARIA Roles:** Proper semantic roles assigned
- **ARIA States:** Loading, disabled, expanded states communicated

---

## Animation Specifications

### Transitions
- **Duration:** 200ms (0.2s)
- **Easing:** ease-in-out
- **Properties:** background, color, box-shadow, border-color, transform

### Hover Effects
- **Cards:** translateY(-1px) with shadow increase
- **Buttons:** Background color change with shadow increase
- **Links:** Background color change

### Loading States
- **Spinner:** 1s linear infinite rotation
- **Shimmer:** 1.5s linear infinite horizontal movement

---

## Implementation Notes

1. **Font Loading:** Ensure Inter font is loaded before component rendering
2. **Icon System:** Use consistent icon sizing (24px for card icons, 16px for button icons)
3. **Spacing:** Maintain consistent spacing using the defined space tokens
4. **Color Usage:** Use semantic color tokens for different states and contexts
5. **Responsive Design:** Implement mobile-first approach with progressive enhancement
6. **Accessibility:** Ensure all interactive elements are keyboard accessible
7. **Performance:** Use CSS custom properties for theme switching without re-renders

---

*This specification is based on the actual implemented code and design tokens. All values are extracted from the live CSS files and represent the current state of the AlphaFrame design system.* 