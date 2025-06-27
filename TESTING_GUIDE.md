# AlphaFrame VX.1 – Testing & Output Guide

This guide explains how to run and interpret tests for AlphaFrame VX.1, and how to reset the app for a clean demo. It's written for both technical and non-technical users.

---

## 1. **Running All Tests**

### **Unit & Integration Tests**
- Run from the project root:
  ```bash
  npm run test
  # or
  pnpm test
  ```
- **What it does:** Runs all unit and integration tests for the app's logic and components
- **Output:**
  - ✅ Green = Passed
  - ❌ Red = Failed (see error message for details)

### **End-to-End (E2E) Tests**
- Run from the project root:
  ```bash
  npm run test:e2e
  ```
- **What it does:** Simulates real user flows in the browser (onboarding, dashboard, rules, etc.)
- **Output:**
  - All tests should pass for a demo-ready build
  - Screenshots and reports are saved in `/apps/web/playwright-report/`

---

## 2. **Interpreting Results**
- **All green:** The app is stable and demo-ready
- **Some red:** Read the error message; most are self-explanatory (e.g., missing data, network issue)
- **E2E failures:** Check if the app is running and accessible at the right port (default: 5173 or 5174)

---

## 3. **Resetting Demo Data/State**
- **For a fresh onboarding/demo:**
  - Open browser dev tools
  - Run:
    ```js
    localStorage.clear()
    ```
  - Refresh the page
- **To reset a specific user:**
  - Log out and log in with a new or test account

---

## 4. **Troubleshooting Tips**
- **Port in use?**
  - The app will try the next available port (e.g., 5174)
  - Check the terminal for the correct URL
- **Auth or Plaid errors?**
  - Double-check your `.env` values
  - Make sure you have internet access
- **UI not updating?**
  - Hard refresh the browser (Ctrl+Shift+R)
  - Clear cache if needed
- **Tests not running?**
  - Make sure dependencies are installed (`npm install` or `pnpm install`)
  - Check for typos in commands

---

## 5. **Where to Find Test Reports**
- **E2E screenshots and logs:** `/apps/web/playwright-report/`
- **Unit test coverage:** Output in the terminal after running tests

---

**For more help, see the main README or email support@alphaframe.com.** 