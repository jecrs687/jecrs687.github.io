export const groupBy = <T, K extends string | number | symbol>(
    items: T[],
    keyFn: (item: T) => K
): Record<K, T[]> =>
    items.reduce(
        (acc, item) => {
            const key = keyFn(item);
            return {
                ...acc,
                [key]: [...(acc[key] || []), item],
            };
        },
        {} as Record<K, T[]>
    );

export const sortBy = <T>(items: T[], keyFn: (item: T) => number | string): T[] =>
    [...items].sort((a, b) => {
        const keyA = keyFn(a);
        const keyB = keyFn(b);
        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
    });

export const sortByDesc = <T>(items: T[], keyFn: (item: T) => number | string): T[] =>
    sortBy(items, keyFn).reverse();

export const uniqueBy = <T, K>(items: T[], keyFn: (item: T) => K): T[] => {
    const seen = new Set<K>();
    return items.filter((item) => {
        const key = keyFn(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

export const unique = <T>(items: T[]): T[] => [...new Set(items)];

export const filterNil = <T>(items: (T | null | undefined)[]): T[] =>
    items.filter((item): item is T => item !== null && item !== undefined);

export const chunk = <T>(items: T[], size: number): T[][] =>
    items.reduce<T[][]>((acc, _, index) => {
        if (index % size === 0) {
            acc.push(items.slice(index, index + size));
        }
        return acc;
    }, []);

export const first = <T>(items: T[]): T | undefined => items[0];

export const last = <T>(items: T[]): T | undefined => items[items.length - 1];

export const isEmpty = <T>(items: T[]): boolean => items.length === 0;

export const isNotEmpty = <T>(items: T[]): boolean => items.length > 0;
