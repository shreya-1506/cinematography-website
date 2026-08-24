import { cx } from '@/lib/utils';

/**
 * One form control: label, input/select/textarea, hint and error message,
 * with the aria wiring that screen readers need.
 */
export default function Field({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  options = [],
  placeholder,
  rows = 5,
  autoComplete,
  hint,
  maxLength,
  min,
  disabled = false,
  className,
}) {
  const showError = Boolean(touched && error);
  const errorId = id + '-error';
  const hintId = id + '-hint';
  const describedBy = [showError ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    name,
    value,
    onChange,
    onBlur,
    disabled,
    required,
    'aria-invalid': showError ? 'true' : undefined,
    'aria-describedby': describedBy,
    'aria-required': required ? 'true' : undefined,
    className: 'field__control',
  };

  return (
    <div className={cx('field', showError && 'field--error', disabled && 'field--disabled', className)}>
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {required ? (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="field__optional">optional</span>
        )}
      </label>

      {type === 'textarea' ? (
        <textarea {...shared} rows={rows} placeholder={placeholder} maxLength={maxLength} />
      ) : type === 'select' ? (
        <div className="field__select-wrap">
          <select {...shared} className="field__control field__control--select">
            <option value="">{placeholder || 'Select…'}</option>
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
          <span className="field__chevron" aria-hidden="true">
            ↓
          </span>
        </div>
      ) : (
        <input
          {...shared}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          min={min}
        />
      )}

      <span className="field__line" aria-hidden="true" />

      {hint && !showError ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}

      {showError ? (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
