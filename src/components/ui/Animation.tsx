import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';

interface AnimatedListProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
    children,
    className,
    staggerDelay = 0.05,
}) => (
    <motion.div className={className}>
        {React.Children.map(children, (child, index) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * staggerDelay, duration: 0.3 }}
            >
                {child}
            </motion.div>
        ))}
    </motion.div>
);

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const directionVariants = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: 20 },
    right: { y: 0, x: -20 },
    none: { y: 0, x: 0 },
};

export const FadeIn: React.FC<FadeInProps> = ({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = 'up',
}) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, ...directionVariants[direction] }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay, duration, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);

interface ScaleOnHoverProps {
    children: React.ReactNode;
    className?: string;
    scale?: number;
}

export const ScaleOnHover: React.FC<ScaleOnHoverProps> = ({
    children,
    className,
    scale = 1.05,
}) => (
    <motion.div
        className={className}
        whileHover={{ scale }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
        {children}
    </motion.div>
);

interface SlideInProps {
    children: React.ReactNode;
    className?: string;
    isVisible: boolean;
    direction?: 'left' | 'right' | 'up' | 'down';
}

const slideVariants = {
    left: { x: '-100%' },
    right: { x: '100%' },
    up: { y: '-100%' },
    down: { y: '100%' },
};

export const SlideIn: React.FC<SlideInProps> = ({
    children,
    className,
    isVisible,
    direction = 'left',
}) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                className={className}
                initial={{ ...slideVariants[direction], opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ ...slideVariants[direction], opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

interface PulseProps {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
}

export const Pulse: React.FC<PulseProps> = ({
    children,
    className,
    isActive = true,
}) => (
    <motion.div
        className={cn(className, isActive && 'relative')}
        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
        {children}
    </motion.div>
);

interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    className,
    staggerDelay = 0.1,
}) => (
    <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: staggerDelay },
            },
        }}
    >
        {children}
    </motion.div>
);

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
    index?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className }) => (
    <motion.div
        className={className}
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        }}
    >
        {children}
    </motion.div>
);
