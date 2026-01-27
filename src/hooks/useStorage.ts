import { useState, useCallback, useEffect } from 'react';
import { isBrowser } from '@/lib/browser';

type StorageValue<T> = T | null;

const getStorageValue = <T>(key: string, defaultValue: T): StorageValue<T> => {
    if (!isBrowser) return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const useLocalStorage = <T>(
    key: string,
    defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
    const [storedValue, setStoredValue] = useState<T>(() =>
        getStorageValue(key, defaultValue) ?? defaultValue
    );

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (isBrowser) {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        setStoredValue(defaultValue);
        if (isBrowser) {
            localStorage.removeItem(key);
        }
    }, [key, defaultValue]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue) {
                setStoredValue(JSON.parse(event.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, removeValue];
};
