/**
 * Custom React Hooks
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if device is mobile
 * @returns boolean indicating if device is mobile
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            return (
                typeof window !== 'undefined' &&
                (window.matchMedia('(max-width: 768px)').matches ||
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent
                    ))
            );
        };

        setIsMobile(checkMobile());

        const handleResize = () => {
            setIsMobile(checkMobile());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

/**
 * Hook for managing data fetching state
 * @returns object with loading, error, and data state
 */
export function useAsync<T>(
    asyncFunction: () => Promise<T>,
    immediate = true
) {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        } catch (error) {
            setError(error as Error);
            setStatus('error');
            throw error;
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error, isLoading: status === 'pending' };
}

/**
 * Hook for debouncing values
 * @param value - value to debounce
 * @param delay - delay in milliseconds
 * @returns debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for managing local storage
 * @param key - storage key
 * @param initialValue - initial value
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.error(`Error loading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    const removeValue = () => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue];
}

/**
 * Hook for intersection observer (lazy loading, animations on scroll)
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting]
 */
export function useIntersectionObserver(
    options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry?.isIntersecting ?? false);
        }, options);

        observer.observe(ref);

        return () => {
            observer.disconnect();
        };
    }, [ref, options]);

    const refCallback = useCallback((node: HTMLDivElement) => {
        setRef(node);
    }, []);

    return [{ current: ref } as React.RefObject<HTMLDivElement>, isIntersecting];
}

/**
 * Hook for managing previous value
 * @param value - current value
 * @returns previous value
 */
export function usePrevious<T>(value: T): T | undefined {
    const [current, setCurrent] = useState<T>(value);
    const [previous, setPrevious] = useState<T | undefined>(undefined);

    if (value !== current) {
        setPrevious(current);
        setCurrent(value);
    }

    return previous;
}
