/**
 * UpgradePage.jsx - PHASE 5 IMPLEMENTATION
 * 
 * Purpose: Provides upgrade and billing interface with Stripe checkout placeholder,
 * plan details, upgrade CTA, and billing status for the MVEP rebuild.
 * 
 * Current Status: Stripe integration placeholder, Pro gating ready
 */

import React from 'react';
import StyledButton from '../components/ui/StyledButton.jsx';
import CompositeCard from '../components/ui/CompositeCard.jsx';
import { useAuthStore } from '../core/store/authStore.js';

const plans = [
  {
    name: 'Free',
    price: '$0/mo',
    features: [
      'Up to 3 rules',
      'Basic insights',
      'Single account',
      'Community support'
    ],
    cta: 'Current Plan',
    pro: false
  },
  {
    name: 'Pro',
    price: '$12/mo',
    features: [
      'Unlimited rules',
      'Advanced insights',
      'Multiple accounts',
      'Priority support',
      'Early access to new features'
    ],
    cta: 'Upgrade to Pro',
    pro: true
  }
];

const UpgradePage = () => {
  const { user } = useAuthStore();
  // Placeholder: Assume all users are Free unless user.role === 'PREMIUM' or 'ADMIN'
  const isPro = user && (user.role === 'PREMIUM' || user.role === 'ADMIN');

  const handleUpgrade = () => {
    // Placeholder: Replace with real Stripe checkout integration
    alert('Stripe checkout would launch here.');
  };

  return (
    <div className="upgrade-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Upgrade Your AlphaFrame Experience</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <CompositeCard key={plan.name} variant="elevated" className="plan-card">
              <div className="flex flex-col items-center py-8">
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <ul className="mb-6 text-gray-700 dark:text-gray-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="mb-1 flex items-center">
                      <span className="mr-2">{plan.pro ? '⭐' : '✔️'}</span> {feature}
                    </li>
                  ))}
                </ul>
                {plan.pro ? (
                  isPro ? (
                    <StyledButton variant="secondary" disabled>
                      Pro Plan Active
                    </StyledButton>
                  ) : (
                    <StyledButton variant="default" onClick={handleUpgrade}>
                      {plan.cta}
                    </StyledButton>
                  )
                ) : (
                  isPro ? (
                    <StyledButton variant="outline" disabled>
                      Included
                    </StyledButton>
                  ) : (
                    <StyledButton variant="secondary" disabled>
                      {plan.cta}
                    </StyledButton>
                  )
                )}
              </div>
            </CompositeCard>
          ))}
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>
            <strong>Billing status:</strong> {isPro ? 'Pro (Active)' : 'Free (Upgrade available)'}
          </p>
          <p className="mt-2">
            Stripe integration is in placeholder mode. Connect your Stripe account for live billing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage; 