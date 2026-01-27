import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib';

interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder, className }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                    'flex items-center justify-between gap-2 transition-all duration-200',
                    'hover:border-sakura-300 dark:hover:border-sakura-700',
                    isOpen && 'ring-2 ring-sakura-500 border-sakura-500'
                )}
            >
                <span className={cn('truncate', !selectedOption && 'text-gray-400')}>
                    {selectedOption?.label || placeholder || 'Select...'}
                </span>
                <motion.svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                'w-full px-4 py-2 flex items-center gap-2 text-left transition-colors',
                                'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                                option.value === value && 'bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400'
                            )}
                        >
                            {option.icon}
                            {option.label}
                        </button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};
