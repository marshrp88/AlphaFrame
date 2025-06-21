import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch link token on component mount
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual backend endpoint
        // For now, this will fail gracefully and show placeholder
        const response = await fetch('/api/create-link-token');
        if (response.ok) {
          const data = await response.json();
          setLinkToken(data.link_token);
        } else {
          console.warn('Link token endpoint not available - using placeholder');
          setLinkToken(null);
        }
      } catch (err) {
        console.warn('Failed to fetch link token:', err);
        setError('Unable to connect to Plaid at this time');
        setLinkToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, []);

  const onSuccess = useCallback((public_token, metadata) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    console.log('Plaid Link Success:', { public_token, metadata });
    
    // TODO: Exchange public_token for access_token via backend
    // This would typically be:
    // fetch('/api/exchange-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ public_token })
    // });
  }, []);

  const onExit = useCallback((err, metadata) => {
    // Handle user exit from Plaid Link
    console.log('Plaid Link Exit:', { err, metadata });
    if (err) {
      setError('Connection was interrupted. Please try again.');
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  if (isLoading) {
    return <button disabled>Loading Plaid connection...</button>;
  }

  if (error) {
    return (
      <div>
        <button disabled>Connect a bank account</button>
        <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>
      </div>
    );
  }

  return (
    <button onClick={() => open()} disabled={!ready || !linkToken}>
      Connect a bank account
    </button>
  );
};

export default PlaidLink; 