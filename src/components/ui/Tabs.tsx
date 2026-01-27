import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';

interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    items: TabItem[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    items,
    defaultTab,
    onChange,
    variant = 'default',
    className,
}) => {
    const [activeTab, setActiveTab] = React.useState(defaultTab || items[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const activeContent = items.find((item) => item.id === activeTab)?.content;

    const variantStyles = {
        default: {
            container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
            tab: 'px-4 py-2 rounded-md transition-all duration-200',
            active: 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white',
            inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
        },
        pills: {
            container: 'gap-2',
            tab: 'px-4 py-2 rounded-full transition-all duration-200',
            active: 'bg-sakura-500 text-white shadow-lg shadow-sakura-500/30',
            inactive: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
        },
        underline: {
            container: 'border-b border-gray-200 dark:border-gray-700',
            tab: 'px-4 py-3 border-b-2 -mb-px transition-all duration-200',
            active: 'border-sakura-500 text-sakura-600 dark:text-sakura-400',
            inactive: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className={className}>
            <div className={cn('flex', styles.container)}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && handleTabChange(item.id)}
                        disabled={item.disabled}
                        className={cn(
                            styles.tab,
                            'flex items-center gap-2 font-medium',
                            activeTab === item.id ? styles.active : styles.inactive,
                            item.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4"
                >
                    {activeContent}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
