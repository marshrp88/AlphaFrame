# AlphaFrame VX.1

## Purpose
AlphaFrame is a next-generation financial platform designed to help users manage, plan, and automate their finances with confidence. It combines a beautiful, modern interface with smart recommendations, privacy-first architecture, and real-time data sync.

**This version is demo-ready and built for stakeholder/investor review.**

---

## What Makes AlphaFrame Unique?
- **Narrative Dashboard:** Not just numbers—animated, story-driven financial insights.
- **Context-Aware Onboarding:** Personalized setup for every user.
- **Rule Engine:** Automate actions and get smart, context-driven recommendations.
- **Privacy by Design:** Local-first, no cloud sync unless you opt in.
- **Professional UX/UI:** Modern, accessible, and emotionally legible.

---

## Quick Start (Local Setup)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-org/AlphaFrame.git
   cd AlphaFrame
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in values (see below).
4. **Run the app:**
   ```bash
   cd apps/web
   npm run dev
   # or
   pnpm --filter web dev
   ```
5. **Open in browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## Environment Variables
- **Auth0:** For authentication (see `.env.example`)
- **Plaid:** For bank connection (see `.env.example`)
- **Sentry:** For error monitoring (optional)

---

## Core User Flows

### 1. **Onboarding**
- New users are guided through:
  1. **Bank Connection** (Plaid, secure)
  2. **Transaction Review** (categorize your spending)
  3. **Budget Setup** (set your first budget)
  4. **Dashboard Mode Selection** (choose your view)
- **Error handling:** Friendly messages and recovery options at every step.

### 2. **Dashboard**
- See your financial story: cashflow, insights, net worth, recent changes, and action queue.
- **Animated widgets** and clear calls-to-action.
- **Live updates** and context-aware recommendations.

### 3. **Rules Engine**
- Create, edit, and manage automation rules.
- Each rule is traceable and auditable.
- Smart suggestions based on your financial state.

### 4. **Profile**
- Manage your account, roles, and permissions.
- View session info and security settings.

---

## Demo Script / Walkthrough Checklist

1. **Login as a new user** (or clear localStorage)
2. **Complete onboarding** (show each step, including error recovery)
3. **Arrive at dashboard** (point out animated widgets and recommendations)
4. **Show rules page** (create/edit a rule, show audit trail)
5. **Visit profile** (show account management and security)
6. **Trigger error boundary** (show friendly error handling)
7. **Show mobile/responsive view** (resize browser)
8. **Highlight privacy features** (local storage, opt-in sync)

---

## Testing & Output
- **Run all tests:**
  ```bash
  npm run test
  # or
  pnpm test
  ```
- **E2E tests:**
  ```bash
  npm run test:e2e
  ```
- **Check output:**
  - All tests should pass (see terminal output)
  - For demo, use a fresh user or clear localStorage for onboarding

---

## Design System & UX
- **Design tokens:** All colors, spacing, and typography are standardized in `design-tokens.css`.
- **Motion:** Animations use Framer Motion for smooth, meaningful transitions.
- **Accessibility:** WCAG 2.1 AA compliant, keyboard navigation, reduced motion support.
- **Responsive:** Works on desktop and mobile.

---

## Troubleshooting
- **Port in use?** The app will try the next available port (e.g., 5174).
- **Auth/Plaid errors?** Check your `.env` values and network connection.
- **UI not updating?** Hard refresh or clear browser cache.
- **Need help?** Email support@alphaframe.com

---

## More Info
- **Component-level READMEs:** See `/apps/web/docs` and `/apps/web/src/features/onboarding/README.md` for detailed breakdowns.
- **Phase X Audit:** See `/apps/web/docs/PHASE_X_FINAL_PROOF_RESULTS.md` for certification details.

---

**AlphaFrame VX.1 — Demo Ready.**
