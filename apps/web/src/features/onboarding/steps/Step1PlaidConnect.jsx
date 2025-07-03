/**
 * Step1PlaidConnect.jsx - Phase 5 Plaid Production Integration
 * 
 * Purpose: First onboarding step that guides users through
 * secure bank connection via Plaid OAuth flow using real Plaid API.
 * 
 * Procedure:
 * 1. Explain the security and benefits of bank connection
 * 2. Initiate Plaid OAuth flow using real PlaidService
 * 3. Handle connection success/failure with proper error handling
 * 4. Store connection data for next steps
 * 
 * Conclusion: Establishes secure bank data foundation
 * for the user's financial management experience.
 */

import React, { useState, useEffect } from 'react';
import Button from '../../../shared/ui/Button.jsx';
import Card from '../../../shared/ui/Card.jsx';
import { Shield, CreditCard, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import PlaidService from '../../../lib/services/PlaidService.js';
import { config } from '../../../lib/config.js';
import { useToast } from '../../../components/ui/use-toast.jsx';

/**
 * Plaid connection step component
 */
const Step1PlaidConnect = ({ onComplete, onSkip, data, isLoading }) => {
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, connected, failed
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [plaidService] = useState(() => new PlaidService());
  const { toast } = useToast();

  // Check for existing connection data
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        if (data?.connected) {
          setConnectionStatus('connected');
          setAccounts(data.accounts || []);
          setSelectedAccount(data.selectedAccount);
        } else {
          // Try to load stored connection
          const isConnected = await plaidService.loadStoredAccessToken();
          if (isConnected) {
            const accountsData = await plaidService.fetchAccounts();
            setAccounts(accountsData);
            setConnectionStatus('connected');
            
            // Show success toast
            toast({
              title: "Bank Connection Restored",
              description: `Successfully reconnected to ${accountsData.length} account(s).`,
              variant: "default"
            });
          }
        }
      } catch (error) {
        console.error('Failed to check existing connection:', error);
        // Clear invalid stored data
        plaidService.clearAccessToken();
      }
    };

    checkExistingConnection();
  }, [data, plaidService, toast]);

  /**
   * Initialize Plaid connection
   */
  const handleConnectBank = async () => {
    // If in demo mode (no user), immediately complete step with demo data
    if (!window.demoUser && (!window.user || window.user === null)) {
      onComplete({
        connected: true,
        account: { id: 'demo', name: 'Demo Checking Account', type: 'depository', subtype: 'checking' },
        accounts: [
          { id: 'demo', name: 'Demo Checking Account', type: 'depository', subtype: 'checking' },
          { id: 'demo2', name: 'Demo Savings Account', type: 'depository', subtype: 'savings' }
        ]
      });
      return;
    }
    console.log('🔧 handleConnectBank called - starting bank connection');
    setConnectionStatus('connecting');
    setError(null);
    setIsConnecting(true);

    try {
      // Show connecting toast
      toast({
        title: "Connecting to Bank",
        description: "Opening secure connection to your bank...",
        variant: "default"
      });

      // DEMO MODE: Check if Plaid credentials are configured
      const hasPlaidCredentials = plaidService.clientId && plaidService.secret;
      console.log('🔧 Plaid credentials check:', { hasPlaidCredentials, clientId: plaidService.clientId ? 'present' : 'missing', secret: plaidService.secret ? 'present' : 'missing' });
      
      if (!hasPlaidCredentials) {
        console.log('🔧 Demo mode: No Plaid credentials, simulating bank connection');
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create demo accounts
        const demoAccounts = [
          {
            account_id: 'demo_checking_1',
            name: 'Demo Checking Account',
            type: 'depository',
            subtype: 'checking',
            mask: '1234',
            balances: {
              available: 5000.00,
              current: 5000.00,
              limit: null
            }
          },
          {
            account_id: 'demo_savings_1', 
            name: 'Demo Savings Account',
            type: 'depository',
            subtype: 'savings',
            mask: '5678',
            balances: {
              available: 15000.00,
              current: 15000.00,
              limit: null
            }
          }
        ];
        
        console.log('🔧 Demo accounts created:', demoAccounts);
        setAccounts(demoAccounts);
        setConnectionStatus('connected');
        
        // Show success toast
        toast({
          title: "Demo Bank Connected!",
          description: `Successfully connected ${demoAccounts.length} demo account(s).`,
          variant: "default"
        });
        
        return;
      }

      // Real Plaid connection (when credentials are available)
      const linkTokenResponse = await plaidService.createLinkToken(
        'user_' + Date.now() // Temporary user ID
      );

      // Store link token for callback
      sessionStorage.setItem('plaid_link_token', linkTokenResponse.link_token);

      // Open Plaid Link
      const handler = window.Plaid.create({
        token: linkTokenResponse.link_token,
        onSuccess: handlePlaidSuccess,
        onExit: handlePlaidExit,
      });

      handler.open();

    } catch (error) {
      console.error('🔧 Bank connection error:', error);
      setError('Failed to connect to your bank. Please try again.');
      setConnectionStatus('failed');
      
      // Show error toast
      toast({
        title: "Connection Failed",
        description: "Unable to establish connection with your bank. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Handle successful Plaid connection
   */
  const handlePlaidSuccess = async (publicToken) => {
    try {
      // Show processing toast
      toast({
        title: "Processing Connection",
        description: "Securely processing your bank connection...",
        variant: "default"
      });

      // Exchange public token for access token using PlaidService
      const tokenResponse = await plaidService.exchangePublicToken(publicToken);
      
      // Get accounts using PlaidService
      const accountsData = await plaidService.fetchAccounts();
      
      setAccounts(accountsData);
      setConnectionStatus('connected');
      
      // Store connection data
      const connectionData = {
        accessToken: tokenResponse.access_token,
        itemId: tokenResponse.item_id,
        accounts: accountsData,
      };
      
      localStorage.setItem('plaid_connection', JSON.stringify(connectionData));
      
      // Show success toast
      toast({
        title: "Bank Connected!",
        description: `Successfully connected ${accountsData.length} account(s).`,
        variant: "default"
      });
      
    } catch (error) {
      setError('Failed to complete bank connection. Please try again.');
      setConnectionStatus('failed');
      
      // Show error toast
      toast({
        title: "Connection Error",
        description: "Failed to complete bank connection. Please try again.",
        variant: "destructive"
      });
    }
  };

  /**
   * Handle Plaid exit
   */
  const handlePlaidExit = (err) => {
    if (err) {
      setError('Bank connection was cancelled or failed.');
      setConnectionStatus('failed');
      
      // Show error toast
      toast({
        title: "Connection Cancelled",
        description: "Bank connection was cancelled or failed.",
        variant: "destructive"
      });
    } else {
      setConnectionStatus('idle');
    }
  };

  /**
   * Handle account selection
   */
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    
    // Show selection toast
    toast({
      title: "Account Selected",
      description: `${account.name} selected for AlphaFrame.`,
      variant: "default"
    });
  };

  /**
   * Complete step
   */
  const handleComplete = () => {
    if (selectedAccount) {
      onComplete({
        connected: true,
        accessToken: plaidService.accessToken,
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
    handleConnectBank();
  };

  /**
   * Skip bank connection
   */
  const handleSkip = () => {
    toast({
      title: "Bank Connection Skipped",
      description: "You can connect your bank account later in settings.",
      variant: "default"
    });
    onSkip();
  };

  // DEBUG PATCH: Add overlay removal button and force pointer events
  const removeOverlays = () => {
    // Remove any element with pointer-events: none or high z-index
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.pointerEvents === 'none' || parseInt(style.zIndex) > 1000) {
        el.style.pointerEvents = 'auto';
        el.style.opacity = 1;
        el.style.zIndex = 1;
        el.style.background = 'rgba(255,0,0,0.1)';
      }
    });
    // Set all parent containers to pointer-events: auto and opacity: 1
    let el = document.querySelector('.step-container');
    while (el) {
      el.style.pointerEvents = 'auto';
      el.style.opacity = 1;
      el.style.border = '3px solid red';
      el = el.parentElement;
    }
    alert('Overlay removal attempted. Try clicking the buttons again.');
  };

  // DEBUG PATCH: Force-enable pointer events and opacity
  console.log('🔧 [DEBUG] Step1PlaidConnect rendered - forcing pointer-events and opacity');

  return (
    <div className="step-container" style={{ pointerEvents: 'auto', opacity: 1, border: '3px solid red', background: '#fff3' }}>
      <button style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999, background: 'red', color: 'white', fontWeight: 'bold', padding: '8px', borderRadius: '6px', border: 'none' }} onClick={removeOverlays}>
        Remove Overlay (Debug)
      </button>
      <Card className="step-card" style={{ pointerEvents: 'auto', opacity: 1, border: '3px solid orange', background: '#fff6' }}>
        <div className="step-header">
          <div className="step-icon">
            <Shield className="icon" />
          </div>
          <h2>Connect Your Bank Account</h2>
          <p className="step-description">
            Securely connect your bank account to enable automated financial insights and rule-based alerts.
          </p>
        </div>

        <div className="step-content">
          {/* Security Information */}
          <div className="security-info">
            <div className="security-item">
              <Shield className="security-icon" />
              <div>
                <h4>Bank-Level Security</h4>
                <p>Your credentials are never stored. We use Plaid's secure OAuth flow.</p>
              </div>
            </div>
            <div className="security-item">
              <CreditCard className="security-icon" />
              <div>
                <h4>Read-Only Access</h4>
                <p>We can only view your transactions. We cannot make any changes to your accounts.</p>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          {connectionStatus === 'idle' && (
            <div className="connection-prompt">
              {/* Test button to verify clicks work */}
              <Button 
                onClick={() => {
                  console.log('🔧 Test button clicked!');
                  alert('Test button works!');
                }}
                style={{ marginBottom: '10px' }}
              >
                Test Button (Click Me)
              </Button>
              
              <Button 
                onClick={handleConnectBank}
                disabled={isConnecting}
                className="connect-button"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="spinner" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CreditCard className="icon" />
                    Connect Bank Account
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSkip}
                variant="outline"
                className="skip-button"
              >
                Skip for Now
              </Button>
            </div>
          )}

          {connectionStatus === 'connecting' && (
            <div className="connection-status">
              <Loader2 className="spinner" />
              <p>Connecting to your bank...</p>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="connection-success">
              <CheckCircle className="success-icon" />
              <h3>Bank Account Connected!</h3>
              
              {accounts.length > 0 && (
                <div className="accounts-list">
                  <h4>Available Accounts:</h4>
                  {accounts.map((account) => (
                    <div 
                      key={account.account_id}
                      className={`account-item ${selectedAccount?.account_id === account.account_id ? 'selected' : ''}`}
                      onClick={() => handleAccountSelect(account)}
                    >
                      <div className="account-info">
                        <h5>{account.name}</h5>
                        <p>{account.type} • {account.subtype}</p>
                      </div>
                      {selectedAccount?.account_id === account.account_id && (
                        <CheckCircle className="selected-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedAccount && (
                <Button 
                  onClick={handleComplete}
                  className="continue-button"
                >
                  Continue with {selectedAccount.name}
                  <ArrowRight className="icon" />
                </Button>
              )}
            </div>
          )}

          {connectionStatus === 'failed' && (
            <div className="connection-error">
              <AlertCircle className="error-icon" />
              <h3>Connection Failed</h3>
              <p>{error}</p>
              <Button 
                onClick={handleRetry}
                className="retry-button"
              >
                Try Again
              </Button>
              <Button 
                onClick={handleSkip}
                variant="outline"
                className="skip-button"
              >
                Skip for Now
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Step1PlaidConnect; 