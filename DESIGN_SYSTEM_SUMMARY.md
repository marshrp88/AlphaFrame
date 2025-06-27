# AlphaFrame VX.1 – Design System & Motion Summary

This document explains the visual and interaction standards that make AlphaFrame feel polished, modern, and trustworthy.

---

## 1. **Design Tokens**
- **What are they?**
  - Design tokens are variables for colors, spacing, typography, elevation, and more
  - Defined in `design-tokens.css` and used everywhere in the UI
- **Examples:**
  - `--color-primary`, `--color-surface`, `--spacing-lg`, `--font-size-xl`, `--radius-lg`
- **Why?**
  - Ensures every component looks and feels consistent
  - Makes it easy to update the look of the whole app from one place

---

## 2. **Visual Consistency**
- **All components** use the same spacing, color, and typography rules
- **No inline styles**—everything is token-driven
- **Reusable UI:** Buttons, cards, inputs, toasts, etc. are all built from the same base
- **Light & dark modes** supported by switching token values

---

## 3. **Motion & Animation**
- **Framer Motion** is used for all animations
- **Where you see motion:**
  - Page transitions (fade, slide)
  - Button presses (pulse, feedback)
  - Widget entry (staggered, animated in)
  - Loading spinners and progress bars
- **Why?**
  - Motion guides attention and makes the app feel alive
  - Animations are quick (under 300ms) and never block user actions
- **Accessible motion:**
  - Respects user "reduced motion" settings
  - No distracting or excessive animation

---

## 4. **Accessibility**
- **WCAG 2.1 AA compliant**
- **Keyboard navigation:** All interactive elements are reachable by tab
- **Color contrast:** Meets accessibility standards for readability
- **Screen reader support:** Uses semantic HTML and ARIA labels
- **Reduced motion:** Honors OS/browser settings for users who prefer less animation

---

## 5. **Responsive Design**
- **Works on desktop, tablet, and mobile**
- **Flexible layouts:** Grid and stack layouts adapt to screen size
- **Touch targets:** Buttons and controls are easy to tap on any device

---

**For more details, see `design-tokens.css`, component code, and the main README.** 