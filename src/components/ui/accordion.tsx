import React from 'react';
import { cn } from '../../lib/utils.ts';
import { ChevronDown } from 'lucide-react';

type AccordionContextValue = {
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  type: 'single' | 'multiple';
};

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an AccordionProvider');
  }
  return context;
};

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    value || defaultValue || (type === 'multiple' ? [] : '')
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback((newValue: string | string[]) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  return (
    <AccordionContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, type }}>
      <div className={cn('space-y-1', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <div className={cn('border-b', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({ className, children, value, ...props }: AccordionTriggerProps) {
  const { value: contextValue, onValueChange, type } = useAccordion();
  
  const isOpen = React.useMemo(() => {
    if (!value) return false;
    
    if (type === 'single') {
      return contextValue === value;
    } else {
      return Array.isArray(contextValue) && contextValue.includes(value);
    }
  }, [contextValue, type, value]);

  const handleClick = () => {
    if (!value) return;
    
    if (type === 'single') {
      onValueChange(isOpen ? '' : value);
    } else {
      onValueChange(
        isOpen 
          ? (contextValue as string[]).filter(v => v !== value)
          : [...(contextValue as string[]), value]
      );
    }
  };

  return (
    <button
      className={cn(
        'flex items-center justify-between w-full py-4 px-0 text-left font-medium',
        'transition-all hover:text-primary focus:outline-none',
        isOpen ? 'text-primary' : 'text-gray-700',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <ChevronDown 
        className={cn(
          'h-4 w-4 transition-transform duration-200',
          isOpen ? 'transform rotate-180' : ''
        )} 
      />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ className, children, value, ...props }: AccordionContentProps) {
  const { value: contextValue, type } = useAccordion();
  
  const isOpen = React.useMemo(() => {
    if (!value) return false;
    
    if (type === 'single') {
      return contextValue === value;
    } else {
      return Array.isArray(contextValue) && contextValue.includes(value);
    }
  }, [contextValue, type, value]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'overflow-hidden pb-4 text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}