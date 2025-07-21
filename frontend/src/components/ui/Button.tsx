import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'subtle' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    fullWidth,
    leftIcon,
    rightIcon,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-brand-primary-500 text-white hover:bg-brand-primary-600 active:bg-brand-primary-700 shadow-sm hover:shadow',
      secondary: 'bg-brand-secondary-500 text-white hover:bg-brand-secondary-600 active:bg-brand-secondary-700 shadow-sm hover:shadow',
      outline: 'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800/50',
      ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800/50',
      destructive: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-sm hover:shadow',
      link: 'bg-transparent p-0 h-auto text-brand-primary-500 hover:text-brand-primary-600 underline-offset-4 hover:underline focus:ring-0',
      subtle: 'bg-brand-primary-50 text-brand-primary-700 hover:bg-brand-primary-100 active:bg-brand-primary-200',
      success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm hover:shadow',
      warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm hover:shadow',
    };

    const sizes = {
      xs: 'h-7 px-2 text-xs rounded',
      sm: 'h-9 px-3 rounded',
      md: 'h-10 px-4 py-2 rounded-md',
      lg: 'h-11 px-5 rounded-md',
      xl: 'h-12 px-6 rounded-lg text-base',
      '2xl': 'h-14 px-8 rounded-lg text-lg',
      icon: 'h-10 w-10 rounded-full p-0'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        
        {leftIcon && <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{leftIcon}</span>}
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
        {rightIcon && <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
