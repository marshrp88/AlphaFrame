# Profile Page – AlphaFrame VX.1

## Purpose
The Profile page lets users view and manage their account information, roles, permissions, and session details. It's designed to give users control over their identity and security in AlphaFrame.

---

## What Does the Profile Page Do?
- **Shows user info:** Name, email, avatar, and verification status
- **Displays roles and permissions:** See what you can do in the app
- **Session management:** View and refresh your login session
- **Account actions:** Log out, manage account, or update settings
- **Security info:** See provider, user ID, and environment details

---

## How It Works
- **Loads data** from Auth0 (secure authentication)
- **Displays info** in clear, organized cards
- **Handles loading and error states** with friendly messages
- **Lets users refresh token** to see updated session info
- **Logout button** ends the session and returns to login

---

## User Experience & Error Handling
- **Loading state:** Spinner and message while loading
- **Error state:** Clear message if not authenticated or if there's a problem
- **Toasts:** Show feedback for token refresh or errors
- **Accessible:** Keyboard navigation, readable text, color contrast

---

## How to Test or Demo
1. **Login and go to `/profile`**
2. **Check user info:** Name, email, avatar, roles, permissions
3. **Refresh token:** Click "Refresh Token" and see updated info
4. **Log out:** Click "Logout" and confirm you're returned to login
5. **Trigger errors:** Log out and try to access `/profile` (should show error)

---

## Extending or Customizing
- **Add new fields:** Update the Profile component to show more info
- **Change layout:** Edit card structure or add new sections
- **Integrate with other services:** Add links to billing, notifications, etc.
- **Customize roles/permissions:** Update Auth0 config and UI

---

## File Structure
- `Profile.jsx` – Main profile page component
- Uses shared UI: `Card.jsx`, `Button.jsx`

---

**For more details, see code comments and the main project README.** 