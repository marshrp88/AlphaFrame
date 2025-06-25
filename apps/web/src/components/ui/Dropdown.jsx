/**
 * Dropdown.jsx - AlphaFrame Phase X Sprint 2
 * 
 * Purpose: A reusable dropdown component that uses design tokens
 * for consistent styling and provides advanced selection patterns.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--color-primary, --border-radius, etc.)
 * 2. Implements proper accessibility with keyboard navigation and ARIA attributes
 * 3. Supports multiple selection modes and search functionality
 * 4. Provides smooth animations and focus management
 * 
 * Conclusion: Creates a polished, accessible dropdown component
 * that maintains visual consistency throughout the application.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

/**
 * Dropdown Component Props
 * @typedef {Object} DropdownProps
 * @property {Array} options - Array of option objects
 * @property {string|Array} [value] - Selected value(s)
 * @property {Function} [onChange] - Change handler
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [label] - Label text
 * @property {boolean} [disabled] - Whether dropdown is disabled
 * @property {string} [size] - Dropdown size ('sm', 'md', 'lg')
 * @property {boolean} [searchable] - Whether dropdown is searchable
 * @property {boolean} [multiple] - Whether multiple selection is allowed
 * @property {string} [className] - Additional CSS classes
 * @property {string} [error] - Error message
 * @property {boolean} [required] - Whether field is required
 */

/**
 * Dropdown Component
 * @param {DropdownProps} props - Component props
 * @returns {JSX.Element} The rendered dropdown component
 */
export function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  disabled = false,
  size = 'md',
  searchable = false,
  multiple = false,
  className = '',
  error,
  required = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    searchable && searchTerm
      ? option.label.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // Get selected options
  const selectedOptions = multiple
    ? options.filter(option => value?.includes(option.value))
    : options.filter(option => option.value === value);

  // Handle dropdown toggle
  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [disabled]);

  // Handle option selection
  const handleOptionSelect = useCallback((option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  }, [multiple, value, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDropdown();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  }, [isOpen, filteredOptions, focusedIndex, handleOptionSelect, toggleDropdown]);

  // Handle search input
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setFocusedIndex(-1);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current) {
      const focusedElement = optionsRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const dropdownClasses = [
    'dropdown',
    `dropdown--${size}`,
    isOpen && 'dropdown--open',
    disabled && 'dropdown--disabled',
    error && 'dropdown--error',
    className
  ].filter(Boolean).join(' ');

  const triggerClasses = [
    'dropdown__trigger',
    `dropdown__trigger--${size}`,
    isOpen && 'dropdown__trigger--open',
    disabled && 'dropdown__trigger--disabled',
    error && 'dropdown__trigger--error'
  ].filter(Boolean).join(' ');

  const renderSelectedText = () => {
    if (multiple) {
      if (selectedOptions.length === 0) {
        return placeholder;
      }
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} items selected`;
    }
    
    return selectedOptions[0]?.label || placeholder;
  };

  const renderOptions = () => {
    if (filteredOptions.length === 0) {
      return (
        <div className="dropdown__option dropdown__option--empty">
          No options found
        </div>
      );
    }

    return filteredOptions.map((option, index) => {
      const isSelected = multiple
        ? value?.includes(option.value)
        : option.value === value;
      const isFocused = index === focusedIndex;

      const optionClasses = [
        'dropdown__option',
        isSelected && 'dropdown__option--selected',
        isFocused && 'dropdown__option--focused',
        disabled && 'dropdown__option--disabled'
      ].filter(Boolean).join(' ');

      return (
        <div
          key={option.value}
          className={optionClasses}
          onClick={() => !disabled && handleOptionSelect(option)}
          onMouseEnter={() => setFocusedIndex(index)}
          role="option"
          aria-selected={isSelected}
        >
          {multiple && (
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="dropdown__checkbox"
            />
          )}
          <span className="dropdown__option-label">{option.label}</span>
          {isSelected && !multiple && (
            <span className="dropdown__checkmark" aria-hidden="true">✓</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="dropdown__container">
      {label && (
        <label className="dropdown__label">
          {label}
          {required && <span className="dropdown__required" aria-label="required">*</span>}
        </label>
      )}
      
      <div ref={dropdownRef} className={dropdownClasses} {...props}>
        <button
          type="button"
          className={triggerClasses}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? 'dropdown-label' : undefined}
        >
          <span className="dropdown__selected-text">
            {renderSelectedText()}
          </span>
          <span className="dropdown__arrow" aria-hidden="true">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>

        {isOpen && (
          <div className="dropdown__menu" role="listbox">
            {searchable && (
              <div className="dropdown__search">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search options..."
                  className="dropdown__search-input"
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
            
            <div ref={optionsRef} className="dropdown__options">
              {renderOptions()}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="dropdown__error">
          {error}
        </div>
      )}
    </div>
  );
}

// PropTypes for runtime validation
Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  searchable: PropTypes.bool,
  multiple: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool
};

// Default props
Dropdown.defaultProps = {
  options: [],
  placeholder: 'Select an option...',
  disabled: false,
  size: 'md',
  searchable: false,
  multiple: false,
  className: '',
  required: false
};

export default Dropdown; 