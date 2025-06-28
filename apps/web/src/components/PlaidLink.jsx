/**
 * PlaidLink.jsx
 * 
 * Purpose: Secure Plaid Link integration for connecting bank accounts
 * 
 * This component provides:
 * - Plaid Link initialization with real API tokens
 * - Secure token exchange and storage
 * - Error handling and loading states
 * - Sandbox mode support for development
 * 
 * Security Features:
 * - Encrypted token storage
 * - Environment-specific configuration
 * - Secure token exchange flow
 */

import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import plaidService from '../lib/services/PlaidService.js';
import { useAppStore } from '../core/store/useAppStore.js';
import env from '../lib/env.js';

const PlaidLink = ({ onSuccess, onError, onExit, className = '', children }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAppStore();

  /**
   * Create a link token for Plaid Link initialization
   * Uses the current user ID or generates a temporary one
   */
  const createLinkToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use user ID if available, otherwise generate a temporary one
      const userId = user?.id || `temp_user_${Date.now()}`;
      
      const result = await plaidService.createLinkToken(userId);
      
      if (result.success) {
        setLinkToken(result.linkToken);
      } else {
        throw new Error(result.error || 'Failed to create link token');
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize Plaid Link');
      
      // Call error callback if provided
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, onError]);

  /**
   * Handle successful Plaid Link connection
   * Exchanges public token for access token and stores securely
   */
  const handleSuccess = useCallback(async (publicToken, metadata) => {
    setIsLoading(true);
    setError(null);

    try {
      // Exchange public token for access token
      const result = await plaidService.exchangePublicToken(publicToken);
      
      if (result.success) {
        // Call success callback with account information
        if (onSuccess) {
          onSuccess({
            accessToken: result.accessToken,
            itemId: result.itemId,
            accounts: metadata.accounts,
            institution: metadata.institution
          });
        }
      } else {
        throw new Error(result.error || 'Failed to exchange token');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete bank connection');
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  /**
   * Handle Plaid Link exit
   */
  const handleExit = useCallback((err, metadata) => {
    if (err) {
      setError(err.display_message || err.error_message || 'Connection cancelled');
    }
    
    if (onExit) {
      onExit(err, metadata);
    }
  }, [onExit]);

  /**
   * Initialize Plaid Link configuration
   */
  const config = {
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
    // Sandbox mode configuration for development
    env: env.VITE_PLAID_ENV || 'sandbox',
    clientName: 'AlphaFrame',
    products: ['transactions'],
    countryCodes: ['US'],
    language: 'en',
    // Account filters for better user experience
    accountSubtypes: {
      depository: ['checking', 'savings']
    }
  };

  const { open, ready } = usePlaidLink(config);

  /**
   * Create link token on component mount
   */
  useEffect(() => {
    if (!linkToken && !isLoading) {
      createLinkToken();
    }
  }, [linkToken, isLoading, createLinkToken]);

  /**
   * Handle component click to open Plaid Link
   */
  const handleClick = useCallback(() => {
    if (ready && !isLoading) {
      open();
    }
  }, [ready, isLoading, open]);

  /**
   * Render loading state
   */
  if (isLoading && !linkToken) {
    return (
      <div className={`plaid-link-loading ${className}`}>
        <div className="loading-spinner"></div>
        <span>Initializing bank connection...</span>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={`plaid-link-error ${className}`}>
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button 
            onClick={() => {
              setError(null);
              createLinkToken();
            }}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render disabled state if not configured
   */
  if (!plaidService.isConfigured()) {
    return (
      <div className={`plaid-link-disabled ${className}`}>
        <span>Bank connection not configured</span>
      </div>
    );
  }

  /**
   * Render the main component
   */
  return (
    <div className={`plaid-link-container ${className}`}>
      <button
        onClick={handleClick}
        disabled={!ready || isLoading}
        className={`plaid-link-button ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            <span>Connecting...</span>
          </>
        ) : (
          children || 'Connect Bank Account'
        )}
      </button>
      
      {isLoading && (
        <div className="plaid-link-overlay">
          <div className="loading-message">
            Connecting to your bank...
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaidLink; 