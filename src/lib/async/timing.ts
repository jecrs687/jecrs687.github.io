type AnyFunction = (...args: never[]) => unknown;

export const debounce = <T extends AnyFunction>(
    fn: T,
    delayMs: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delayMs);
    };
};

export const throttle = <T extends AnyFunction>(
    fn: T,
    limitMs: number
): ((...args: Parameters<T>) => void) => {
    let isThrottled = false;

    return (...args: Parameters<T>) => {
        if (isThrottled) return;
        fn(...args);
        isThrottled = true;
        setTimeout(() => (isThrottled = false), limitMs);
    };
};

export const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const retry = async <T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    delayMs: number = 1000
): Promise<T> => {
    const attempt = async (remainingAttempts: number): Promise<T> => {
        try {
            return await fn();
        } catch (error) {
            if (remainingAttempts <= 1) throw error;
            await delay(delayMs);
            return attempt(remainingAttempts - 1);
        }
    };
    return attempt(maxAttempts);
};
