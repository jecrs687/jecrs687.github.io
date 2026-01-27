import * as React from 'react';
import { cn } from '@/lib';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className,
}) => (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
        {icon && (
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                {icon}
            </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
        )}
        {action}
    </div>
);

interface ErrorStateProps {
    title?: string;
    message?: string;
    retry?: () => void;
    className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    retry,
    className,
}) => (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{message}</p>
        {retry && (
            <button
                onClick={retry}
                className="px-4 py-2 bg-sakura-500 text-white rounded-lg hover:bg-sakura-600 transition-colors"
            >
                Try Again
            </button>
        )}
    </div>
);
