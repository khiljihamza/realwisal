import React from 'react';
import { cn } from '@/utils/cn';
import { designTokens } from '../tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';
    
    const variants = {
      default: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
      secondary: 'bg-brand-primary-50 text-brand-primary-700 border border-brand-primary-200',
      success: 'bg-semantic-success-50 text-semantic-success-700 border border-semantic-success-200',
      warning: 'bg-semantic-warning-50 text-semantic-warning-700 border border-semantic-warning-200',
      error: 'bg-semantic-error-50 text-semantic-error-700 border border-semantic-error-200',
      info: 'bg-semantic-info-50 text-semantic-info-700 border border-semantic-info-200'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// E-commerce specific badge variants
export const StockBadge: React.FC<{ stock: number; lowThreshold?: number }> = ({ 
  stock, 
  lowThreshold = 5 
}) => {
  if (stock === 0) {
    return <Badge variant="error">Out of Stock</Badge>;
  }
  
  if (stock <= lowThreshold) {
    return <Badge variant="warning">Only {stock} left</Badge>;
  }
  
  return <Badge variant="success">In Stock</Badge>;
};

export const DiscountBadge: React.FC<{ percentage: number }> = ({ percentage }) => (
  <Badge variant="error" className="font-bold">
    {percentage}% OFF
  </Badge>
);

export const NewBadge: React.FC = () => (
  <Badge variant="info" className="animate-pulse">
    NEW
  </Badge>
);

export const BestsellerBadge: React.FC = () => (
  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
    ⭐ Bestseller
  </Badge>
);

export const FreeShippingBadge: React.FC = () => (
  <Badge variant="success">
    🚚 Free Shipping
  </Badge>
);
