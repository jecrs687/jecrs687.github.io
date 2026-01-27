import { useState, useEffect, useCallback, useRef } from 'react';

export const useDebounce = <T>(value: T, delayMs: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
        return () => clearTimeout(timeoutId);
    }, [value, delayMs]);

    return debouncedValue;
};

export const useDebouncedCallback = <T extends (...args: never[]) => void>(
    callback: T,
    delayMs: number
): T => {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delayMs);
        }) as T,
        [delayMs]
    );
};
