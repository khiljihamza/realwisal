import React from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  children: React.ReactNode;
}

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  href?: string;
  isCurrentPage?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 
    className = '', 
    separator = <FiChevronRight className="h-4 w-4" />, 
    children, 
    ...props 
  }, ref) => {
    // Clone children to add separators
    const items = React.Children.toArray(children);
    
    const itemsWithSeparators = items.map((item, index) => {
      const isLast = index === items.length - 1;
      
      if (isLast) {
        return item;
      }
      
      return (
        <React.Fragment key={index}>
          {item}
          <li className="mx-2 flex items-center text-neutral-400">
            {separator}
          </li>
        </React.Fragment>
      );
    });

    return (
      <nav 
        ref={ref} 
        aria-label="Breadcrumb" 
        className={`${className}`}
        {...props}
      >
        <ol className="flex items-center flex-wrap">
          {itemsWithSeparators}
        </ol>
      </nav>
    );
  }
);

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ 
    className = '', 
    href, 
    isCurrentPage = false, 
    icon,
    children, 
    ...props 
  }, ref) => {
    const content = (
      <span className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    );

    return (
      <li 
        ref={ref} 
        className={`flex items-center text-sm ${className}`}
        {...props}
      >
        {isCurrentPage ? (
          <span 
            className="font-medium text-neutral-800 dark:text-neutral-200" 
            aria-current="page"
          >
            {content}
          </span>
        ) : href ? (
          <a 
            href={href} 
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            {content}
          </a>
        ) : (
          <span className="text-neutral-600 dark:text-neutral-400">
            {content}
          </span>
        )}
      </li>
    );
  }
);

// Home breadcrumb item for convenience
const BreadcrumbHome = React.forwardRef<HTMLLIElement, Omit<BreadcrumbItemProps, 'icon'>>(
  ({ 
    className = '', 
    href = '/', 
    children = 'Home', 
    ...props 
  }, ref) => {
    return (
      <BreadcrumbItem
        ref={ref}
        href={href}
        icon={<FiHome className="h-4 w-4" />}
        className={className}
        {...props}
      >
        {children}
      </BreadcrumbItem>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbHome.displayName = 'BreadcrumbHome';

export { Breadcrumb, BreadcrumbItem, BreadcrumbHome };
export type { BreadcrumbProps, BreadcrumbItemProps };