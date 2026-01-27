import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', className }) => {
    React.useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={cn(
                            'relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden',
                            sizeClasses[size],
                            className
                        )}
                    >
                        {title && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: 'default' | 'danger';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    variant = 'default',
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                {cancelText}
            </button>
            <button
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
                className={cn(
                    'px-4 py-2 rounded-lg text-white transition-colors',
                    variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-sakura-500 hover:bg-sakura-600'
                )}
            >
                {confirmText}
            </button>
        </div>
    </Modal>
);
