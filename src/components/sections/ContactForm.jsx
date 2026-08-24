import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Field from '@/components/ui/Field';
import Spinner from '@/components/ui/Spinner';
import useReducedMotion from '@/hooks/useReducedMotion';
import { EASE_OUT } from '@/lib/motion';
import { cx } from '@/lib/utils';
import {
  contactFieldMeta,
  hasErrors,
  initialContactValues,
  validateContactForm,
  validateField,
} from '@/lib/validators';
import { getTransportInfo, submitContactForm } from '@/services/contactService';

const FIELD_ORDER = [
  'name',
  'email',
  'phone',
  'company',
  'projectType',
  'budget',
  'shootDate',
  'description',
  'message',
];

export default function ContactForm({ config }) {
  const reduced = useReducedMotion();
  const formRef = useRef(null);
  const abortRef = useRef(null);
  const [values, setValues] = useState(initialContactValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [result, setResult] = useState(null);
  const [failure, setFailure] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const transport = getTransportInfo();

  useEffect(
    () => () => {
      if (abortRef.current) abortRef.current.abort();
    },
    [],
  );

  const onChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear an existing error as soon as the field becomes valid again.
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = validateField(name, value);
        if (next === prev[name]) return prev;
        const copy = { ...prev };
        if (next) copy[name] = next;
        else delete copy[name];
        return copy;
      });
    },
    [],
  );

  const onBlur = useCallback((event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (error) copy[name] = error;
      else delete copy[name];
      return copy;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialContactValues);
    setTouched({});
    setErrors({});
    setStatus('idle');
    setResult(null);
    setFailure('');
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    setTouched(
      FIELD_ORDER.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}),
    );

    if (hasErrors(nextErrors)) {
      const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
      if (firstInvalid && formRef.current) {
        const node = formRef.current.querySelector('[name="' + firstInvalid + '"]');
        if (node && typeof node.focus === 'function') node.focus();
      }
      return;
    }

    // Silently drop bot submissions that filled the hidden field.
    if (honeypot) {
      setStatus('success');
      setResult({ id: 'IGNORED' });
      return;
    }

    setStatus('submitting');
    setFailure('');
    abortRef.current = new AbortController();

    try {
      const response = await submitContactForm(values, { signal: abortRef.current.signal });
      setResult(response);
      setStatus('success');
    } catch (error) {
      if (error && error.code === 'aborted') return;
      setFailure((error && error.message) || config.errorMessage);
      setStatus('error');
    } finally {
      abortRef.current = null;
    }
  };

  const submitting = status === 'submitting';

  const fieldProps = (name, extra = {}) => ({
    id: 'contact-' + name,
    name,
    label: contactFieldMeta[name].label,
    required: contactFieldMeta[name].required,
    value: values[name],
    onChange,
    onBlur,
    error: errors[name],
    touched: touched[name],
    disabled: submitting,
    ...extra,
  });

  const panel = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -16 },
    transition: { duration: reduced ? 0.2 : 0.55, ease: EASE_OUT },
  };

  return (
    <div className={cx('contact-form', submitting && 'is-submitting')}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div className="contact-form__success" key="success" {...panel} role="status">
            <span className="contact-form__success-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                <path
                  d="M15 24.5 L21.5 31 L33 19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <h3 className="contact-form__success-title h3">{config.successTitle}</h3>
            <p className="contact-form__success-text">{config.successMessage}</p>
            {result && result.id && result.id !== 'IGNORED' ? (
              <p className="contact-form__ref mono">Reference {result.id}</p>
            ) : null}
            <button type="button" className="btn" onClick={reset}>
              <span>{config.resetLabel}</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            className="contact-form__form"
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            {...panel}
          >
            <AnimatePresence>
              {status === 'error' ? (
                <motion.div
                  className="contact-form__alert"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <span className="contact-form__alert-title mono">{config.errorTitle}</span>
                  <span className="contact-form__alert-text">{failure || config.errorMessage}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="contact-form__grid">
              <Field {...fieldProps('name', { autoComplete: 'name', placeholder: 'Your name' })} />
              <Field {...fieldProps('email', { type: 'email', autoComplete: 'email', placeholder: 'you@studio.com' })} />
              <Field {...fieldProps('phone', { type: 'tel', autoComplete: 'tel', placeholder: '+91 00000 00000' })} />
              <Field {...fieldProps('company', { autoComplete: 'organization', placeholder: 'Production house' })} />
              <Field
                {...fieldProps('projectType', {
                  type: 'select',
                  options: config.projectTypes,
                  placeholder: 'Select a type',
                })}
              />
              <Field
                {...fieldProps('budget', {
                  type: 'select',
                  options: config.budgetRanges,
                  placeholder: 'Select a range',
                })}
              />
              <Field
                {...fieldProps('shootDate', {
                  type: 'date',
                  className: 'field--full',
                  hint: 'Approximate is fine — schedules move.',
                })}
              />
              <Field
                {...fieldProps('description', {
                  type: 'textarea',
                  className: 'field--full',
                  placeholder: 'What are we making? Scale, locations, references, anything useful.',
                  maxLength: 2000,
                  rows: 6,
                })}
              />
              <Field
                {...fieldProps('message', {
                  type: 'textarea',
                  className: 'field--full',
                  placeholder: 'Crew already attached, festival deadlines, questions…',
                  maxLength: 1000,
                  rows: 4,
                })}
              />
            </div>

            {/* Spam trap — visually hidden, never shown to real visitors. */}
            <div className="visually-hidden" aria-hidden="true">
              <label htmlFor="contact-referral">Do not fill this in</label>
              <input
                id="contact-referral"
                name="referral"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            <div className="contact-form__foot">
              <button type="submit" className="btn btn--solid contact-form__submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner label={config.submittingLabel} />
                    <span>{config.submittingLabel}</span>
                  </>
                ) : (
                  <>
                    <span>{config.submitLabel}</span>
                    <span className="btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </>
                )}
              </button>

              <p className="contact-form__note">
                Required fields are marked <span className="text-amber">*</span>. Your details are only used to
                reply.
              </p>
            </div>

            {!transport.isLive ? (
              <p className="contact-form__transport mono">
                Demo mode — submissions resolve locally. Set VITE_CONTACT_TRANSPORT=http and
                VITE_CONTACT_ENDPOINT to post to a real service.
              </p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
