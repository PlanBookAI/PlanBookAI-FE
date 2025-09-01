'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg transition-colors duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary button - Dùng cho các hành động chính
        primary: [
          'bg-blue-600 text-white',
          'hover:bg-blue-700',
          'focus-visible:ring-blue-600',
          'shadow-sm',
        ],
        // Secondary button - Dùng cho các hành động phụ
        secondary: [
          'bg-white text-blue-600',
          'border-2 border-blue-600',
          'hover:bg-blue-50',
          'focus-visible:ring-blue-600',
        ],
        // Ghost button - Dùng cho các hành động ít quan trọng
        ghost: [
          'text-gray-700',
          'hover:bg-gray-100',
          'focus-visible:ring-gray-500',
        ],
        // Link button - Trông giống như link
        link: [
          'text-blue-600',
          'hover:text-blue-700',
          'underline-offset-4',
          'hover:underline',
          'p-0 h-auto',
        ],
        // White button - Dùng trên nền tối
        white: [
          'bg-white text-blue-600',
          'hover:bg-blue-50',
          'focus-visible:ring-white',
          'shadow-sm',
        ],
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };