export const pick = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> =>
    keys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: obj[key],
        }),
        {} as Pick<T, K>
    );

export const omit = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> =>
    (Object.keys(obj) as Array<keyof T>)
        .filter((key): key is Exclude<keyof T, K> => !keys.includes(key as K))
        .reduce(
            (acc, key) => ({
                ...acc,
                [key]: obj[key],
            }),
            {} as Omit<T, K>
        );

export const merge = <T extends object>(...objects: Partial<T>[]): Partial<T> =>
    objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as Partial<T>);

export const hasKey = <T extends object>(obj: T, key: PropertyKey): key is keyof T =>
    Object.prototype.hasOwnProperty.call(obj, key);

export const keys = <T extends object>(obj: T): Array<keyof T> =>
    Object.keys(obj) as Array<keyof T>;

export const values = <T extends object>(obj: T): Array<T[keyof T]> =>
    Object.values(obj);

export const entries = <T extends object>(obj: T): Array<[keyof T, T[keyof T]]> =>
    Object.entries(obj) as Array<[keyof T, T[keyof T]]>;

export const fromEntries = <K extends string | number | symbol, V>(
    entries: Array<[K, V]>
): Record<K, V> => Object.fromEntries(entries) as Record<K, V>;

export const mapValues = <T extends object, U>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> =>
    entries(obj).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: fn(value, key),
        }),
        {} as Record<keyof T, U>
    );
