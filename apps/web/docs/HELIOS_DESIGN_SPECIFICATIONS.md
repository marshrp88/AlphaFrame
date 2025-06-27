# AlphaFrame VX.1 - Helios Design Specifications
## High-Fidelity Mockup Specifications for Figma Implementation

**Document Type:** Design Blueprint  
**Version:** X.1 (Figma-Ready)  
**Objective:** Create pixel-perfect mockups incorporating "Calm Confidence" emotional goal  
**Target Screens:** Narrative Dashboard, Guided Onboarding, Rules Page, Profile/Settings

---

## **Brand Foundation: "Calm Confidence"**

### **Emotional Goal**
- **Primary:** Calm, trustworthy, and reassuring
- **Secondary:** Confident, competent, and empowering
- **Avoid:** Flashy, overwhelming, or overly technical

### **Visual Language**
- **Colors:** Deep blues and greens (trust, stability) with warm accents (approachability)
- **Typography:** Clean, readable, with clear hierarchy
- **Spacing:** Generous whitespace for breathing room
- **Shadows:** Subtle depth without heaviness
- **Animations:** Smooth, purposeful, not distracting

---

## **Screen 1: Narrative Dashboard**

### **Layout Structure**
- **Header:** 80px height, centered title with subtitle
- **Hero Section:** 200px height, prominent "What's Next" card
- **Main Grid:** 3-column responsive grid (desktop) → 1-column (mobile)
- **Footer:** 60px height, subtle navigation

### **Hero Section ("What's Next")**
```
Background: Linear gradient (--color-primary-50 to --color-accent-50)
Border: 1px solid --color-primary-200
Border Radius: --radius-lg (16px)
Padding: --spacing-xl (32px)
Shadow: --shadow-light

Content Layout:
- Icon (64px circle, --color-surface background)
- Title (--font-size-2xl, --font-weight-semibold)
- Description (--font-size-md, --color-text-secondary)
- Action Button (--color-primary-500 background)
```

### **Dashboard Grid**
```
Grid Layout: repeat(auto-fit, minmax(300px, 1fr))
Gap: --spacing-xl (32px)
Cards: --color-surface background, --shadow-light
Border Radius: --radius-lg (16px)
Padding: --spacing-lg (24px)
```

### **Key Components**
1. **Financial Summary Card** (Full width)
   - 3-column grid of key metrics
   - Large numbers, small labels
   - Color-coded positive/negative values

2. **Quick Actions Card**
   - 2x2 grid of action buttons
   - Icons + labels
   - Hover effects with --shadow-medium

3. **Recent Activity Card**
   - List of 3 recent transactions
   - Icons for transaction types
   - Timestamps and amounts

### **Typography Hierarchy**
- **Page Title:** --font-size-3xl (36px), --font-weight-bold
- **Section Headers:** --font-size-lg (20px), --font-weight-semibold
- **Card Titles:** --font-size-md (16px), --font-weight-medium
- **Body Text:** --font-size-sm (14px), --font-weight-normal
- **Small Text:** --font-size-xs (12px), --font-weight-normal

---

## **Screen 2: Guided Onboarding Flow**

### **Progress Indicator**
```
Height: 8px
Background: --color-neutral-200
Active: --color-primary-500
Border Radius: --radius-full
Position: Top of screen, full width
```

### **Step Layout**
- **Container:** Centered, max-width 600px
- **Padding:** --spacing-2xl (48px) vertical, --spacing-xl (32px) horizontal
- **Background:** --color-surface
- **Border Radius:** --radius-xl (24px)
- **Shadow:** --shadow-medium

### **Step 1: Welcome**
```
Hero Image: 200px height, illustration of financial clarity
Title: "Welcome to AlphaFrame"
Subtitle: "Your journey to financial confidence starts here"
Description: 2-3 sentences about what AlphaFrame does
Primary Button: "Get Started"
Secondary Button: "Learn More"
```

### **Step 2: Connect Accounts**
```
Title: "Connect Your Financial Accounts"
Subtitle: "We'll help you see your complete financial picture"
Description: "Connect securely with your bank, credit cards, and investment accounts"
Account Types: Visual grid of account types (Banking, Credit Cards, Investments)
Security Note: "Bank-level security • Read-only access • Your data stays private"
Primary Button: "Connect Accounts"
Skip Option: "I'll do this later"
```

### **Step 3: Set Goals**
```
Title: "What are your financial goals?"
Subtitle: "We'll personalize your experience based on your priorities"
Goal Cards: 3-4 selectable goal cards
- Emergency Fund
- Debt Payoff
- Retirement Planning
- Home Purchase
- Investment Growth
Primary Button: "Continue"
Back Button: "Previous"
```

### **Step 4: Complete Setup**
```
Title: "You're all set!"
Subtitle: "Let's explore your financial dashboard"
Success Message: "Your accounts are connected and your goals are set"
Dashboard Preview: Small preview of what they'll see
Primary Button: "Go to Dashboard"
```

---

## **Screen 3: Rules Page**

### **Empty State (Primary View)**
```
Container: Centered, max-width 800px
Padding: --spacing-3xl (64px) vertical
Background: --color-surface
Border: 2px dashed --color-neutral-300
Border Radius: --radius-xl (24px)

Content:
- Icon: Settings gear (64px, --color-neutral-400)
- Title: "Create Your First Rule"
- Description: "Rules automatically monitor your finances and take action when conditions are met"
- Example: "Example: Transfer $500 to savings when checking balance exceeds $5,000"
- Primary Button: "Create Rule"
```

### **Rules List State**
```
Header: "FrameSync Rules" with "Create Rule" button
Rules Container: List of rule cards

Rule Card:
- Background: --color-surface
- Border: 1px solid --color-border
- Border Radius: --radius-lg (16px)
- Padding: --spacing-lg (24px)
- Shadow: --shadow-light

Card Content:
- Rule Name (--font-weight-semibold)
- Trigger Description (--color-text-secondary)
- Action Description (--color-text-secondary)
- Status Toggle (Enabled/Disabled)
- Edit/Delete Actions
```

### **Rule Creation Modal**
```
Modal Size: 600px width, auto height
Background: --color-surface
Border Radius: --radius-xl (24px)
Shadow: --shadow-heavy

Content:
- Header: "Create New Rule" with close button
- Form Fields:
  - Rule Name (text input)
  - Trigger Condition (dropdown + text)
  - Action (dropdown + text)
  - Frequency (radio buttons)
- Buttons: "Cancel" (secondary), "Create Rule" (primary)
```

---

## **Screen 4: Profile/Settings Page**

### **Profile Header**
```
Background: Linear gradient (--color-primary-50 to --color-accent-50)
Padding: --spacing-2xl (48px)
Border Radius: --radius-xl (24px) top only

Content:
- Avatar: 80px circle (user photo or initials)
- Name: --font-size-xl, --font-weight-semibold
- Email: --font-size-md, --color-text-secondary
- Verification Badge: "✓ Email Verified" (if applicable)
```

### **Settings Sections**
```
Section Layout: Grid, 2 columns (desktop) → 1 column (mobile)
Gap: --spacing-xl (32px)

Section Card:
- Background: --color-surface
- Border: 1px solid --color-border
- Border Radius: --radius-lg (16px)
- Padding: --spacing-xl (32px)
- Shadow: --shadow-light
```

### **Account Information Section**
```
Title: "Account Information"
Fields:
- Full Name (editable)
- Email Address (read-only)
- User ID (read-only, monospace font)
- Account Type (read-only)
```

### **Security Section**
```
Title: "Security & Privacy"
Options:
- Change Password
- Two-Factor Authentication (toggle)
- Session Management
- Privacy Settings
```

### **Preferences Section**
```
Title: "Preferences"
Options:
- Theme (Light/Dark/Auto)
- Notifications
- Language
- Currency
```

### **Actions Section**
```
Title: "Account Actions"
Buttons:
- "Manage Account" (secondary)
- "Logout" (destructive)
```

---

## **Component Specifications**

### **Buttons**
```
Primary Button:
- Background: --color-primary-500
- Text: --color-text-inverse
- Padding: --spacing-sm (12px) vertical, --spacing-lg (24px) horizontal
- Border Radius: --radius (8px)
- Font: --font-weight-medium

Secondary Button:
- Background: --color-surface
- Border: 1px solid --color-border
- Text: --color-text
- Same padding and border radius as primary

Destructive Button:
- Background: --color-border-error
- Text: --color-text-inverse
- Same padding and border radius as primary
```

### **Cards**
```
Standard Card:
- Background: --color-surface
- Border: 1px solid --color-border
- Border Radius: --radius-lg (16px)
- Padding: --spacing-lg (24px)
- Shadow: --shadow-light

Interactive Card:
- Same as standard + hover shadow: --shadow-medium
- Cursor: pointer
```

### **Form Elements**
```
Input Field:
- Border: 1px solid --color-border
- Border Radius: --radius (8px)
- Padding: --spacing-sm (12px)
- Focus Border: --color-primary-500
- Background: --color-surface

Label:
- Font: --font-weight-medium
- Color: --color-text-secondary
- Margin Bottom: --spacing-xs (8px)
```

---

## **Responsive Breakpoints**

### **Desktop (1200px+)**
- 3-column dashboard grid
- Side-by-side settings sections
- Full-width modals

### **Tablet (768px - 1199px)**
- 2-column dashboard grid
- Stacked settings sections
- Centered modals

### **Mobile (375px - 767px)**
- 1-column dashboard grid
- Full-width settings sections
- Full-screen modals
- Reduced padding and spacing

---

## **Animation Specifications**

### **Page Transitions**
```
Duration: 300ms
Easing: ease-in-out
Properties: opacity, transform
```

### **Card Hover Effects**
```
Duration: 200ms
Easing: ease-out
Properties: transform (translateY -2px), box-shadow
```

### **Button Interactions**
```
Duration: 150ms
Easing: ease-out
Properties: transform (scale 0.98)
```

---

## **Implementation Notes**

1. **Use Design Tokens:** All values should reference the existing design tokens
2. **Accessibility First:** Ensure proper contrast ratios and focus states
3. **Mobile First:** Design for mobile, then enhance for larger screens
4. **Consistent Spacing:** Use the spacing scale consistently
5. **Typography Scale:** Maintain clear hierarchy with the font size scale

This specification provides the complete blueprint for creating pixel-perfect Figma mockups that embody the "Calm Confidence" brand goal and serve as the definitive reference for all subsequent development work. 