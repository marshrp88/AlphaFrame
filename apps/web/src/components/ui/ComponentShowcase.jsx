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
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' }
  ];

  const selectOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' }
  ];

  const tabsData = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="showcase__section">
          <h3>Design System Overview</h3>
          <p>Welcome to the AlphaFrame Design System showcase. This demonstrates all components built with design tokens for consistent styling.</p>
          <CompositeCard>
            <h4>Key Features</h4>
            <ul>
              <li>Design token-based styling</li>
              <li>Accessibility compliance</li>
              <li>Dark mode support</li>
              <li>Responsive design</li>
              <li>TypeScript support</li>
            </ul>
          </CompositeCard>
        </div>
      )
    },
    {
      id: 'components',
      label: 'Components',
      content: (
        <div className="showcase__section">
          <h3>All Components</h3>
          <p>Explore all available components with interactive examples.</p>
        </div>
      )
    },
    {
      id: 'tokens',
      label: 'Design Tokens',
      content: (
        <div className="showcase__section">
          <h3>Design Tokens</h3>
          <p>All components use CSS custom properties for consistent theming.</p>
          <CompositeCard>
            <h4>Available Tokens</h4>
            <div className="token-grid">
              <div className="token-item">
                <span className="token-name">--color-primary-500</span>
                <span className="token-value">#3b82f6</span>
              </div>
              <div className="token-item">
                <span className="token-name">--spacing-md</span>
                <span className="token-value">1rem</span>
              </div>
              <div className="token-item">
                <span className="token-name">--border-radius-md</span>
                <span className="token-value">0.5rem</span>
              </div>
              <div className="token-item">
                <span className="token-name">--font-size-base</span>
                <span className="token-value">1rem</span>
              </div>
            </div>
          </CompositeCard>
        </div>
      )
    }
  ];

  return (
    <div className="component-showcase">
      <header className="showcase__header">
        <h1>AlphaFrame Design System</h1>
        <p>Phase X Sprint 2 - Advanced Components</p>
      </header>

      <Tabs
        tabs={tabsData}
        defaultTab="overview"
        onTabChange={setActiveTab}
        variant="pills"
        size="lg"
      />

      {activeTab === 'components' && (
        <div className="showcase__content">
          {/* Modal Component */}
          <section className="showcase__section">
            <h2>Modal Component</h2>
            <p>A flexible modal component with backdrop, animations, and accessibility features.</p>
            
            <div className="showcase__examples">
              <PrimaryButton
                variant="primary"
                size="md"
                onClick={() => setModalOpen(true)}
              >
                Open Modal
              </PrimaryButton>
            </div>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Example Modal"
              size="md"
              footer={
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <PrimaryButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </PrimaryButton>
                  <PrimaryButton
                    variant="primary"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Confirm
                  </PrimaryButton>
                </div>
              }
            >
              <p>This is an example modal with custom content. It demonstrates the modal component's capabilities including:</p>
              <ul>
                <li>Backdrop click to close</li>
                <li>Escape key to close</li>
                <li>Focus management</li>
                <li>Custom footer actions</li>
              </ul>
            </Modal>
          </section>

          {/* Dropdown Component */}
          <section className="showcase__section">
            <h2>Dropdown Component</h2>
            <p>A searchable dropdown with keyboard navigation and multiple selection support.</p>
            
            <div className="showcase__examples">
              <div className="example-row">
                <Dropdown
                  options={dropdownOptions}
                  value={dropdownValue}
                  onChange={setDropdownValue}
                  placeholder="Select an option..."
                  label="Basic Dropdown"
                  searchable
                />
              </div>
              
              <div className="example-row">
                <Dropdown
                  options={dropdownOptions}
                  value={dropdownValue}
                  onChange={setDropdownValue}
                  placeholder="Select multiple..."
                  label="Multiple Selection"
                  multiple
                  searchable
                />
              </div>
            </div>
          </section>

          {/* Tabs Component */}
          <section className="showcase__section">
            <h2>Tabs Component</h2>
            <p>Flexible tabs with multiple variants and orientations.</p>
            
            <div className="showcase__examples">
              <Tabs
                tabs={[
                  {
                    id: 'default',
                    label: 'Default',
                    content: <p>Default tab content with underline variant.</p>
                  },
                  {
                    id: 'pills',
                    label: 'Pills',
                    content: <p>Pills variant tab content.</p>
                  },
                  {
                    id: 'with-icon',
                    label: 'With Icon',
                    icon: '📊',
                    content: <p>Tab with icon and badge.</p>,
                    badge: '3'
                  }
                ]}
                variant="default"
                size="md"
              />
            </div>
          </section>

          {/* Select Component */}
          <section className="showcase__section">
            <h2>Select Component</h2>
            <p>A native select replacement with enhanced styling and functionality.</p>
            
            <div className="showcase__examples">
              <div className="example-row">
                <Select
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Choose a fruit..."
                  label="Fruit Selection"
                  clearable
                />
              </div>
              
              <div className="example-row">
                <Select
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Select multiple fruits..."
                  label="Multiple Fruits"
                  multiple
                  clearable
                />
              </div>
            </div>
          </section>

          {/* Checkbox Component */}
          <section className="showcase__section">
            <h2>Checkbox Component</h2>
            <p>Custom checkbox with support for indeterminate state and validation.</p>
            
            <div className="showcase__examples">
              <div className="example-row">
                <Checkbox
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                  label="Accept terms and conditions"
                  size="md"
                />
              </div>
              
              <div className="example-row">
                <Checkbox
                  checked={true}
                  label="Small checkbox"
                  size="sm"
                />
              </div>
              
              <div className="example-row">
                <Checkbox
                  checked={false}
                  label="Large checkbox"
                  size="lg"
                />
              </div>
              
              <div className="example-row">
                <Checkbox
                  checked={false}
                  label="Disabled checkbox"
                  disabled
                />
              </div>
              
              <div className="example-row">
                <Checkbox
                  checked={false}
                  label="Checkbox with error"
                  error="This field is required"
                />
              </div>
            </div>
          </section>

          {/* Input Field Component */}
          <section className="showcase__section">
            <h2>Input Field Component</h2>
            <p>Enhanced input field with validation, prefixes, and suffixes.</p>
            
            <div className="showcase__examples">
              <div className="example-row">
                <InputField
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your name..."
                  label="Name"
                  required
                />
              </div>
              
              <div className="example-row">
                <InputField
                  type="email"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your email..."
                  label="Email"
                  prefix="📧"
                  error="Please enter a valid email address"
                />
              </div>
              
              <div className="example-row">
                <InputField
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your password..."
                  label="Password"
                  suffix="👁️"
                />
              </div>
            </div>
          </section>

          {/* Primary Button Component */}
          <section className="showcase__section">
            <h2>Primary Button Component</h2>
            <p>Versatile button component with multiple variants and states.</p>
            
            <div className="showcase__examples">
              <div className="example-row">
                <PrimaryButton variant="primary" size="sm">
                  Small Primary
                </PrimaryButton>
                <PrimaryButton variant="primary" size="md">
                  Medium Primary
                </PrimaryButton>
                <PrimaryButton variant="primary" size="lg">
                  Large Primary
                </PrimaryButton>
              </div>
              
              <div className="example-row">
                <PrimaryButton variant="secondary" size="md">
                  Secondary
                </PrimaryButton>
                <PrimaryButton variant="outline" size="md">
                  Outline
                </PrimaryButton>
                <PrimaryButton variant="ghost" size="md">
                  Ghost
                </PrimaryButton>
              </div>
              
              <div className="example-row">
                <PrimaryButton variant="primary" size="md" loading>
                  Loading
                </PrimaryButton>
                <PrimaryButton variant="primary" size="md" disabled>
                  Disabled
                </PrimaryButton>
              </div>
            </div>
          </section>

          {/* Composite Card Component */}
          <section className="showcase__section">
            <h2>Composite Card Component</h2>
            <p>Flexible card component for content organization.</p>
            
            <div className="showcase__examples">
              <CompositeCard>
                <h3>Card Title</h3>
                <p>This is a basic card with some content. Cards are great for organizing information and creating visual hierarchy.</p>
                <div style={{ marginTop: '1rem' }}>
                  <PrimaryButton variant="primary" size="sm">
                    Action
                  </PrimaryButton>
                </div>
              </CompositeCard>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// PropTypes for runtime validation
ComponentShowcase.propTypes = {};

export default ComponentShowcase; 