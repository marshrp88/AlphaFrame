/**
 * Step1PlaidConnect.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: First onboarding step that guides users through
 * secure bank connection via Plaid OAuth flow.
 * 
 * Procedure:
 * 1. Explain the security and benefits of bank connection
 * 2. Initiate Plaid OAuth flow
 * 3. Handle connection success/failure
 * 4. Store connection data for next steps
 * 
 * Conclusion: Establishes secure bank data foundation
 * for the user's financial management experience.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button.jsx';
import { Card } from '../../../shared/ui/Card.jsx';
import { Shield, CreditCard, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { initializePlaid, createLinkToken, exchangePublicToken, getAccounts } from '../../../lib/services/syncEngine.js';
import { config } from '../../../lib/config.js';

/**
 * Plaid connection step component
 */
const Step1PlaidConnect = ({ onComplete, onSkip, data, isLoading }) => {
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, connected, failed
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState(null);

  // Check for existing connection data
  useEffect(() => {
    if (data?.connected) {
      setConnectionStatus('connected');
      setAccounts(data.accounts || []);
      setSelectedAccount(data.selectedAccount);
    }
  }, [data]);

  /**
   * Initialize Plaid connection
   */
  const handleConnectBank = async () => {
    setConnectionStatus('connecting');
    setError(null);

    try {
      // Initialize Plaid client
      await initializePlaid(
        config.plaid.clientId,
        config.plaid.secret,
        config.plaid.env
      );

      // Create link token
      const linkTokenResponse = await createLinkToken(
        'user_' + Date.now(), // Temporary user ID
        'AlphaFrame'
      );

      // Store link token for callback
      sessionStorage.setItem('plaid_link_token', linkTokenResponse.link_token);

      // Open Plaid Link
      const handler = window.Plaid.create({
        token: linkTokenResponse.link_token,
        onSuccess: handlePlaidSuccess,
        onExit: handlePlaidExit,
        onEvent: handlePlaidEvent
      });

      handler.open();

    } catch (error) {
      console.error('Plaid connection failed:', error);
      setError('Failed to connect to your bank. Please try again.');
      setConnectionStatus('failed');
    }
  };

  /**
   * Handle successful Plaid connection
   */
  const handlePlaidSuccess = async (publicToken, metadata) => {
    try {
      // Exchange public token for access token
      const tokenResponse = await exchangePublicToken(publicToken);
      
      // Get accounts
      const accountsData = await getAccounts(tokenResponse.access_token);
      
      setAccounts(accountsData);
      setConnectionStatus('connected');
      
      // Store connection data
      const connectionData = {
        accessToken: tokenResponse.access_token,
        itemId: tokenResponse.item_id,
        accounts: accountsData,
        metadata
      };
      
      localStorage.setItem('plaid_connection', JSON.stringify(connectionData));
      
    } catch (error) {
      console.error('Token exchange failed:', error);
      setError('Failed to complete bank connection. Please try again.');
      setConnectionStatus('failed');
    }
  };

  /**
   * Handle Plaid exit
   */
  const handlePlaidExit = (err, metadata) => {
    if (err) {
      setError('Bank connection was cancelled or failed.');
      setConnectionStatus('failed');
    } else {
      setConnectionStatus('idle');
    }
  };

  /**
   * Handle Plaid events
   */
  const handlePlaidEvent = (eventName, metadata) => {
    console.log('Plaid event:', eventName, metadata);
  };

  /**
   * Handle account selection
   */
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  /**
   * Complete step
   */
  const handleComplete = () => {
    if (selectedAccount) {
      onComplete({
        connected: true,
        accessToken: JSON.parse(localStorage.getItem('plaid_connection') || '{}').accessToken,
        selectedAccount,
        accounts
      });
    }
  };

  /**
   * Retry connection
   */
  const handleRetry = () => {
    setConnectionStatus('idle');
    setError(null);
    setAccounts([]);
    setSelectedAccount(null);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {connectionStatus === 'idle' && (
        <Card className="p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connect Your Bank Account
            </h2>
            
            <p className="text-gray-600 mb-6">
              Securely connect your bank account to import transactions and get started with AlphaFrame.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Secure</h3>
                <p className="text-sm text-gray-500">Bank-level encryption</p>
              </div>
              <div className="text-center">
                <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Fast</h3>
                <p className="text-sm text-gray-500">Instant transaction sync</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Reliable</h3>
                <p className="text-sm text-gray-500">Trusted by millions</p>
              </div>
            </div>

            <Button
              onClick={handleConnectBank}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Connect Bank Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Connecting State */}
      {connectionStatus === 'connecting' && (
        <Card className="p-6">
          <div className="text-center">
            <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connecting to Your Bank
            </h2>
            <p className="text-gray-600">
              Please complete the secure connection in the popup window.
            </p>
          </div>
        </Card>
      )}

      {/* Connected State */}
      {connectionStatus === 'connected' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bank Connected Successfully!
            </h2>
            
            <p className="text-gray-600">
              We found {accounts.length} account{accounts.length !== 1 ? 's' : ''}. Select the account you'd like to use with AlphaFrame.
            </p>
          </div>

          {/* Account Selection */}
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAccount?.id === account.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAccountSelect(account)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">
                      {account.type} • {account.subtype} • ****{account.mask}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${account.balances.current?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-gray-500">Available</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={handleComplete}
              disabled={!selectedAccount || isLoading}
              className="w-full md:w-auto"
            >
              Continue with Selected Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Failed State */}
      {connectionStatus === 'failed' && (
        <Card className="p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Failed
            </h2>
            
            <p className="text-gray-600 mb-4">
              {error || 'We couldn\'t connect to your bank. Please try again.'}
            </p>

            <div className="space-x-3">
              <Button
                onClick={handleRetry}
                variant="outline"
              >
                Try Again
              </Button>
              
              <Button
                onClick={onSkip}
                variant="outline"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Step1PlaidConnect; 