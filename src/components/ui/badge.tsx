import React from 'react';
import { cn } from '../../lib/utils.ts';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Variantes
        variant === 'default' && 'bg-primary text-white',
        variant === 'secondary' && 'bg-secondary text-primary',
        variant === 'outline' && 'border border-primary text-primary',
        variant === 'destructive' && 'bg-red-500 text-white',
        
        className
      )}
      {...props}
    />
  );
};