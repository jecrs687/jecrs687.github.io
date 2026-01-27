import { useRef, useEffect, useState } from 'react';

export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

export const useIsFirstRender = (): boolean => {
    const isFirst = useRef(true);

    useEffect(() => {
        isFirst.current = false;
    }, []);

    return isFirst.current;
};

export const useIsMounted = (): (() => boolean) => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return () => isMounted.current;
};

export const useToggle = (initialValue = false): [boolean, () => void] => {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue((prev) => !prev);
    return [value, toggle];
};

export const useCounter = (
    initialValue = 0
): {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
} => {
    const [count, setCount] = useState(initialValue);

    return {
        count,
        increment: () => setCount((c) => c + 1),
        decrement: () => setCount((c) => c - 1),
        reset: () => setCount(initialValue),
        set: setCount,
    };
};
