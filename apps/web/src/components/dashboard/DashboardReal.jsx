import { useEffect, useState, useRef } from 'react';
import { getDemoTransactions } from '../../lib/demo-data';
import { useDataStore } from '../../core/store/dataStore';
import RuleStatusCard from '../ui/RuleStatusCard';
import Button from '../ui/Button';
import CompositeCard from '../ui/CompositeCard';
import { useToast } from '../ui/use-toast';
import './DashboardReal.css';

export default function DashboardReal() {
  const [data, setData] = useState(null);
  const { 
    rules, 
    transactions, 
    triggeredRules, 
    latestTriggeredRule,
    isLoading,
    error 
  } = useDataStore();
  
  const [showAllRules, setShowAllRules] = useState(false);
  const [live, setLive] = useState(true);
  const { automationToast } = useToast();
  const prevTriggeredIds = useRef(new Set());

  // Auto-refresh dashboard when rules or triggers change
  useEffect(() => {
    setLive(true);
    const timeout = setTimeout(() => setLive(false), 2000);
    return () => clearTimeout(timeout);
  }, [rules, triggeredRules]);

  // Show toast for new rule triggers
  useEffect(() => {
    const newTriggers = triggeredRules.filter(t => !prevTriggeredIds.current.has(t.triggeredAt));
    newTriggers.forEach(trigger => {
      automationToast({
        type: 'ruleTriggered',
        ruleName: trigger.ruleName,
        ruleId: trigger.ruleId,
        message: `Triggered by transaction ${trigger.transactionId}`
      });
      prevTriggeredIds.current.add(trigger.triggeredAt);
    });
    // Clean up old triggers to avoid memory leak
    if (prevTriggeredIds.current.size > 100) {
      prevTriggeredIds.current = new Set(triggeredRules.map(t => t.triggeredAt));
    }
  }, [triggeredRules, automationToast]);

  useEffect(() => {
    getDemoTransactions().then(setData);
  }, []);

  useEffect(() => {
    // In demo mode, always force rule evaluation on mount to pick up new transactions injected into localStorage (e.g., by E2E tests)
    if (typeof window !== 'undefined' && sessionStorage.getItem('demo_user') === 'true') {
      // Wait for store to load, then trigger rule evaluation
      setTimeout(() => {
        if (typeof useDataStore.getState().evaluateAndTriggerRules === 'function') {
          useDataStore.getState().evaluateAndTriggerRules().then(() => {
            // Debug: Log rules, transactions, and triggeredRules after evaluation
            const state = useDataStore.getState();
            console.log('DEBUG: rules', state.rules);
            console.log('DEBUG: transactions', state.transactions);
            console.log('DEBUG: triggeredRules', state.triggeredRules);
          });
        }
      }, 200);
    }
  }, []);

  if (!data) return <p>Loading...</p>;

  // Get active rules for display
  const activeRules = rules.filter(rule => rule.isActive);
  const inactiveRules = rules.filter(rule => !rule.isActive);
  
  // Get recent triggered rules (last 5)
  const recentTriggers = triggeredRules.slice(0, 5);

  return (
    <div className="dashboard-container" style={{ 
      maxWidth: 'var(--container-max-width)', 
      margin: '0 auto', 
      padding: 'var(--spacing-lg)',
      minHeight: '100vh',
      background: 'var(--color-bg)'
    }}>
      {/* Header Section */}
      <div className="dashboard-header" style={{ 
        marginBottom: 'var(--spacing-xl)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 'var(--spacing-lg) 0',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            Financial Dashboard
          </h1>
          <p style={{ 
            margin: 'var(--spacing-sm) 0 0 0', 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Monitor your finances and automation rules in real-time
          </p>
        </div>
        <Button 
          variant="default" 
          size="lg"
          onClick={() => window.location.href = '/rules'}
          style={{ 
            fontWeight: 'var(--font-weight-semibold)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          ➕ Create Rule
        </Button>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: 'var(--spacing-xl)', 
        marginBottom: 'var(--spacing-xl)' 
      }}>
        {/* Net Cash Flow Card */}
        <CompositeCard variant="elevated" className="cash-flow-card" style={{
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontFamily: 'var(--font-family-base)', 
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Net Cash Flow
          </h2>
          <div style={{ 
            fontSize: 'var(--text-4xl)', 
            color: 'var(--color-accent)', 
            margin: 'var(--spacing-lg) 0', 
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            ${data.net}
          </div>
          <div style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <span>🕒</span>
            Last updated: {data.lastUpdated}
          </div>
        </CompositeCard>

        {/* Rules Overview Card */}
        <CompositeCard variant="elevated" className="rules-overview-card" style={{
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontFamily: 'var(--font-family-base)', 
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Automation Rules
            </h2>
            {live && (
              <span style={{ 
                background: 'var(--color-success-100)', 
                color: 'var(--color-success-700)', 
                borderRadius: 'var(--radius-full)', 
                padding: 'var(--spacing-xs) var(--spacing-sm)', 
                fontSize: 'var(--text-xs)', 
                fontWeight: 'var(--font-weight-semibold)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🔴 Live
              </span>
            )}
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--spacing-lg)',
            margin: 'var(--spacing-lg) 0' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'var(--font-weight-bold)', 
                color: 'var(--color-success)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                {activeRules.length}
              </div>
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)'
              }}>
                Active Rules
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'var(--font-weight-bold)', 
                color: 'var(--color-warning)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                {inactiveRules.length}
              </div>
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)'
              }}>
                Inactive Rules
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'var(--font-weight-bold)', 
                color: 'var(--color-accent)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                {triggeredRules.length}
              </div>
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)'
              }}>
                Total Triggers
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="md" 
            onClick={() => setShowAllRules(!showAllRules)}
            style={{ 
              marginTop: 'var(--spacing-lg)',
              width: '100%',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {showAllRules ? 'Hide Rules' : 'View All Rules'}
          </Button>
        </CompositeCard>

        {/* Latest Triggered Rule Card */}
        <CompositeCard variant="elevated" className="latest-trigger-card" data-testid="latest-triggered-rule" style={{
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontFamily: 'var(--font-family-base)', 
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Latest Trigger
          </h2>
          {latestTriggeredRule ? (
            <div style={{ 
              margin: 'var(--spacing-lg) 0', 
              background: 'var(--color-success-50)', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--spacing-lg)', 
              border: '2px solid var(--color-success-200)',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 'var(--spacing-sm)',
                right: 'var(--spacing-sm)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                animation: 'pulse 2s infinite'
              }}></div>
              <div style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-weight-bold)', 
                marginBottom: 'var(--spacing-sm)', 
                color: 'var(--color-success-800)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                {latestTriggeredRule.ruleName}
              </div>
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text-secondary)', 
                marginBottom: 'var(--spacing-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <span>💳</span>
                Transaction: {latestTriggeredRule.transactionId}
              </div>
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-success)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                {new Date(latestTriggeredRule.triggeredAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div style={{ 
              fontSize: 'var(--text-lg)', 
              margin: 'var(--spacing-lg) 0', 
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              padding: 'var(--spacing-xl)',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--color-border)'
            }}>
              No rules triggered yet
            </div>
          )}
          <div style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            marginTop: 'var(--spacing-lg)'
          }}>
            <span>🕒</span>
            Last updated: {data.lastUpdated}
          </div>
        </CompositeCard>
      </div>

      {/* Rules Display Section */}
      {showAllRules && (
        <div className="rules-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Your Rules</h2>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => window.location.href = '/rules'}
            >
              Manage Rules
            </Button>
          </div>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loader-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Loading rules...</p>
            </div>
          ) : error ? (
            <CompositeCard variant="elevated" style={{ padding: '1rem', border: '1px solid var(--color-destructive)' }}>
              <p style={{ color: 'var(--color-destructive)', margin: 0 }}>Error loading rules: {error}</p>
            </CompositeCard>
          ) : rules.length === 0 ? (
            <CompositeCard variant="elevated" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>No Rules Yet</h3>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>
                Create your first rule to start automating your financial workflows.
              </p>
              <Button 
                variant="default"
                onClick={() => window.location.href = '/rules'}
              >
                Create Your First Rule
              </Button>
            </CompositeCard>
          ) : (
            <div className="rules-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '1rem' 
            }}>
              {rules.map(rule => (
                <RuleStatusCard
                  key={rule.id}
                  rule={rule}
                  executionResult={{
                    status: triggeredRules.some(trigger => trigger.ruleId === rule.id) ? 'triggered' : 'ok',
                    lastChecked: new Date().toISOString(),
                    matchedTransactions: triggeredRules.filter(trigger => trigger.ruleId === rule.id),
                    totalTransactions: transactions.length,
                    percentage: transactions.length > 0 ? 
                      (triggeredRules.filter(trigger => trigger.ruleId === rule.id).length / transactions.length) * 100 : 0
                  }}
                  showDetails={true}
                  isRealTime={true}
                  // Highlight if just triggered
                  style={triggeredRules.some(trigger => trigger.ruleId === rule.id && Date.now() - new Date(trigger.triggeredAt).getTime() < 10000) ? { border: '2px solid var(--color-success-400)', background: 'var(--color-success-50)' } : {}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity Section */}
      {recentTriggers.length > 0 && (
        <div className="recent-activity-section">
          <h2 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Recent Activity</h2>
          <div className="activity-list" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem' 
          }}>
            {recentTriggers.map((trigger, index) => (
              <CompositeCard key={index} variant="elevated" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {trigger.ruleName}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                      Transaction: {trigger.transactionId}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>
                      {new Date(trigger.triggeredAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: 'var(--color-success-50)', 
                    color: 'var(--color-success)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    TRIGGERED
                  </div>
                </div>
              </CompositeCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 