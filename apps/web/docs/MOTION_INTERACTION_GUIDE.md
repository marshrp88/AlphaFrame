# AlphaFrame VX.1 - Motion & Interaction Guide
## Comprehensive Animation Specifications for "Calm Confidence" Brand

**Document Type:** Motion & Interaction Guide  
**Version:** X.1 (Implementation-Ready)  
**Objective:** Document timing, easing, and style for all core animations  
**Brand Goal:** Smooth, purposeful, not distracting - embodying "Calm Confidence"

---

## **Motion Philosophy**

### **Core Principles**
- **Purposeful:** Every animation serves a clear functional purpose
- **Calm:** Smooth, unhurried movements that don't create anxiety
- **Confident:** Assured, deliberate transitions that build trust
- **Accessible:** Respect user motion preferences and reduce motion when needed

### **Emotional Goals**
- **Trust:** Consistent, predictable animations that don't surprise users
- **Clarity:** Animations that guide attention and improve understanding
- **Delight:** Subtle moments of joy without being distracting
- **Professional:** Polished, refined movements that convey competence

---

## **Animation Timing & Easing**

### **Standard Timing Scale**
```
Fast: 150ms    - Micro-interactions, button presses
Base: 200ms    - Standard transitions, hover effects
Slow: 300ms    - Page transitions, card animations
Slower: 500ms  - Complex animations, entrance effects
```

### **Easing Curves**
```
Standard: cubic-bezier(0.4, 0, 0.2, 1)     - Most transitions
Ease Out: cubic-bezier(0, 0, 0.2, 1)       - Entrances, reveals
Ease In: cubic-bezier(0.4, 0, 1, 1)        - Exits, dismissals
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Success states, celebrations
```

### **Implementation with CSS Variables**
```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0, 0, 0.2, 1);
  --transition-slower: 500ms cubic-bezier(0, 0, 0.2, 1);
}
```

---

## **Page-Level Animations**

### **Page Entrance**
```
Duration: 300ms
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), transform (translateY 20px → 0)
Stagger: 100ms delay between sections
```

**Implementation:**
```javascript
const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
};
```

### **Page Exit**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 1, 1)
Properties: opacity (1 → 0), transform (translateY 0 → -10px)
```

### **Section Stagger**
```
Container: 100ms delay between children
Children: 50ms delay between each child
Duration: 300ms per child
Easing: cubic-bezier(0, 0, 0.2, 1)
```

---

## **Component-Level Animations**

### **Card Animations**

#### **Card Entrance**
```
Duration: 300ms
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), scale (0.95 → 1)
Stagger: 100ms between cards
```

#### **Card Hover**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: transform (translateY 0 → -2px), box-shadow (light → medium)
```

#### **Card Press**
```
Duration: 150ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: transform (scale 1 → 0.98)
```

### **Button Animations**

#### **Button Hover**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: background-color, transform (translateY 0 → -1px)
```

#### **Button Press**
```
Duration: 150ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: transform (scale 1 → 0.98)
```

#### **Button Loading**
```
Duration: 1000ms (infinite)
Easing: linear
Properties: transform (rotate 0deg → 360deg)
```

### **Form Element Animations**

#### **Input Focus**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: border-color, box-shadow
```

#### **Input Error**
```
Duration: 300ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Properties: transform (translateX 0 → -5px → 5px → 0)
```

#### **Input Success**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: border-color, background-color
```

---

## **Modal & Overlay Animations**

### **Modal Entrance**
```
Duration: 300ms
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), scale (0.9 → 1)
Backdrop: opacity (0 → 0.5) with 200ms duration
```

### **Modal Exit**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 1, 1)
Properties: opacity (1 → 0), scale (1 → 0.9)
Backdrop: opacity (0.5 → 0) with 150ms duration
```

### **Modal Content Stagger**
```
Header: 0ms delay
Body: 100ms delay
Actions: 200ms delay
Duration: 300ms per element
```

---

## **Dashboard-Specific Animations**

### **WhatsNext Hero**
```
Entrance: 500ms with 200ms delay
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), y (30px → 0)
```

### **Dashboard Grid**
```
Container: 300ms delay
Children: 100ms stagger
Duration: 400ms per child
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), y (20px → 0)
```

### **Financial Metrics**
```
Numbers: 800ms duration with counting animation
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Stagger: 200ms between metrics
```

### **Activity Items**
```
Entrance: 300ms per item
Stagger: 50ms between items
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), x (-10px → 0)
```

---

## **State Change Animations**

### **Loading States**
```
Spinner: 1000ms linear infinite rotation
Skeleton: 1500ms ease-in-out infinite pulse
Progress: 300ms ease-out for progress updates
```

### **Success States**
```
Duration: 300ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Properties: scale (0.8 → 1.1 → 1), opacity (0 → 1)
```

### **Error States**
```
Duration: 400ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Properties: transform (translateX 0 → -5px → 5px → 0)
```

### **Empty States**
```
Duration: 500ms
Easing: cubic-bezier(0, 0, 0.2, 1)
Properties: opacity (0 → 1), y (20px → 0)
```

---

## **Micro-Interactions**

### **Icon Animations**
```
Hover: 200ms ease-out, scale (1 → 1.1)
Press: 150ms ease-out, scale (1 → 0.9)
Success: 300ms bounce, scale (1 → 1.2 → 1)
```

### **Toggle Switches**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: transform (translateX 0 → 20px), background-color
```

### **Checkboxes**
```
Duration: 200ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Properties: scale (0 → 1.2 → 1), opacity (0 → 1)
```

### **Dropdown Menus**
```
Entrance: 200ms ease-out, opacity (0 → 1), y (-10px → 0)
Exit: 150ms ease-in, opacity (1 → 0), y (0 → -10px)
```

---

## **Accessibility Considerations**

### **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **Motion Preferences**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const shouldReduceMotion = prefersReducedMotion.matches;

const safeAnimation = shouldReduceMotion ? 
  { duration: 0.01 } : 
  { duration: 0.3, ease: [0, 0, 0.2, 1] };
```

### **Focus Indicators**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: outline, box-shadow
```

---

## **Performance Guidelines**

### **GPU-Accelerated Properties**
- Use `transform` and `opacity` for smooth animations
- Avoid animating `width`, `height`, `margin`, `padding`
- Use `will-change` sparingly and only when needed

### **Animation Limits**
- Maximum 3 concurrent animations per element
- Maximum 10 concurrent animations per page
- Use `requestAnimationFrame` for complex animations

### **Implementation Example**
```javascript
// Good: GPU-accelerated
const smoothAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
};

// Avoid: Non-GPU-accelerated
const slowAnimation = {
  initial: { width: 0 },
  animate: { width: '100%' },
  transition: { duration: 0.3 }
};
```

---

## **Animation Testing Checklist**

### **Functional Testing**
- [ ] Animations complete without errors
- [ ] Reduced motion preferences respected
- [ ] Focus indicators remain visible
- [ ] Keyboard navigation works during animations

### **Performance Testing**
- [ ] 60fps on target devices
- [ ] No layout thrashing
- [ ] Memory usage remains stable
- [ ] Battery impact minimal

### **User Experience Testing**
- [ ] Animations feel purposeful
- [ ] No motion sickness triggers
- [ ] Timing feels natural
- [ ] Brand personality conveyed

---

## **Implementation with Framer Motion**

### **Standard Animation Variants**
```javascript
export const entranceAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  }
};

export const listAnimations = {
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  }
};
```

### **Usage Example**
```javascript
import { motion } from 'framer-motion';
import { entranceAnimations, listAnimations } from './animationPresets';

const Dashboard = () => (
  <motion.div {...entranceAnimations.fadeIn}>
    <motion.div {...listAnimations.staggerContainer}>
      {items.map(item => (
        <motion.div key={item.id} {...listAnimations.staggerItem}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
```

---

This motion and interaction guide provides the complete specification for implementing animations that embody the "Calm Confidence" brand goal while ensuring accessibility, performance, and user experience excellence. 