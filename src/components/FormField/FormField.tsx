import { useState } from 'react'
import styles from './FormField.module.css'

interface FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'textarea'
  id?: string
  label?: string
  placeholder?: string
  value: string
  error?: string
  helperText?: string
  required?: boolean
  maxLength?: number
  autoComplete?: string
  onChange: (value: string) => void
  onBlur?: () => void
  showCharCount?: boolean
  disabled?: boolean
  rows?: number
  showPasswordToggle?: boolean
}

export default function FormField({
  type = 'text',
  id,
  label,
  placeholder,
  value,
  error,
  helperText,
  required = false,
  maxLength,
  autoComplete,
  onChange,
  onBlur,
  showCharCount = false,
  disabled = false,
  rows = 4,
  showPasswordToggle = false,
}: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const inputType = type === 'password' && showPasswordToggle && isPasswordVisible ? 'text' : type

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.formLabel}>
          {label}
          {required && '*'}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {type === 'textarea' ? (
          <textarea
            id={id}
            className={`${styles.formTextarea} ${error ? styles.error : ''}`}
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            rows={rows}
          />
        ) : (
          <input
            type={inputType}
            id={id}
            className={`${styles.formInput} ${error ? styles.error : ''}`}
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            autoComplete={autoComplete}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          />
        )}

        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className={`${styles.passwordToggle} ${isPasswordVisible ? styles.active : ''}`}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label="비밀번호 표시"
          >
            <svg className={styles.eyeIcon} width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                className={styles.eyeOpen}
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                className={styles.eyeOpen}
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.eyeClosed}
                d="M2 2L22 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: isPasswordVisible ? 'block' : 'none' }}
              />
            </svg>
          </button>
        )}
      </div>

      {(error || helperText || showCharCount) && (
        <p className={`${styles.helperText} ${error ? styles.show : ''}`}>
          {error || helperText}
          {showCharCount && maxLength && (
            <span className={styles.charCount}>
              {value.length}/{maxLength}
            </span>
          )}
        </p>
      )}
    </div>
  )
}
