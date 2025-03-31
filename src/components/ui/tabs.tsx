import React from 'react';
import { cn } from '../../lib/utils.ts';

// Types
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

// Context
const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs should be used within a TabsProvider');
  }
  return context;
}

// Tabs component
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
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
  const [tabValue, setTabValue] = React.useState(value || defaultValue);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setTabValue(value);
    }
  }, [value]);
  
  const handleValueChange = React.useCallback((newValue: string) => {
    setTabValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  return (
    <TabsContext.Provider value={{ value: tabValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// TabsList component
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div 
      className={cn(
        'flex flex-wrap border-b border-gray-200',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

// TabsTrigger component
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: currentValue, onValueChange } = useTabs();
  const isActive = currentValue === value;
  
  return (
    <button
      className={cn(
        'px-4 py-2 text-sm font-medium',
        'transition-all duration-200',
        isActive 
          ? 'text-primary border-b-2 border-primary' 
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
        className
      )}
      onClick={() => onValueChange(value)}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </button>
  );
}

// TabsContent component
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: currentValue } = useTabs();
  const isActive = currentValue === value;
  
  if (!isActive) return null;
  
  return (
    <div
      className={cn(
        'mt-4 focus:outline-none',
        className
      )}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
}