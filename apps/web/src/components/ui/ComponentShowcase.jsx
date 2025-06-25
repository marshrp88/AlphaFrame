/**
 * ComponentShowcase.jsx - AlphaFrame Phase X Sprint 1
 * 
 * Purpose: A showcase component to demonstrate and test the new design system
 * components (CompositeCard, PrimaryButton, InputField) with various states
 * and configurations.
 * 
 * Procedure:
 * 1. Displays all component variants and states
 * 2. Provides interactive examples for testing
 * 3. Shows design token usage in action
 * 4. Validates component integration and styling
 * 
 * Conclusion: Serves as both a testing ground and documentation
 * for the new design system components.
 */

import React, { useState } from 'react';
import CompositeCard from './CompositeCard';
import PrimaryButton from './PrimaryButton';
import InputField from './InputField';
import './ComponentShowcase.css';

/**
 * ComponentShowcase Component
 * @returns {JSX.Element} The rendered showcase component
 */
export function ComponentShowcase() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="component-showcase">
      <header className="component-showcase__header">
        <h1>AlphaFrame Design System - Phase X Sprint 1</h1>
        <p>Component showcase demonstrating the new design tokens and reusable components</p>
      </header>

      {/* CompositeCard Showcase */}
      <section className="component-showcase__section">
        <h2>CompositeCard Component</h2>
        <div className="component-showcase__grid">
          <CompositeCard
            title="Default Card"
            subtitle="This is a default card with basic content"
            className="component-showcase__card"
          >
            <p>This card demonstrates the default styling with design tokens.</p>
            <PrimaryButton variant="primary" size="sm">
              Action Button
            </PrimaryButton>
          </CompositeCard>

          <CompositeCard
            title="Card with Icon"
            subtitle="Card featuring an icon and enhanced styling"
            icon="📊"
            className="component-showcase__card"
          >
            <p>This card includes an icon and demonstrates the enhanced visual hierarchy.</p>
            <div className="component-showcase__button-group">
              <PrimaryButton variant="outline" size="sm">
                Cancel
              </PrimaryButton>
              <PrimaryButton variant="primary" size="sm">
                Confirm
              </PrimaryButton>
            </div>
          </CompositeCard>

          <CompositeCard
            title="Interactive Card"
            subtitle="Card with interactive elements"
            className="component-showcase__card component-showcase__card--interactive"
          >
            <p>This card demonstrates interactive states and hover effects.</p>
            <InputField
              placeholder="Enter some text..."
              size="sm"
            />
          </CompositeCard>
        </div>
      </section>

      {/* PrimaryButton Showcase */}
      <section className="component-showcase__section">
        <h2>PrimaryButton Component</h2>
        
        <div className="component-showcase__subsection">
          <h3>Button Variants</h3>
          <div className="component-showcase__button-grid">
            <PrimaryButton variant="primary">Primary</PrimaryButton>
            <PrimaryButton variant="secondary">Secondary</PrimaryButton>
            <PrimaryButton variant="outline">Outline</PrimaryButton>
            <PrimaryButton variant="ghost">Ghost</PrimaryButton>
          </div>
        </div>

        <div className="component-showcase__subsection">
          <h3>Button Sizes</h3>
          <div className="component-showcase__button-grid">
            <PrimaryButton size="sm">Small</PrimaryButton>
            <PrimaryButton size="md">Medium</PrimaryButton>
            <PrimaryButton size="lg">Large</PrimaryButton>
          </div>
        </div>

        <div className="component-showcase__subsection">
          <h3>Button States</h3>
          <div className="component-showcase__button-grid">
            <PrimaryButton>Normal</PrimaryButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
            <PrimaryButton loading>Loading</PrimaryButton>
          </div>
        </div>

        <div className="component-showcase__subsection">
          <h3>Buttons with Icons</h3>
          <div className="component-showcase__button-grid">
            <PrimaryButton icon="→" iconPosition="right">
              Continue
            </PrimaryButton>
            <PrimaryButton icon="←" iconPosition="left">
              Back
            </PrimaryButton>
            <PrimaryButton icon="⭐" variant="outline">
              Favorite
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* InputField Showcase */}
      <section className="component-showcase__section">
        <h2>InputField Component</h2>
        
        <div className="component-showcase__subsection">
          <h3>Input Variants</h3>
          <div className="component-showcase__input-grid">
            <InputField
              label="Text Input"
              placeholder="Enter text here..."
              helperText="This is helper text"
            />
            <InputField
              label="Email Input"
              type="email"
              placeholder="Enter email..."
              prefix="@"
            />
            <InputField
              label="Password Input"
              type="password"
              placeholder="Enter password..."
              suffix="🔒"
            />
          </div>
        </div>

        <div className="component-showcase__subsection">
          <h3>Input Sizes</h3>
          <div className="component-showcase__input-grid">
            <InputField
              label="Small Input"
              size="sm"
              placeholder="Small input..."
            />
            <InputField
              label="Medium Input"
              size="md"
              placeholder="Medium input..."
            />
            <InputField
              label="Large Input"
              size="lg"
              placeholder="Large input..."
            />
          </div>
        </div>

        <div className="component-showcase__subsection">
          <h3>Input States</h3>
          <div className="component-showcase__input-grid">
            <InputField
              label="Normal Input"
              placeholder="Normal state..."
            />
            <InputField
              label="Disabled Input"
              placeholder="Disabled state..."
              disabled
            />
            <InputField
              label="Error Input"
              placeholder="Error state..."
              error="This field has an error"
            />
          </div>
        </div>
      </section>

      {/* Interactive Form Example */}
      <section className="component-showcase__section">
        <h2>Interactive Form Example</h2>
        <CompositeCard
          title="Contact Form"
          subtitle="Demonstrates component integration"
          className="component-showcase__form-card"
        >
          <form onSubmit={handleSubmit} className="component-showcase__form">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
              error={errors.name}
              required
            />
            
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              error={errors.email}
              required
            />
            
            <InputField
              label="Message"
              name="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter your message"
              error={errors.message}
              required
            />
            
            <div className="component-showcase__form-actions">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({ name: '', email: '', message: '' });
                  setErrors({});
                }}
              >
                Clear Form
              </PrimaryButton>
              <PrimaryButton type="submit" variant="primary">
                Submit Form
              </PrimaryButton>
            </div>
          </form>
        </CompositeCard>
      </section>

      {/* Design Token Information */}
      <section className="component-showcase__section">
        <h2>Design Token Usage</h2>
        <CompositeCard
          title="Current Design Tokens"
          subtitle="CSS custom properties in use"
          className="component-showcase__tokens-card"
        >
          <div className="component-showcase__tokens-grid">
            <div className="component-showcase__token-group">
              <h4>Colors</h4>
              <div className="component-showcase__token-item">
                <span className="component-showcase__token-name">--color-primary-600</span>
                <span className="component-showcase__token-value">#2563eb</span>
              </div>
              <div className="component-showcase__token-item">
                <span className="component-showcase__token-name">--color-gray-700</span>
                <span className="component-showcase__token-value">#374151</span>
              </div>
            </div>
            
            <div className="component-showcase__token-group">
              <h4>Spacing</h4>
              <div className="component-showcase__token-item">
                <span className="component-showcase__token-name">--spacing-sm</span>
                <span className="component-showcase__token-value">0.75rem</span>
              </div>
              <div className="component-showcase__token-item">
                <span className="component-showcase__token-name">--spacing-md</span>
                <span className="component-showcase__token-value">1rem</span>
              </div>
            </div>
            
            <div className="component-showcase__token-group">
              <h4>Typography</h4>
              <div className="component-showcase__token-item">
                <span className="component-showcase__token-name">--font-size-base</span>
                <span className="component-showcase__token-value">1rem</span>
              </div>
              <div className="component-showcase__token-item">
                <span className="component-showcase__token-name">--font-weight-medium</span>
                <span className="component-showcase__token-value">500</span>
              </div>
            </div>
          </div>
        </CompositeCard>
      </section>
    </div>
  );
}

export default ComponentShowcase; 