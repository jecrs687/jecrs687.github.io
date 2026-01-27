import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

const generateId = () => Math.random().toString(36).substring(2, 9);

const typeStyles: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
    success: {
        bg: 'bg-emerald-500',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    error: {
        bg: 'bg-red-500',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
    warning: {
        bg: 'bg-amber-500',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    info: {
        bg: 'bg-blue-500',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = React.useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = generateId();
        setToasts((prev) => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
            {toasts.map((toast) => (
                <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg min-w-[280px]',
                        typeStyles[toast.type].bg
                    )}
                >
                    {typeStyles[toast.type].icon}
                    <span className="flex-1">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);
