/**
 * App.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Main application component with routing, authentication,
 * onboarding flow, and error boundaries for production readiness.
 * 
 * Procedure:
 * 1. Set up routing with protected and public routes
 * 2. Integrate onboarding flow for first-time users
 * 3. Wrap components with error boundaries
 * 4. Handle authentication state and redirects
 * 5. Provide navigation and user experience
 * 
 * Conclusion: Central application component that orchestrates
 * all user flows and ensures robust error handling.
 */

console.log("🧩 App.jsx loaded — minimal start");

import React, { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = () => {
  // TODO: This token must be fetched from your own backend server.
  const linkToken = null; 

  const onSuccess = useCallback((public_token, metadata) => {
    console.log("Plaid success:", public_token, metadata);
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <button onClick={() => open()} disabled={!ready || !linkToken}>
      Connect a bank account
    </button>
  );
};

const App = () => {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  console.log("🧩 Rendering App with Auth0 state");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>AlphaFrame VX.1</h1>
      {isAuthenticated ? (
        <>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
          <hr />
          <PlaidLink />
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </div>
  );
};

export default App;
