import { useEffect, useState, useRef } from 'react';
import { getDemoTransactions } from '../../lib/demo-data';
import { useDataStore } from '../../core/store/dataStore';
import RuleStatusCard from '../ui/RuleStatusCard';
import Button from '../ui/Button';
import CompositeCard from '../ui/CompositeCard';
import { useToast } from '../ui/use-toast';

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
    <div className="dashboard-container" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header Section */}
      <div className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-text-primary)' }}>
            Financial Dashboard
          </h1>
          <p style={{ margin: '0.5rem 0', color: 'var(--color-text-secondary)' }}>
            Monitor your finances and automation rules
          </p>
        </div>
        <Button 
          variant="default" 
          size="md"
          onClick={() => window.location.href = '/rules'}
          style={{ fontWeight: 'bold' }}
        >
          ➕ Create Rule
        </Button>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        marginBottom: '2rem' 
      }}>
        {/* Net Cash Flow Card */}
        <CompositeCard variant="elevated" className="cash-flow-card">
          <h2 style={{ margin: 0, fontFamily: 'var(--font-family-base)', color: 'var(--color-text-primary)' }}>
            Net Cash Flow
          </h2>
          <div style={{ fontSize: '2rem', color: 'var(--color-accent)', margin: '1rem 0', fontWeight: 'bold' }}>
            ${data.net}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Last updated: {data.lastUpdated}
          </div>
        </CompositeCard>

        {/* Rules Overview Card */}
        <CompositeCard variant="elevated" className="rules-overview-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-family-base)', color: 'var(--color-text-primary)' }}>
              Automation Rules
            </h2>
            {live && <span style={{ background: 'var(--color-success-100)', color: 'var(--color-success-700)', borderRadius: 8, padding: '0.2em 0.7em', fontSize: 12, marginLeft: 8 }}>LIVE</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                {activeRules.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Active Rules</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>
                {inactiveRules.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Inactive Rules</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                {triggeredRules.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Total Triggers</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAllRules(!showAllRules)}
            style={{ marginTop: '1rem' }}
          >
            {showAllRules ? 'Hide Rules' : 'View All Rules'}
          </Button>
        </CompositeCard>

        {/* Latest Triggered Rule Card */}
        <CompositeCard variant="elevated" className="latest-trigger-card" data-testid="latest-triggered-rule">
          <h2 style={{ margin: 0, fontFamily: 'var(--font-family-base)', color: 'var(--color-text-primary)' }}>
            Latest Trigger
          </h2>
          {latestTriggeredRule ? (
            <div style={{ margin: '1rem 0', background: 'var(--color-success-50)', borderRadius: 8, padding: 8, border: '2px solid var(--color-success-200)' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-success-800)' }}>
                {latestTriggeredRule.ruleName}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Transaction: {latestTriggeredRule.transactionId}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-success)' }}>
                {new Date(latestTriggeredRule.triggeredAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '1.1rem', margin: '1rem 0', color: 'var(--color-text-secondary)' }}>
              No rules triggered yet
            </div>
          )}
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
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