/**
 * SyncStatusWidget.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Real-time sync status dashboard that shows
 * bank connection health, last sync time, and transaction counts.
 * 
 * Procedure:
 * 1. Monitor Plaid sync status and health
 * 2. Display last sync timestamp and transaction counts
 * 3. Show connection status and error states
 * 4. Provide manual sync and troubleshooting options
 * 
 * Conclusion: Provides users with transparency into
 * their data synchronization and system health.
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../../shared/ui/Card.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import { Badge } from '../../shared/ui/badge.jsx';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';
import { getLastSyncMetadata, syncTransactions } from '../../lib/services/syncEngine.js';
import { useFinancialStateStore } from '../../core/store/financialStateStore.js';

/**
 * Sync status widget component
 */
export const SyncStatusWidget = () => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, failed
  const [lastSync, setLastSync] = useState(null);
  const [newTransactions, setNewTransactions] = useState(0);
  const [connectionHealth, setConnectionHealth] = useState('healthy'); // healthy, warning, error
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);
  
  const { transactions } = useFinancialStateStore();

  // Load initial sync status
  useEffect(() => {
    loadSyncStatus();
  }, []);

  // Update transaction count when transactions change
  useEffect(() => {
    if (lastSync && transactions.length > 0) {
      const recentTransactions = transactions.filter(t => 
        new Date(t.date) > new Date(lastSync.timestamp)
      );
      setNewTransactions(recentTransactions.length);
    }
  }, [transactions, lastSync]);

  /**
   * Load current sync status
   */
  const loadSyncStatus = async () => {
    try {
      const metadata = await getLastSyncMetadata();
      setLastSync(metadata);
      
      // Determine connection health
      if (metadata.lastError) {
        setConnectionHealth('error');
        setError(metadata.lastError);
      } else if (metadata.lastSyncAge > 24 * 60 * 60 * 1000) { // 24 hours
        setConnectionHealth('warning');
      } else {
        setConnectionHealth('healthy');
        setError(null);
      }
      
    } catch (error) {
      console.error('Failed to load sync status:', error);
      setConnectionHealth('error');
      setError('Unable to check sync status');
    }
  };

  /**
   * Trigger manual sync
   */
  const handleManualSync = async () => {
    setSyncStatus('syncing');
    setError(null);

    try {
      await syncTransactions();
      setSyncStatus('success');
      
      // Reload sync status after successful sync
      setTimeout(() => {
        loadSyncStatus();
        setSyncStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error('Manual sync failed:', error);
      setSyncStatus('failed');
      setError('Sync failed. Please try again.');
      
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }
  };

  /**
   * Get status icon and color
   */
  const getStatusDisplay = () => {
    switch (connectionHealth) {
      case 'healthy':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          color: 'green',
          text: 'Connected'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          color: 'yellow',
          text: 'Warning'
        };
      case 'error':
        return {
          icon: <WifiOff className="w-4 h-4 text-red-600" />,
          color: 'red',
          text: 'Disconnected'
        };
      default:
        return {
          icon: <Wifi className="w-4 h-4 text-gray-600" />,
          color: 'gray',
          text: 'Unknown'
        };
    }
  };

  /**
   * Format time since last sync
   */
  const formatTimeSince = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const lastSync = new Date(timestamp);
    const diffMs = now - lastSync;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Card className="p-4" data-testid="sync-status-widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Sync Status</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {statusDisplay.icon}
          <Badge variant={statusDisplay.color}>
            {statusDisplay.text}
          </Badge>
        </div>
      </div>

      {/* Sync Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Sync</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900">
              {formatTimeSince(lastSync?.timestamp)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">New Transactions</span>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span className="text-gray-900">{newTransactions}</span>
          </div>
        </div>

        {lastSync && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Transactions</span>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-green-400" />
              <span className="text-gray-900">{transactions.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex space-x-2">
        <Button
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Sync Now
            </>
          )}
        </Button>
        
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="outline"
        >
          {isExpanded ? 'Hide' : 'Details'}
        </Button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
            Sync Details
          </h4>
          
          {lastSync && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Sync Time</span>
                <span className="text-gray-900">
                  {new Date(lastSync.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Sync Duration</span>
                <span className="text-gray-900">
                  {lastSync.duration ? `${lastSync.duration}ms` : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Transactions Synced</span>
                <span className="text-gray-900">
                  {lastSync.transactionsCount || 0}
                </span>
              </div>
              
              {lastSync.accountId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Account</span>
                  <span className="text-gray-900">
                    ****{lastSync.accountId.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Connection Health Details */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Connection Health</span>
              <Badge variant={statusDisplay.color} className="text-xs">
                {connectionHealth}
              </Badge>
            </div>
            
            {connectionHealth === 'warning' && (
              <p className="text-xs text-yellow-700 mt-1">
                Last sync was more than 24 hours ago. Consider syncing manually.
              </p>
            )}
            
            {connectionHealth === 'error' && (
              <p className="text-xs text-red-700 mt-1">
                Bank connection may be experiencing issues. Check your credentials.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SyncStatusWidget; 