/**
 * Tooltip Component
 * Displays helpful information on hover
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {isVisible && (
                <div
                    className={cn(
                        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95',
                        positionClasses[position]
                    )}
                >
                    {content}
                    <div
                        className={cn(
                            'absolute w-2 h-2 bg-gray-900 transform rotate-45',
                            position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                            position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                            position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
                            position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
                        )}
                    />
                </div>
            )}
        </div>
    );
}
