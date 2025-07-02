/**
 * UpgradePage.jsx - Monetization Conversion Page
 * 
 * Purpose: Present clear upgrade options and value propositions to convert
 * free users to paid Pro subscribers.
 * 
 * Procedure:
 * 1. Display pricing plans with feature comparisons
 * 2. Highlight Pro benefits and exclusive features
 * 3. Provide clear upgrade CTAs with Stripe integration
 * 4. Track conversion analytics and user interactions
 * 5. Handle payment processing and subscription management
 * 
 * Conclusion: Creates clear monetization path with compelling value
 * propositions that drive user conversion to paid plans.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import PageLayout from '../components/PageLayout';
import { 
  Check, 
  Crown, 
  Zap, 
  Shield, 
  BarChart3, 
  Bell, 
  CreditCard,
  ArrowRight,
  Star,
  Users,
  Clock,
  Lock
} from 'lucide-react';

const UpgradePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    // Load user statistics for personalized messaging
    const rules = JSON.parse(localStorage.getItem('alphaframe_user_rules') || '[]');
    const transactions = JSON.parse(localStorage.getItem('alphaframe_user_transactions') || '[]');
    
    setUserStats({
      rulesCount: rules.length,
      transactionsCount: transactions.length,
      daysActive: Math.floor((Date.now() - new Date(localStorage.getItem('alphaframe_user_created') || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
    });
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started with financial automation',
      features: [
        'Up to 3 automation rules',
        'Basic transaction monitoring',
        'Email notifications',
        'Standard support',
        'Mobile app access'
      ],
      limitations: [
        'Limited to 3 rules',
        'No advanced analytics',
        'No SMS notifications',
        'No priority support'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: selectedPlan === 'monthly' ? 9.99 : 99.99,
      period: selectedPlan === 'monthly' ? 'month' : 'year',
      description: 'Unlock advanced automation and insights',
      features: [
        'Unlimited automation rules',
        'Advanced analytics & insights',
        'SMS & email notifications',
        'Priority support',
        'Custom rule templates',
        'Fraud detection alerts',
        'Subscription tracking',
        'Goal progress monitoring',
        'Export data & reports',
        'API access'
      ],
      savings: selectedPlan === 'yearly' ? 'Save 17%' : null,
      cta: 'Upgrade to Pro',
      popular: true
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId === 'free') {
      toast({
        title: "You're already on the Free plan",
        description: "Upgrade to Pro to unlock advanced features.",
        variant: "default"
      });
      return;
    }
    
    setSelectedPlan(planId);
  };

  const handleUpgrade = async (plan) => {
    if (plan.id === 'free') {
      return;
    }

    setIsProcessing(true);

    try {
      // Track upgrade attempt
      localStorage.setItem('alphaframe_upgrade_attempted', 'true');
      localStorage.setItem('alphaframe_upgrade_plan', plan.id);
      localStorage.setItem('alphaframe_upgrade_period', selectedPlan);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, simulate successful upgrade
      localStorage.setItem('alphaframe_pro_user', 'true');
      localStorage.setItem('alphaframe_pro_plan', plan.id);
      localStorage.setItem('alphaframe_pro_period', selectedPlan);
      localStorage.setItem('alphaframe_pro_started', new Date().toISOString());

      toast({
        title: "🎉 Welcome to AlphaFrame Pro!",
        description: "Your account has been upgraded. Enjoy unlimited automation!",
        variant: "default"
      });

      // Navigate back to dashboard
      navigate('/dashboard', { 
        state: { 
          upgradeComplete: true,
          plan: plan.id
        }
      });

    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPersonalizedMessage = () => {
    if (!userStats) return null;

    if (userStats.rulesCount >= 3) {
      return {
        title: "You've hit the Free plan limit!",
        description: `You've created ${userStats.rulesCount} rules. Upgrade to Pro for unlimited automation.`
      };
    }

    if (userStats.transactionsCount > 50) {
      return {
        title: "You're actively using AlphaFrame!",
        description: `You've analyzed ${userStats.transactionsCount} transactions. Unlock advanced insights with Pro.`
      };
    }

    return {
      title: "Ready to level up your financial automation?",
      description: "Join thousands of users who've upgraded to Pro for advanced features."
    };
  };

  const personalizedMessage = getPersonalizedMessage();

  return (
    <PageLayout
      title="Upgrade to Pro"
      description="Unlock advanced automation and insights"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-primary-50)',
              color: 'var(--color-primary-700)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: '1rem'
            }}
          >
            <Crown size={16} />
            <span>Pro Features</span>
          </motion.div>

          <h1 style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            {personalizedMessage?.title || "Upgrade to AlphaFrame Pro"}
          </h1>

          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            {personalizedMessage?.description || "Unlock unlimited automation rules, advanced analytics, and priority support."}
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Monthly
            </span>
            <button
              onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'yearly' : 'monthly')}
              style={{
                position: 'relative',
                width: '60px',
                height: '32px',
                backgroundColor: selectedPlan === 'yearly' ? 'var(--color-primary-600)' : 'var(--color-muted-300)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <motion.div
                animate={{ x: selectedPlan === 'yearly' ? 28 : 2 }}
                style={{
                  position: 'absolute',
                  top: '2px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </button>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Yearly
            </span>
            {selectedPlan === 'yearly' && (
              <span style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--color-success-100)',
                color: 'var(--color-success-700)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                position: 'relative',
                padding: '2rem',
                backgroundColor: 'var(--color-surface)',
                border: plan.popular 
                  ? '2px solid var(--color-primary-500)' 
                  : '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '0.25rem 1rem',
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Most Popular
                </div>
              )}

              <h3 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                {plan.name}
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontSize: 'var(--font-size-4xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)'
                }}>
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    /{plan.period}
                  </span>
                )}
                {plan.price === 0 && (
                  <span style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    forever
                  </span>
                )}
              </div>

              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: '2rem',
                lineHeight: '1.5'
              }}>
                {plan.description}
              </p>

              <button
                onClick={() => handleUpgrade(plan)}
                disabled={isProcessing || plan.id === 'free'}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  backgroundColor: plan.id === 'free' 
                    ? 'var(--color-muted-200)' 
                    : 'var(--color-primary-600)',
                  color: plan.id === 'free' 
                    ? 'var(--color-text-secondary)' 
                    : 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  cursor: plan.id === 'free' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '2rem',
                  transition: 'all 0.2s ease',
                  opacity: isProcessing ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (plan.id !== 'free' && !isProcessing) {
                    e.target.style.backgroundColor = 'var(--color-primary-700)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.id !== 'free') {
                    e.target.style.backgroundColor = 'var(--color-primary-600)';
                  }
                }}
              >
                {isProcessing ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid currentColor',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    {plan.id === 'free' ? 'Current Plan' : 'Upgrade Now'}
                    {plan.id !== 'free' && <ArrowRight size={16} />}
                  </>
                )}
              </button>

              {/* Features List */}
              <div style={{ textAlign: 'left' }}>
                <h4 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem'
                }}>
                  What's included:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <Check size={14} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--color-muted-50)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            Trusted by thousands of users
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ color: 'var(--color-success-600)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)' }}>Bank-level security</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Users size={16} style={{ color: 'var(--color-primary-600)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)' }}>10,000+ active users</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: 'var(--color-warning-600)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)' }}>99.9% uptime</span>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Frequently Asked Questions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                Can I cancel anytime?
              </h4>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
                Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                Is my data secure?
              </h4>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
                Absolutely. We use bank-level encryption and never store your banking credentials. All data is encrypted in transit and at rest.
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                What payment methods do you accept?
              </h4>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
                We accept all major credit cards, debit cards, and digital wallets through our secure payment processor.
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                Do you offer a free trial?
              </h4>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
                Yes! You can try Pro features free for 14 days. No credit card required to start your trial.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PageLayout>
  );
};

export default UpgradePage; 