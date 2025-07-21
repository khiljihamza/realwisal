import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'md';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className = '', 
    variant = 'default', 
    size = 'md', 
    rounded = 'full',
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
      primary: 'bg-brand-primary-100 text-brand-primary-800 dark:bg-brand-primary-900/30 dark:text-brand-primary-300',
      secondary: 'bg-brand-secondary-100 text-brand-secondary-800 dark:bg-brand-secondary-900/30 dark:text-brand-secondary-300',
      success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
      warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
      danger: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      outline: 'bg-transparent border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300',
    };

    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1.5',
    };

    const roundedStyles = {
      full: 'rounded-full',
      md: 'rounded-md',
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${roundedStyles[rounded]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };