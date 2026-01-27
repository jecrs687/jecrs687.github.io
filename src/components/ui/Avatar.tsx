import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
};

const statusClasses = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
};

const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = '',
    fallback,
    size = 'md',
    className,
    status,
}) => {
    const [hasError, setHasError] = React.useState(false);

    const initials = fallback || alt.charAt(0).toUpperCase() || '?';

    return (
        <motion.div
            className={cn('relative inline-flex', className)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <div
                className={cn(
                    'relative rounded-full overflow-hidden bg-gradient-to-br from-sakura-400 to-cyber-500 flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-800',
                    sizeClasses[size]
                )}
            >
                {src && !hasError ? (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-gray-800',
                        statusClasses[status],
                        statusSizeClasses[size]
                    )}
                />
            )}
        </motion.div>
    );
};

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    children,
    max = 4,
    size = 'md',
}) => {
    const childArray = React.Children.toArray(children);
    const visibleAvatars = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
        <div className="flex -space-x-2">
            {visibleAvatars.map((child, index) => (
                <div key={index} className="relative" style={{ zIndex: max - index }}>
                    {child}
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        'relative rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800',
                        sizeClasses[size]
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};
