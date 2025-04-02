import * as React from 'react';
import { cn } from '../../lib/utils';

// Définition de la fonction buttonVariants pour les styles du bouton
export const buttonVariants = ({
  variant = 'default',
  size = 'default',
  className = '',
}: {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
} = {}) => {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    
    // Variantes
    variant === 'default' && 'bg-primary text-white hover:bg-primary/90',
    variant === 'secondary' && 'bg-secondary text-primary hover:bg-secondary/90',
    variant === 'outline' && 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
    variant === 'link' && 'text-primary underline-offset-4 hover:underline',
    
    // Tailles
    size === 'default' && 'h-10 px-4 py-2',
    size === 'sm' && 'h-8 px-3 text-sm',
    size === 'lg' && 'h-12 px-6 text-lg',
    size === 'icon' && 'h-10 w-10',
    
    className
  );
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';