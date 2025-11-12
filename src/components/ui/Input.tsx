/**
 * Enhanced Input Component
 * Reusable input with variants
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
    'flex w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:ring-offset-gray-950 dark:placeholder:text-gray-500 transition-all',
    {
        variants: {
            variant: {
                default: 'border-gray-300 dark:border-gray-700',
                error: 'border-red-500 focus-visible:ring-red-500',
                success: 'border-green-500 focus-visible:ring-green-500',
            },
            inputSize: {
                default: 'h-10',
                sm: 'h-9 text-xs',
                lg: 'h-11',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'default',
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, inputSize, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ variant, inputSize, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';
