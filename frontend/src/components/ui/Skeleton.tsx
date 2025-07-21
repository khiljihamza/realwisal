import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className = '', 
    variant = 'text', 
    animation = 'pulse',
    width,
    height,
    ...props 
  }, ref) => {
    const variants = {
      rectangular: 'rounded-none',
      circular: 'rounded-full',
      text: 'rounded',
      rounded: 'rounded-lg',
    };

    const animations = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      none: '',
    };

    // Default heights based on variant
    const defaultHeight = variant === 'text' ? '1em' : '100%';
    const defaultWidth = variant === 'circular' ? height || '3rem' : '100%';

    const style = {
      width: width || defaultWidth,
      height: height || defaultHeight,
    };

    return (
      <div
        ref={ref}
        className={`bg-neutral-200 dark:bg-neutral-700 ${variants[variant]} ${animations[animation]} ${className}`}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Predefined skeleton components for common use cases
const SkeletonText = ({ lines = 3, lastLineWidth = '70%', ...props }: { lines?: number; lastLineWidth?: string | number } & Omit<SkeletonProps, 'variant'>) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className="h-4"
          width={i === lines - 1 ? lastLineWidth : '100%'}
          {...props}
        />
      ))}
    </div>
  );
};

const SkeletonAvatar = ({ size = 'md', ...props }: { size?: 'sm' | 'md' | 'lg' | 'xl' } & Omit<SkeletonProps, 'variant'>) => {
  const sizes = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem',
    xl: '6rem',
  };

  return (
    <Skeleton 
      variant="circular" 
      width={sizes[size]} 
      height={sizes[size]} 
      {...props} 
    />
  );
};

const SkeletonButton = ({ width = '5rem', height = '2.5rem', ...props }: Omit<SkeletonProps, 'variant'>) => {
  return (
    <Skeleton 
      variant="rounded" 
      width={width} 
      height={height} 
      {...props} 
    />
  );
};

const SkeletonCard = ({ 
  hasImage = true, 
  imageHeight = '12rem',
  hasHeader = true,
  hasContent = true,
  hasFooter = false,
  ...props 
}: { 
  hasImage?: boolean;
  imageHeight?: string | number;
  hasHeader?: boolean;
  hasContent?: boolean;
  hasFooter?: boolean;
} & Omit<SkeletonProps, 'variant'>) => {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {hasImage && (
        <Skeleton 
          variant="rectangular" 
          height={imageHeight} 
          animation={props.animation} 
        />
      )}
      <div className="p-4 space-y-4">
        {hasHeader && (
          <div className="space-y-2">
            <Skeleton 
              variant="text" 
              className="h-6 w-3/4" 
              animation={props.animation} 
            />
            <Skeleton 
              variant="text" 
              className="h-4 w-1/2" 
              animation={props.animation} 
            />
          </div>
        )}
        
        {hasContent && (
          <SkeletonText 
            lines={3} 
            animation={props.animation} 
          />
        )}
        
        {hasFooter && (
          <div className="flex justify-between pt-2">
            <Skeleton 
              variant="rounded" 
              className="h-9 w-24" 
              animation={props.animation} 
            />
            <Skeleton 
              variant="rounded" 
              className="h-9 w-24" 
              animation={props.animation} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton, SkeletonCard };
export type { SkeletonProps };