import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, name, error, children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          id={name}
          name={name}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}>
          {children}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
