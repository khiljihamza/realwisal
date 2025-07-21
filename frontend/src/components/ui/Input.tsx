import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled';
  size?: 'sm' | 'md' | 'lg';
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    type, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    variant = 'default',
    size = 'md',
    isRequired,
    isDisabled,
    isReadOnly,
    isInvalid,
    ...props 
  }, ref) => {
    const inputId = React.useId();
    
    const variants = {
      default: 'border border-neutral-300 bg-white focus:border-brand-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
      filled: 'border-0 bg-neutral-100 focus:bg-neutral-50 dark:bg-neutral-800 dark:focus:bg-neutral-700 dark:text-white',
      flushed: 'border-0 border-b border-neutral-300 rounded-none px-0 focus:border-brand-primary-500 dark:border-neutral-700 dark:text-white',
      unstyled: 'border-0 px-0 bg-transparent focus:ring-0 dark:text-white'
    };

    const sizes = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base px-4'
    };

    // Combine error from prop or isInvalid
    const hasError = error || isInvalid;
    
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
            {isRequired && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={`
              w-full rounded-md px-3 py-2 
              ${variants[variant]}
              ${sizes[size]}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${hasError ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
              placeholder:text-neutral-500 
              focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:ring-offset-0
              disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-100 dark:disabled:bg-neutral-800
              transition-colors duration-200
            `}
            ref={ref}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError 
                ? `${inputId}-error` 
                : helperText 
                  ? `${inputId}-description` 
                  : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-description`} className="mt-1.5 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
