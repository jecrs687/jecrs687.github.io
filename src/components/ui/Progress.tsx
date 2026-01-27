import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib';

interface ProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'gradient' | 'striped';
    showLabel?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

const variantClasses = {
    default: 'bg-sakura-500',
    gradient: 'bg-gradient-to-r from-sakura-500 via-fuji-500 to-cyber-500',
    striped: 'bg-sakura-500 bg-stripes',
};

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    className,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn('w-full', className)}>
            <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizeClasses[size])}>
                <motion.div
                    className={cn('h-full rounded-full', variantClasses[variant])}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{value}</span>
                    <span>{max}</span>
                </div>
            )}
        </div>
    );
};

interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
    className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 80,
    strokeWidth = 8,
    showLabel = true,
    className,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff5c98" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>
            </svg>
            {showLabel && (
                <span className="absolute text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );
};
