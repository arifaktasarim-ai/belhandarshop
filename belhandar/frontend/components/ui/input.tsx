import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-bh-white placeholder:text-white/40 focus:outline-none focus:border-bh-gold focus:ring-1 focus:ring-bh-gold transition-colors',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
export { Input };
