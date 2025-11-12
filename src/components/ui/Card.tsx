/**
 * Enhanced Card Component
 * Flexible card with variants for different use cases
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
    'rounded-xl transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
                glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50',
                gradient: 'bg-gradient-to-br from-sakura-50 to-cyber-50 dark:from-sakura-900/20 dark:to-cyber-900/20 border border-sakura-200 dark:border-sakura-800',
                outline: 'border-2 border-gray-200 dark:border-gray-700 hover:border-sakura-300 dark:hover:border-sakura-700',
            },
            padding: {
                none: '',
                sm: 'p-4',
                default: 'p-6',
                lg: 'p-8',
            },
            hover: {
                none: '',
                lift: 'hover:-translate-y-1 hover:shadow-xl',
                glow: 'hover:shadow-lg hover:shadow-sakura-500/20',
                scale: 'hover:scale-[1.02]',
            },
        },
        defaultVariants: {
            variant: 'default',
            padding: 'default',
            hover: 'none',
        },
    }
);

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, hover, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, padding, hover, className }))}
            {...props}
        />
    )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            'text-2xl font-bold leading-none tracking-tight text-gray-900 dark:text-white',
            className
        )}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center pt-4', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
