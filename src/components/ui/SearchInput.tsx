import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
    isLoading?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, value, onClear, isLoading, ...props }, ref) => {
        const hasValue = Boolean(value && String(value).length > 0);

        return (
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {isLoading ? (
                        <motion.svg
                            className="w-5 h-5"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="31.4" strokeLinecap="round" />
                        </motion.svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    )}
                </div>
                <input
                    ref={ref}
                    type="search"
                    value={value}
                    className={cn(
                        'w-full h-11 pl-10 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-sakura-500 focus:border-sakura-500',
                        'placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200',
                        className
                    )}
                    {...props}
                />
                {hasValue && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        );
    }
);
SearchInput.displayName = 'SearchInput';
