import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-lg bg-[#1a1a1a] border border-white/10 px-4 py-2.5 text-sm text-bh-white focus:outline-none focus:border-bh-gold focus:ring-1 focus:ring-bh-gold transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';
export { Select };
