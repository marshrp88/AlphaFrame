/**
 * MobileForm.jsx - AlphaFrame VX.1 Mobile-Optimized Forms
 * 
 * Purpose: A mobile-optimized form component that provides
 * touch-friendly inputs, auto-focus management, and mobile UX patterns.
 * 
 * Procedure:
 * 1. Touch-friendly form inputs with proper sizing
 * 2. Auto-focus management for mobile keyboards
 * 3. Mobile-specific validation and error handling
 * 4. Smooth animations and transitions
 * 5. Accessibility features for mobile users
 * 
 * Conclusion: Delivers an intuitive form experience optimized
 * for mobile devices with excellent accessibility.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';
import './MobileForm.css';

/**
 * MobileForm Component Props
 * @typedef {Object} MobileFormProps
 * @property {Array} fields - Form fields configuration
 * @property {Function} onSubmit - Form submission handler
 * @property {Function} [onChange] - Form change handler
 * @property {Object} [initialValues] - Initial form values
 * @property {Object} [validation] - Validation rules
 * @property {boolean} [isLoading] - Loading state
 * @property {string} [submitText] - Submit button text
 * @property {string} [className] - Additional CSS classes
 */

/**
 * MobileForm Component
 * @param {MobileFormProps} props - Component props
 * @returns {JSX.Element} The rendered mobile form component
 */
const MobileForm = ({
  fields = [],
  onSubmit,
  onChange,
  initialValues = {},
  validation = {},
  isLoading = false,
  submitText = 'Submit',
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  
  const formRef = useRef(null);
  const fieldRefs = useRef({});

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
    
    onChange?.(newFormData);
  };

  // Handle field blur
  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    setFocusedField(null);
    
    // Validate field on blur
    validateField(fieldName, formData[fieldName]);
  };

  // Handle field focus
  const handleFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
    
    // Scroll to field on mobile
    if (fieldRefs.current[fieldName]) {
      setTimeout(() => {
        fieldRefs.current[fieldName].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  };

  // Validate single field
  const validateField = (fieldName, value) => {
    const fieldValidation = validation[fieldName];
    if (!fieldValidation) return;

    let error = null;

    // Required validation
    if (fieldValidation.required && (!value || value.trim() === '')) {
      error = fieldValidation.required;
    }
    // Pattern validation
    else if (fieldValidation.pattern && !fieldValidation.pattern.test(value)) {
      error = fieldValidation.message || 'Invalid format';
    }
    // Custom validation
    else if (fieldValidation.validate) {
      error = fieldValidation.validate(value, formData);
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      // Focus first error field
      const firstErrorField = fields.find(field => errors[field.name]);
      if (firstErrorField && fieldRefs.current[firstErrorField.name]) {
        fieldRefs.current[firstErrorField.name].focus();
      }
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  // Render form field
  const renderField = (field) => {
    const {
      name,
      type = 'text',
      label,
      placeholder,
      required = false,
      disabled = false,
      autoComplete,
      ...fieldProps
    } = field;

    const value = formData[name] || '';
    const error = errors[name];
    const isTouched = touched[name];
    const isFocused = focusedField === name;
    const showError = error && isTouched;

    // Determine input type for password fields
    const inputType = type === 'password' && showPasswords[name] ? 'text' : type;

    return (
      <motion.div
        key={name}
        className={`mobile-form__field ${showError ? 'mobile-form__field--error' : ''} ${isFocused ? 'mobile-form__field--focused' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label 
          htmlFor={name}
          className="mobile-form__label"
        >
          {label}
          {required && <span className="mobile-form__required">*</span>}
        </label>

        <div className="mobile-form__input-container">
          <input
            ref={el => fieldRefs.current[name] = el}
            id={name}
            name={name}
            type={inputType}
            value={value}
            placeholder={placeholder}
            required={required}
            disabled={disabled || isLoading}
            autoComplete={autoComplete}
            className="mobile-form__input"
            onChange={(e) => handleFieldChange(name, e.target.value)}
            onBlur={() => handleFieldBlur(name)}
            onFocus={() => handleFieldFocus(name)}
            {...fieldProps}
          />

          {/* Password visibility toggle */}
          {type === 'password' && (
            <button
              type="button"
              className="mobile-form__password-toggle"
              onClick={() => togglePasswordVisibility(name)}
              aria-label={showPasswords[name] ? 'Hide password' : 'Show password'}
            >
              {showPasswords[name] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {/* Field status icons */}
          <div className="mobile-form__status">
            {isLoading && (
              <Loader2 size={20} className="mobile-form__status-icon mobile-form__status-icon--loading" />
            )}
            {showError && (
              <AlertCircle size={20} className="mobile-form__status-icon mobile-form__status-icon--error" />
            )}
            {!showError && isTouched && value && (
              <CheckCircle size={20} className="mobile-form__status-icon mobile-form__status-icon--success" />
            )}
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {showError && (
            <motion.div
              className="mobile-form__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.form
      ref={formRef}
      className={`mobile-form ${className}`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="mobile-form__fields">
        {fields.map(renderField)}
      </div>

      <motion.button
        type="submit"
        className="mobile-form__submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="mobile-form__submit-icon" />
            Processing...
          </>
        ) : (
          submitText
        )}
      </motion.button>
    </motion.form>
  );
};

// PropTypes for runtime validation
MobileForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      disabled: PropTypes.bool,
      autoComplete: PropTypes.string
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  initialValues: PropTypes.object,
  validation: PropTypes.object,
  isLoading: PropTypes.bool,
  submitText: PropTypes.string,
  className: PropTypes.string
};

// Default props
MobileForm.defaultProps = {
  fields: [],
  initialValues: {},
  validation: {},
  isLoading: false,
  submitText: 'Submit',
  className: ''
};

export default MobileForm; 