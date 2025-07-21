import React from 'react';
import { 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiInfo, 
  FiX 
} from 'react-icons/fi';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className = '', 
    variant = 'info', 
    title, 
    description,
    icon,
    action,
    onClose,
    children,
    ...props 
  }, ref) => {
    const variants = {
      info: {
        container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800',
        icon: <FiInfo className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        title: 'text-blue-800 dark:text-blue-300',
        description: 'text-blue-700 dark:text-blue-300/80',
      },
      success: {
        container: 'bg-success-50 border-success-200 dark:bg-success-900/30 dark:border-success-800',
        icon: <FiCheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />,
        title: 'text-success-800 dark:text-success-300',
        description: 'text-success-700 dark:text-success-300/80',
      },
      warning: {
        container: 'bg-warning-50 border-warning-200 dark:bg-warning-900/30 dark:border-warning-800',
        icon: <FiAlertTriangle className="h-5 w-5 text-warning-500 dark:text-warning-400" />,
        title: 'text-warning-800 dark:text-warning-300',
        description: 'text-warning-700 dark:text-warning-300/80',
      },
      error: {
        container: 'bg-error-50 border-error-200 dark:bg-error-900/30 dark:border-error-800',
        icon: <FiAlertCircle className="h-5 w-5 text-error-500 dark:text-error-400" />,
        title: 'text-error-800 dark:text-error-300',
        description: 'text-error-700 dark:text-error-300/80',
      },
    };

    return (
      <div
        ref={ref}
        className={`relative rounded-lg border p-4 ${variants[variant].container} ${className}`}
        role="alert"
        {...props}
      >
        <div className="flex">
          {/* Icon */}
          {icon !== undefined ? (
            <div className="flex-shrink-0">{icon}</div>
          ) : (
            <div className="flex-shrink-0">{variants[variant].icon}</div>
          )}
          
          {/* Content */}
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${variants[variant].title}`}>
                {title}
              </h3>
            )}
            
            {description && (
              <div className={`mt-1 text-sm ${variants[variant].description}`}>
                {description}
              </div>
            )}
            
            {children}
            
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>
          
          {/* Close button */}
          {onClose && (
            <div className="ml-auto pl-3">
              <button
                type="button"
                className="inline-flex rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                onClick={onClose}
                aria-label="Dismiss"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps };