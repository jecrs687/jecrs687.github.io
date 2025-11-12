/**
 * Toast Notification Utilities
 * Wrapper around react-hot-toast for consistent notifications
 */

import toast, { Toaster, ToastOptions } from 'react-hot-toast';

// Default toast options
const defaultOptions: ToastOptions = {
    duration: 4000,
    position: 'bottom-right',
    style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
    },
};

// Custom toast functions
export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, { ...defaultOptions, ...options });
    },

    error: (message: string, options?: ToastOptions) => {
        toast.error(message, { ...defaultOptions, ...options });
    },

    loading: (message: string, options?: ToastOptions) => {
        return toast.loading(message, { ...defaultOptions, ...options });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(promise, messages, defaultOptions);
    },

    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },
};

// Toaster component to be added to app root
export { Toaster };

// Example usage:
// showToast.success('Data loaded successfully!');
// showToast.error('Failed to load data');
// const toastId = showToast.loading('Loading...');
// showToast.dismiss(toastId);
