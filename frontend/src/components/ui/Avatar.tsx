import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  border?: boolean;
  notification?: number;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className = '', 
    src, 
    alt = '', 
    fallback, 
    size = 'md', 
    shape = 'circle',
    status = 'none',
    border = false,
    notification,
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(!src);

    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-md',
    };

    const statusColors = {
      online: 'bg-success-500',
      offline: 'bg-neutral-400',
      away: 'bg-warning-500',
      busy: 'bg-error-500',
      none: 'hidden',
    };

    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
      '2xl': 'w-4 h-4',
    };

    const borderStyle = border 
      ? 'ring-2 ring-white dark:ring-neutral-800' 
      : '';

    // Get initials from fallback text
    const getInitials = (name: string) => {
      if (!name) return '';
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center flex-shrink-0 ${sizes[size]} ${shapes[shape]} ${borderStyle} ${className}`}
        {...props}
      >
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${shapes[shape]}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`flex items-center justify-center w-full h-full bg-brand-primary-100 text-brand-primary-800 dark:bg-brand-primary-900/30 dark:text-brand-primary-300 font-medium ${shapes[shape]}`}>
            {fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?'}
          </div>
        )}
        
        {/* Status indicator */}
        {status !== 'none' && (
          <span className={`absolute bottom-0 right-0 block ${statusSizes[size]} ${statusColors[status]} ${shapes.circle} ring-2 ring-white dark:ring-neutral-800`}></span>
        )}
        
        {/* Notification badge */}
        {notification !== undefined && notification > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-medium bg-error-500 text-white">
            {notification > 99 ? '99+' : notification}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group Component
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  spacing?: 'tight' | 'normal' | 'loose';
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ 
    className = '', 
    children, 
    max, 
    size = 'md',
    spacing = 'normal',
    ...props 
  }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const totalAvatars = childrenArray.length;
    const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingAvatars = max && totalAvatars > max ? totalAvatars - max : 0;
    
    const spacingValues = {
      tight: '-mr-2',
      normal: '-mr-3',
      loose: '-mr-4',
    };

    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };

    return (
      <div
        ref={ref}
        className={`flex items-center ${className}`}
        {...props}
      >
        {visibleAvatars.map((child, index) => (
          <div key={index} className={`${index !== 0 ? spacingValues[spacing] : ''}`}>
            {React.isValidElement(child) ? 
              React.cloneElement(child as React.ReactElement<AvatarProps>, { 
                size: (child.props.size || size),
                border: true
              }) : 
              child
            }
          </div>
        ))}
        
        {remainingAvatars > 0 && (
          <div className={`${spacingValues[spacing]}`}>
            <div className={`flex items-center justify-center ${sizes[size]} rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 font-medium ring-2 ring-white dark:ring-neutral-800`}>
              +{remainingAvatars}
            </div>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
export type { AvatarProps, AvatarGroupProps };