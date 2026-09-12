import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-bh-white placeholder:text-white/40 focus:outline-none focus:border-bh-gold focus:ring-1 focus:ring-bh-gold transition-colors resize-none',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
export { Textarea };
