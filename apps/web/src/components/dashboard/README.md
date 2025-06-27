# Dashboard – AlphaFrame VX.1

## Purpose
The dashboard is the main hub where users see their financial story. It brings together all key information—cashflow, insights, net worth, recent changes, and action queue—into one clear, animated view. The goal is to help users understand their finances and know what to do next.

---

## What's on the Dashboard?
- **Cashflow Widget:** Shows income and spending trends
- **Simulation Insights:** Predicts future outcomes and gives tips
- **Net Worth Trajectory:** Tracks your net worth over time
- **Recent Changes:** Lists important updates and transactions
- **Action Queue:** Shows tasks and recommendations
- **WhatsNext:** Personalized suggestions for your next best action

All widgets are animated and update in real time as your data changes.

---

## How It Works
- **Loads data** from the financial state store
- **Configures layout** based on user preferences (light/dark, grid/stack)
- **Animates** each section for smooth transitions
- **Updates** automatically when new data arrives (e.g., after syncing)
- **Handles errors** with clear messages and retry options

---

## User Experience & Error Handling
- **Loading state:** Spinner and progress dots while data loads
- **Error state:** Friendly message, icon, and retry button if something goes wrong
- **Toasts:** Show feedback for refresh, errors, or updates
- **Responsive:** Works on desktop and mobile
- **Accessible:** Keyboard navigation, readable text, color contrast

---

## How to Test or Demo
1. **Login and go to `/dashboard`** (or `/live-dashboard` for real-time updates)
2. **Check each widget:**
   - Cashflow, Insights, Net Worth, Recent Changes, Action Queue, WhatsNext
3. **Trigger data updates:**
   - Sync new transactions or change user data
   - Watch widgets update and animate
4. **Test error states:**
   - Disconnect network or simulate a data error
   - See error message and retry option
5. **Try on mobile:**
   - Resize browser or use a phone

---

## Extending or Customizing
- **Add new widgets:** Edit `DashboardConfig.js` and add a new section/component
- **Change layout:** Update config or user preferences
- **Customize animations:** Edit `animationPresets.js` or widget components
- **Integrate new data:** Connect to the financial state store or add new sync sources

---

## File Structure
- `MainDashboard.jsx` – Main dashboard controller
- `DashboardConfig.js` – Layout and section settings
- `/sections/` – Each widget as its own component
- `LiveFinancialDashboard.jsx` – Real-time dashboard variant

---

**For more details, see code comments and the main project README.** 