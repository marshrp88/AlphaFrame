# AlphaFrame Figma Design System: Comprehensive Component Library

**Purpose:** Establish a complete, scalable design system that ensures consistency, efficiency, and quality across all AlphaFrame interfaces.

**Foundation:** Built on the "Calm Confidence" brand identity with focus on trust, clarity, and empowerment.

---

## **Design Tokens Foundation**

### **Color Tokens**

#### **Primary Colors**
```css
/* Primary Brand Colors */
--color-primary-50: #EFF6FF;
--color-primary-100: #DBEAFE;
--color-primary-200: #BFDBFE;
--color-primary-300: #93C5FD;
--color-primary-400: #60A5FA;
--color-primary-500: #3B82F6;
--color-primary-600: #2563EB;
--color-primary-700: #1D4ED8;
--color-primary-800: #1E40AF; /* Confidence Blue */
--color-primary-900: #1E3A8A;
--color-primary-950: #172554;
```

#### **Neutral Colors**
```css
/* Neutral Grays */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280; /* Calm Gray */
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
--color-gray-950: #030712;
```

#### **Semantic Colors**
```css
/* Success Colors */
--color-success-50: #ECFDF5;
--color-success-100: #D1FAE5;
--color-success-500: #10B981;
--color-success-600: #059669; /* Success Green */
--color-success-700: #047857;

/* Warning Colors */
--color-warning-50: #FFFBEB;
--color-warning-100: #FEF3C7;
--color-warning-500: #F59E0B;
--color-warning-600: #D97706; /* Warning Orange */
--color-warning-700: #B45309;

/* Error Colors */
--color-error-50: #FEF2F2;
--color-error-100: #FEE2E2;
--color-error-500: #EF4444;
--color-error-600: #DC2626; /* Error Red */
--color-error-700: #B91C1C;
```

### **Typography Tokens**

#### **Font Families**
```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
```

#### **Font Sizes**
```css
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;
--text-5xl: 48px;
```

#### **Font Weights**
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### **Line Heights**
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### **Spacing Tokens**
```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### **Border Radius Tokens**
```css
--radius-none: 0px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;
```

### **Shadow Tokens**
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## **Core Component Library**

### **1. Navigation Components**

#### **Primary Navigation Bar**
```figma
Component: Navigation/PrimaryNav
Properties:
- Variant: Default, Compact, Mobile
- State: Default, Hover, Active, Disabled
- Items: Dashboard, Rules, Profile
- Position: Top, Bottom (mobile)

Specifications:
- Height: 64px (desktop), 56px (mobile)
- Background: --color-gray-50
- Border: 1px solid --color-gray-200
- Typography: --text-base, --font-weight-medium
- Spacing: --space-4 between items
```

#### **Secondary Navigation**
```figma
Component: Navigation/SecondaryNav
Properties:
- Variant: Tabs, Breadcrumbs, Pagination
- State: Default, Hover, Active, Disabled
- Orientation: Horizontal, Vertical

Specifications:
- Height: 48px (tabs), 40px (breadcrumbs)
- Typography: --text-sm, --font-weight-medium
- Active indicator: 2px solid --color-primary-600
```

#### **Dropdown Menu**
```figma
Component: Navigation/DropdownMenu
Properties:
- Variant: Profile, Settings, Actions
- State: Closed, Open, Hover
- Position: Bottom-left, Bottom-right

Specifications:
- Background: --color-white
- Border: 1px solid --color-gray-200
- Shadow: --shadow-lg
- Border radius: --radius-lg
- Padding: --space-2
```

### **2. Button Components**

#### **Primary Button**
```figma
Component: Buttons/PrimaryButton
Properties:
- Size: Small, Medium, Large
- State: Default, Hover, Active, Disabled, Loading
- Icon: Left, Right, None
- Width: Auto, Full

Specifications:
- Background: --color-primary-600
- Text color: --color-white
- Typography: --text-sm, --font-weight-medium
- Padding: --space-3 --space-4 (medium)
- Border radius: --radius-md
- Height: 40px (medium)
```

#### **Secondary Button**
```figma
Component: Buttons/SecondaryButton
Properties:
- Size: Small, Medium, Large
- State: Default, Hover, Active, Disabled
- Variant: Outlined, Ghost, Text

Specifications:
- Background: Transparent
- Border: 1px solid --color-gray-300
- Text color: --color-gray-700
- Hover: --color-gray-50 background
```

#### **Icon Button**
```figma
Component: Buttons/IconButton
Properties:
- Size: Small (32px), Medium (40px), Large (48px)
- State: Default, Hover, Active, Disabled
- Icon: Any icon from icon library

Specifications:
- Square aspect ratio
- Icon size: 16px, 20px, 24px
- Border radius: --radius-md
```

### **3. Form Components**

#### **Text Input**
```figma
Component: Forms/TextInput
Properties:
- Size: Small, Medium, Large
- State: Default, Focus, Error, Disabled
- Type: Text, Email, Password, Number
- Icon: Left, Right, Both, None
- Helper text: Yes, No

Specifications:
- Height: 40px (medium)
- Border: 1px solid --color-gray-300
- Border radius: --radius-md
- Padding: --space-3
- Focus border: 2px solid --color-primary-500
- Error border: 2px solid --color-error-500
```

#### **Select Dropdown**
```figma
Component: Forms/Select
Properties:
- Size: Small, Medium, Large
- State: Default, Open, Disabled
- Multiple: Single, Multiple
- Search: Yes, No

Specifications:
- Same as TextInput for base styling
- Dropdown arrow: Chevron down icon
- Options list: Same styling as DropdownMenu
```

#### **Checkbox**
```figma
Component: Forms/Checkbox
Properties:
- Size: Small, Medium, Large
- State: Unchecked, Checked, Indeterminate, Disabled
- Label: Left, Right, None

Specifications:
- Size: 16px x 16px (medium)
- Border: 2px solid --color-gray-300
- Border radius: --radius-sm
- Checked background: --color-primary-600
- Check icon: White, 12px
```

#### **Radio Button**
```figma
Component: Forms/RadioButton
Properties:
- Size: Small, Medium, Large
- State: Unchecked, Checked, Disabled
- Group: Required for proper functionality

Specifications:
- Size: 16px x 16px (medium)
- Border: 2px solid --color-gray-300
- Border radius: 50%
- Checked dot: 6px, --color-primary-600
```

### **4. Card Components**

#### **Base Card**
```figma
Component: Cards/BaseCard
Properties:
- Size: Small, Medium, Large
- Variant: Default, Elevated, Outlined
- Padding: Compact, Normal, Relaxed
- Interactive: Yes, No

Specifications:
- Background: --color-white
- Border: 1px solid --color-gray-200 (outlined)
- Shadow: --shadow-sm (default), --shadow-md (elevated)
- Border radius: --radius-lg
- Padding: --space-4 (normal)
```

#### **Dashboard Card**
```figma
Component: Cards/DashboardCard
Properties:
- Type: Summary, Chart, Action, Status
- Size: Small, Medium, Large
- Interactive: Yes, No
- Header: Yes, No
- Footer: Yes, No

Specifications:
- Extends BaseCard
- Header: --space-4 padding, border-bottom
- Content: Flexible height
- Footer: --space-4 padding, border-top
```

#### **Rule Card**
```figma
Component: Cards/RuleCard
Properties:
- Status: Active, Inactive, Error
- Type: Savings, Investment, Budget, Custom
- Actions: Edit, Delete, Toggle, View

Specifications:
- Extends BaseCard
- Status indicator: Left border, 4px
- Status colors: --color-success-500, --color-gray-400, --color-error-500
- Action buttons: Right-aligned
```

### **5. Data Display Components**

#### **Data Table**
```figma
Component: DataDisplay/DataTable
Properties:
- Size: Compact, Normal, Relaxed
- Striped: Yes, No
- Sortable: Yes, No
- Selectable: Yes, No
- Pagination: Yes, No

Specifications:
- Header: --color-gray-50 background
- Border: 1px solid --color-gray-200
- Row height: 48px (normal)
- Typography: --text-sm
- Hover: --color-gray-50 background
```

#### **Status Badge**
```figma
Component: DataDisplay/StatusBadge
Properties:
- Variant: Success, Warning, Error, Info, Neutral
- Size: Small, Medium, Large
- Icon: Yes, No

Specifications:
- Background: Semantic color variants
- Text color: White or dark based on background
- Padding: --space-1 --space-2 (small)
- Border radius: --radius-full
- Typography: --text-xs, --font-weight-medium
```

#### **Progress Bar**
```figma
Component: DataDisplay/ProgressBar
Properties:
- Size: Small, Medium, Large
- Variant: Default, Success, Warning, Error
- Show percentage: Yes, No
- Animated: Yes, No

Specifications:
- Height: 4px (small), 8px (medium), 12px (large)
- Background: --color-gray-200
- Progress: --color-primary-600
- Border radius: --radius-full
```

### **6. Feedback Components**

#### **Alert**
```figma
Component: Feedback/Alert
Properties:
- Type: Success, Warning, Error, Info
- Variant: Default, Banner, Toast
- Dismissible: Yes, No
- Icon: Yes, No

Specifications:
- Background: Semantic color variants (light)
- Border: 1px solid semantic color
- Icon: 20px, semantic color
- Padding: --space-4
- Border radius: --radius-md
```

#### **Modal**
```figma
Component: Feedback/Modal
Properties:
- Size: Small, Medium, Large, Full
- Type: Confirmation, Form, Content
- Backdrop: Yes, No
- Close button: Yes, No

Specifications:
- Background: --color-white
- Shadow: --shadow-xl
- Border radius: --radius-lg
- Max width: 480px (small), 640px (medium), 768px (large)
- Backdrop: rgba(0, 0, 0, 0.5)
```

#### **Tooltip**
```figma
Component: Feedback/Tooltip
Properties:
- Position: Top, Bottom, Left, Right
- Size: Small, Medium, Large
- Trigger: Hover, Click, Focus

Specifications:
- Background: --color-gray-900
- Text color: --color-white
- Padding: --space-2 --space-3
- Border radius: --radius-md
- Shadow: --shadow-lg
- Max width: 240px
```

### **7. Layout Components**

#### **Container**
```figma
Component: Layout/Container
Properties:
- Size: Small, Medium, Large, Full
- Padding: None, Small, Normal, Large
- Background: None, Light, Dark

Specifications:
- Max width: 640px (small), 768px (medium), 1024px (large), 100% (full)
- Margin: Auto (centered)
- Padding: --space-4 (normal)
```

#### **Grid**
```figma
Component: Layout/Grid
Properties:
- Columns: 1, 2, 3, 4, 6, 12
- Gap: Small, Medium, Large
- Responsive: Yes, No

Specifications:
- Gap: --space-4 (medium)
- Auto-fit columns
- Responsive breakpoints
```

#### **Stack**
```figma
Component: Layout/Stack
Properties:
- Direction: Horizontal, Vertical
- Spacing: None, Small, Medium, Large
- Alignment: Start, Center, End, Stretch

Specifications:
- Gap: --space-2 (small), --space-4 (medium), --space-6 (large)
- Flex properties based on direction
```

---

## **Component States & Interactions**

### **State Definitions**
```figma
States for all interactive components:
- Default: Initial appearance
- Hover: Mouse over state
- Active/Pressed: Mouse down or touch
- Focus: Keyboard navigation
- Disabled: Non-interactive state
- Loading: Processing state
- Error: Error condition
- Success: Successful completion
```

### **Interaction Patterns**
```figma
Standard interactions:
- Hover: Subtle color or shadow change
- Active: Slight scale or color shift
- Focus: Clear outline or ring
- Loading: Spinner or skeleton
- Error: Red border and message
- Success: Green color and checkmark
```

---

## **Responsive Design System**

### **Breakpoints**
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### **Component Adaptations**
```figma
Mobile adaptations:
- Navigation: Bottom tab bar
- Cards: Full width, reduced padding
- Buttons: Larger touch targets (44px minimum)
- Forms: Stacked layout
- Tables: Horizontal scroll or card layout
```

---

## **Accessibility Standards**

### **Color Contrast**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- All semantic colors meet WCAG AA standards

### **Focus Indicators**
- Clear, visible focus rings
- Consistent focus behavior
- Keyboard navigation support

### **Screen Reader Support**
- Proper ARIA labels
- Semantic HTML structure
- Alternative text for images

---

## **Animation & Motion**

### **Duration Standards**
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### **Easing Curves**
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### **Animation Patterns**
- Fade in/out for modals and overlays
- Slide transitions for navigation
- Scale animations for buttons
- Smooth color transitions for state changes

---

## **Implementation Guidelines**

### **Figma Organization**
```
AlphaFrame Design System/
├── 🎨 Design Tokens/
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 🧩 Components/
│   ├── Navigation/
│   ├── Buttons/
│   ├── Forms/
│   ├── Cards/
│   ├── Data Display/
│   ├── Feedback/
│   └── Layout/
├── 📱 Pages/
│   ├── Dashboard
│   ├── Rules
│   ├── Profile
│   └── Onboarding
└── 📚 Documentation/
    ├── Usage Guidelines
    ├── Accessibility
    └── Best Practices
```

### **Component Naming Convention**
```
Category/ComponentName/Variant
Examples:
- Navigation/PrimaryNav/Default
- Buttons/PrimaryButton/Medium
- Forms/TextInput/Error
```

### **Version Control**
- Semantic versioning for design system
- Changelog for component updates
- Migration guides for breaking changes

---

This comprehensive design system provides the foundation for consistent, accessible, and scalable UI development across all AlphaFrame interfaces, ensuring the "Calm Confidence" brand experience is maintained throughout the user journey. 