/**
 * Contact form validation.
 * Pure functions — no React, no DOM, so they are trivial to unit test and are
 * reused by both the field-level (on blur) and submit-level validation passes.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+]?[\d\s()./-]{7,20}$/;

export const initialContactValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  budget: '',
  shootDate: '',
  description: '',
  message: '',
};

/** Field definitions used for labels, requiredness and a11y wiring. */
export const contactFieldMeta = {
  name: { label: 'Name', required: true },
  email: { label: 'Email', required: true },
  phone: { label: 'Phone', required: false },
  company: { label: 'Company / Production house', required: false },
  projectType: { label: 'Project type', required: true },
  budget: { label: 'Budget range', required: false },
  shootDate: { label: 'Preferred shoot date', required: false },
  description: { label: 'Project description', required: true },
  message: { label: 'Anything else', required: false },
};

function isBlank(value) {
  return !value || String(value).trim().length === 0;
}

/** Validate a single field. Returns an error string, or '' when valid. */
export function validateField(name, value, allValues = {}) {
  const raw = value == null ? '' : String(value);
  const trimmed = raw.trim();

  switch (name) {
    case 'name':
      if (isBlank(trimmed)) return 'Please tell me your name.';
      if (trimmed.length < 2) return 'That looks a little short.';
      if (trimmed.length > 80) return 'Please keep this under 80 characters.';
      return '';

    case 'email':
      if (isBlank(trimmed)) return 'An email address is required so I can reply.';
      if (!EMAIL_RE.test(trimmed)) return 'That does not look like a valid email address.';
      return '';

    case 'phone':
      if (isBlank(trimmed)) return '';
      if (!PHONE_RE.test(trimmed)) return 'Use digits, spaces and + only.';
      return '';

    case 'company':
      if (trimmed.length > 120) return 'Please keep this under 120 characters.';
      return '';

    case 'projectType':
      if (isBlank(trimmed)) return 'Choose the closest project type.';
      return '';

    case 'budget':
      return '';

    case 'shootDate': {
      if (isBlank(trimmed)) return '';
      const date = new Date(trimmed + 'T00:00:00');
      if (Number.isNaN(date.getTime())) return 'Please use a valid date.';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return 'Pick a date from today onwards.';
      return '';
    }

    case 'description':
      if (isBlank(trimmed)) return 'A sentence or two about the project, please.';
      if (trimmed.length < 20) return 'A little more detail helps — at least 20 characters.';
      if (trimmed.length > 2000) return 'Please keep this under 2000 characters.';
      return '';

    case 'message':
      if (trimmed.length > 1000) return 'Please keep this under 1000 characters.';
      return '';

    default:
      return '';
  }
}

/** Validate every field. Returns a map of fieldName -> error (only failures). */
export function validateContactForm(values) {
  const errors = {};
  Object.keys(initialContactValues).forEach((key) => {
    const error = validateField(key, values[key], values);
    if (error) errors[key] = error;
  });
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
