import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'unstyled';
  isHoverable?: boolean;
  isInteractive?: boolean;
  isDisabled?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | '2:1';
  overlay?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className = '', 
    children, 
    variant = 'elevated',
    isHoverable = false,
    isInteractive = false,
    isDisabled = false,
    ...props 
  }, ref) => {
    const variants = {
      elevated: 'bg-white dark:bg-neutral-800 shadow-md dark:shadow-neutral-900/50',
      outlined: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
      filled: 'bg-neutral-100 dark:bg-neutral-700',
      unstyled: 'bg-transparent'
    };

    const hoverStyles = isHoverable 
      ? 'transition-all duration-200 hover:shadow-lg dark:hover:shadow-neutral-900/50' 
      : '';
    
    const interactiveStyles = isInteractive 
      ? 'cursor-pointer transition-transform duration-200 hover:-translate-y-1 active:translate-y-0' 
      : '';
    
    const disabledStyles = isDisabled 
      ? 'opacity-60 pointer-events-none' 
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-lg overflow-hidden ${variants[variant]} ${hoverStyles} ${interactiveStyles} ${disabledStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-xl font-semibold leading-tight text-neutral-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-neutral-600 dark:text-neutral-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-5 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center p-5 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ 
    className = '', 
    src, 
    alt = '', 
    aspectRatio = '16:9',
    overlay,
    ...props 
  }, ref) => {
    const aspectRatioClasses = {
      '1:1': 'aspect-square',
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '3:2': 'aspect-[3/2]',
      '2:1': 'aspect-[2/1]'
    };

    return (
      <div 
        ref={ref} 
        className={`relative w-full ${aspectRatioClasses[aspectRatio]} overflow-hidden ${className}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          {...props}
        />
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            {overlay}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardImage.displayName = 'CardImage';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardImage
};
