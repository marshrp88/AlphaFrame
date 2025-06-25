/**
 * ComponentShowcase.jsx - AlphaFrame Phase X Sprint 2
 * 
 * Purpose: A comprehensive showcase of all design system components
 * with interactive examples and design token documentation.
 * 
 * Procedure:
 * 1. Demonstrates all Sprint 1 and Sprint 2 components
 * 2. Provides interactive examples for each component
 * 3. Shows design token usage and documentation
 * 4. Includes accessibility and responsive testing
 * 
 * Conclusion: Creates a complete design system playground
 * that helps developers understand and test all components.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './ComponentShowcase.css';

// Import all components from index
import {
  CompositeCard,
  PrimaryButton,
  InputField,
  Modal,
  Dropdown,
  Tabs,
  Select,
  Checkbox
} from './index';

/**
 * ComponentShowcase Component
 * @returns {JSX.Element} The rendered component showcase
 */
export function ComponentShowcase() {
  // State for interactive examples
  const [showModal, setShowModal] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [selectedSelect, setSelectedSelect] = useState('');
  const [checkboxState, setCheckboxState] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const dropdownItems = [
    { value: 'option1', label: 'Option 1', description: 'First option' },
    { value: 'option2', label: 'Option 2', description: 'Second option' },
    { value: 'option3', label: 'Option 3', description: 'Third option' }
  ];

  const selectOptions = [
    { value: 'savings', label: 'Savings Account' },
    { value: 'checking', label: 'Checking Account' },
    { value: 'investment', label: 'Investment Account' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', content: 'Overview content here' },
    { id: 'details', label: 'Details', content: 'Details content here' },
    { id: 'settings', label: 'Settings', content: 'Settings content here' }
  ];

  return (
    <motion.div 
      className="component-showcase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="showcase-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1>AlphaFrame Design System</h1>
        <p>Phase X - Motion Layer & Final Polish</p>
      </motion.header>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Design Tokens</h2>
        <div className="token-grid">
          <div className="token-category">
            <h3>Colors</h3>
            <div className="color-tokens">
              <div className="color-swatch" style={{ backgroundColor: 'var(--color-primary)' }}>
                <span>Primary</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: 'var(--color-secondary)' }}>
                <span>Secondary</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: 'var(--color-success)' }}>
                <span>Success</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: 'var(--color-error)' }}>
                <span>Error</span>
              </div>
            </div>
          </div>
          
          <div className="token-category">
            <h3>Spacing</h3>
            <div className="spacing-tokens">
              <div className="spacing-item" style={{ width: 'var(--spacing-xs)' }}>XS</div>
              <div className="spacing-item" style={{ width: 'var(--spacing-sm)' }}>SM</div>
              <div className="spacing-item" style={{ width: 'var(--spacing-md)' }}>MD</div>
              <div className="spacing-item" style={{ width: 'var(--spacing-lg)' }}>LG</div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>Composite Card</h2>
        <div className="card-demo">
          <CompositeCard
            title="Financial Overview"
            subtitle="Your current financial status"
            icon="💰"
            actions={[
              { label: 'View Details', onClick: () => console.log('View Details') },
              { label: 'Edit', onClick: () => console.log('Edit') }
            ]}
          >
            <p>This card demonstrates the composite design pattern with motion animations.</p>
          </CompositeCard>
        </div>
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2>Primary Button</h2>
        <div className="button-demo">
          <div className="button-row">
            <PrimaryButton variant="primary" size="small">Small</PrimaryButton>
            <PrimaryButton variant="primary" size="medium">Medium</PrimaryButton>
            <PrimaryButton variant="primary" size="large">Large</PrimaryButton>
          </div>
          <div className="button-row">
            <PrimaryButton variant="secondary">Secondary</PrimaryButton>
            <PrimaryButton variant="outline">Outline</PrimaryButton>
            <PrimaryButton variant="ghost">Ghost</PrimaryButton>
          </div>
          <div className="button-row">
            <PrimaryButton loading>Loading</PrimaryButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Input Field</h2>
        <div className="input-demo">
          <InputField
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            required
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            type="password"
            error="Password is required"
          />
          <InputField
            label="Amount"
            placeholder="0.00"
            type="number"
            prefix="$"
            suffix="USD"
          />
        </div>
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2>Modal</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>
          Open Modal
        </PrimaryButton>
        
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Motion Demo Modal"
          size="medium"
        >
          <p>This modal demonstrates smooth enter/exit animations with backdrop interactions.</p>
          <div className="modal-actions">
            <PrimaryButton onClick={() => setShowModal(false)}>
              Close
            </PrimaryButton>
          </div>
        </Modal>
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2>Dropdown</h2>
        <Dropdown
          items={dropdownItems}
          onSelect={setSelectedDropdown}
          placeholder="Select an option"
        />
        {selectedDropdown && (
          <p>Selected: {selectedDropdown.label}</p>
        )}
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2>Tabs</h2>
        <Tabs
          tabs={tabs}
          defaultTab="overview"
          onTabChange={setActiveTab}
        />
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h2>Select</h2>
        <Select
          options={selectOptions}
          value={selectedSelect}
          onChange={setSelectedSelect}
          placeholder="Choose account type"
          searchable
        />
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <h2>Checkbox</h2>
        <div className="checkbox-demo">
          <Checkbox
            checked={checkboxState}
            onChange={setCheckboxState}
            label="I agree to the terms and conditions"
          />
          <Checkbox
            label="Subscribe to newsletter"
            indeterminate
          />
          <Checkbox
            label="Disabled option"
            disabled
          />
        </div>
      </motion.section>

      <motion.section 
        className="showcase-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <h2>Motion Presets</h2>
        <div className="motion-demo">
          <motion.div
            className="motion-example"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hover & Tap
          </motion.div>
          <motion.div
            className="motion-example"
            animate={{ 
              x: [0, 100, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Animated
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}

// PropTypes for runtime validation
ComponentShowcase.propTypes = {};

export default ComponentShowcase; 