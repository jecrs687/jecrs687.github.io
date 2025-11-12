/**
 * Component variant definitions
 * Separated for better Fast Refresh compatibility
 */

import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-sakura-500 text-white hover:bg-sakura-600 active:scale-95 shadow-lg shadow-sakura-500/20',
                destructive:
                    'bg-red-500 text-white hover:bg-red-600 active:scale-95',
                outline:
                    'border-2 border-sakura-500 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/10 active:scale-95',
                secondary:
                    'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 active:scale-95',
                ghost:
                    'hover:bg-sakura-50 hover:text-sakura-600 dark:hover:bg-sakura-900/10 dark:hover:text-sakura-400',
                link:
                    'text-sakura-600 underline-offset-4 hover:underline dark:text-sakura-400',
                gradient:
                    'bg-gradient-to-r from-sakura-500 to-cyber-500 text-white hover:from-sakura-600 hover:to-cyber-600 active:scale-95 shadow-lg',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-lg px-8',
                xl: 'h-14 rounded-xl px-10 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export const badgeVariants = cva(
    'inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-sakura-500 text-white hover:bg-sakura-600',
                secondary:
                    'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
                destructive:
                    'border-transparent bg-red-500 text-white hover:bg-red-600',
                outline: 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                success:
                    'border-transparent bg-green-500 text-white hover:bg-green-600',
                warning:
                    'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
                info:
                    'border-transparent bg-blue-500 text-white hover:bg-blue-600',
                cyber:
                    'border-transparent bg-cyber-500 text-white hover:bg-cyber-600',
                matcha:
                    'border-transparent bg-matcha-500 text-white hover:bg-matcha-600',
                gradient:
                    'border-transparent bg-gradient-to-r from-sakura-500 to-cyber-500 text-white',
            },
            size: {
                default: 'px-2.5 py-0.5 text-xs',
                sm: 'px-2 py-0.5 text-xs',
                lg: 'px-3 py-1 text-sm',
                xl: 'px-4 py-1.5 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
