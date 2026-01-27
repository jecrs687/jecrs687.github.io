export const pipe =
    <T>(...fns: Array<(arg: T) => T>) =>
        (value: T): T =>
            fns.reduce((acc, fn) => fn(acc), value);

export const compose =
    <T>(...fns: Array<(arg: T) => T>) =>
        (value: T): T =>
            fns.reduceRight((acc, fn) => fn(acc), value);

export const identity = <T>(value: T): T => value;

export const noop = (): void => { };

export const constant =
    <T>(value: T) =>
        (): T =>
            value;

export const not =
    <T>(predicate: (value: T) => boolean) =>
        (value: T): boolean =>
            !predicate(value);

export const isNil = (value: unknown): value is null | undefined =>
    value === null || value === undefined;

export const isNotNil = <T>(value: T | null | undefined): value is T => !isNil(value);

export const defaultTo =
    <T>(defaultValue: T) =>
        (value: T | null | undefined): T =>
            isNil(value) ? defaultValue : value;
