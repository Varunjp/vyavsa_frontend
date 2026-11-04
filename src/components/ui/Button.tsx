import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    let variantClass = 'btn-primary';
    if (variant === 'secondary') variantClass = 'btn-secondary';
    if (variant === 'outline') variantClass = 'btn-outline-primary';
    if (variant === 'danger') variantClass = 'btn-danger';
    if (variant === 'ghost') variantClass = 'btn-light border-0';
    if (variant === 'link') variantClass = 'btn-link text-decoration-none';

    let sizeClass = '';
    if (size === 'sm') sizeClass = 'btn-sm';
    if (size === 'lg') sizeClass = 'btn-lg';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'btn d-inline-flex align-items-center justify-content-center gap-2',
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="spinner-border-sm animate-spin" size={16} />}
        {!isLoading && leftIcon && <span className="d-inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="d-inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
