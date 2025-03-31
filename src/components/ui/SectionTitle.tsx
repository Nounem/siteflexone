import React from 'react';
import { cn } from '../../lib/utils.ts';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  centered = false,
  className = '',
}) => {
  return (
    <div className={cn(
      'mb-8', 
      centered ? 'text-center' : '',
      className
    )}>
      {subtitle && (
        <p className={cn(
          'text-[#61dafb] uppercase tracking-wider text-sm font-medium mb-2',
          className.includes('text-white') ? 'text-[#61dafb]' : 'text-[#61dafb]'
        )}>
          {subtitle}
        </p>
      )}
      <h2 className={cn(
        'text-3xl md:text-4xl font-bebas',
        className.includes('text-white') ? 'text-white' : 'text-[#002875]'
      )}>
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;