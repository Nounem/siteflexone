import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [localValue, setLocalValue] = useState(value || defaultValue || '');

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setLocalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider
      value={{ value: value === undefined ? localValue : value, onValueChange: handleValueChange }}
    >
      <div className={cn('', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      className={cn('flex bg-gray-100 p-1 rounded-lg', className)}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  className?: string;
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61dafb] focus-visible:ring-offset-2',
        isSelected 
          ? 'bg-white text-[#002875] shadow-sm' 
          : 'text-gray-600 hover:text-[#002875]',
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  className?: string;
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { value: selectedValue } = context;
  
  if (selectedValue !== value) {
    return null;
  }
  
  return (
    <div
      role="tabpanel"
      className={cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61dafb] focus-visible:ring-offset-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}