/**
 * Simple, dependency-free validators used across all form steps.
 * Each validator returns an error message string, or an empty string
 * on success, so the caller can drop the result straight into state.
 */

export const isRequired = (value) => {
  if (value === null || value === undefined) return 'This field is required';
  if (typeof value === 'string' && value.trim() === '') return 'This field is required';
  if (Array.isArray(value) && value.length === 0) return 'This field is required';
  return '';
};

export const isValidEmail = (value) => {
  if (!value) return 'Email is required';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim()) ? '' : 'Please enter a valid email address';
};

export const isValidPhone = (value) => {
  if (!value) return 'Phone number is required';
  // Accept 10-15 digits with optional separators.
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return 'Please enter a valid phone number';
  }
  return '';
};

export const isValidZip = (value) => {
  if (!value) return 'ZIP code is required';
  const pattern = /^\d{5}(-\d{4})?$/;
  return pattern.test(value.trim()) ? '' : 'Please enter a valid ZIP code';
};

/**
 * Runs a map of { fieldName: validatorFn } against a values object
 * and returns an { errors, isValid } summary.
 */
export const validateFields = (values, rules) => {
  const errors = {};
  for (const field of Object.keys(rules)) {
    const validators = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    for (const validator of validators) {
      const error = validator(values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
};
