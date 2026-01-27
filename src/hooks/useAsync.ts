import { useState, useEffect, useCallback, useRef } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncState<T> {
    status: AsyncStatus;
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
}

export const useAsync = <T>(
    asyncFn: () => Promise<T>,
    immediate = true
): AsyncState<T> & { execute: () => Promise<T | void> } => {
    const [state, setState] = useState<AsyncState<T>>({
        status: 'idle',
        data: null,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
    });

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const execute = useCallback(async () => {
        setState((prev) => ({
            ...prev,
            status: 'pending',
            isLoading: true,
            isError: false,
            isSuccess: false,
        }));

        try {
            const data = await asyncFn();
            if (isMountedRef.current) {
                setState({
                    status: 'success',
                    data,
                    error: null,
                    isLoading: false,
                    isError: false,
                    isSuccess: true,
                });
            }
            return data;
        } catch (error) {
            if (isMountedRef.current) {
                setState({
                    status: 'error',
                    data: null,
                    error: error as Error,
                    isLoading: false,
                    isError: true,
                    isSuccess: false,
                });
            }
        }
    }, [asyncFn]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { ...state, execute };
};
