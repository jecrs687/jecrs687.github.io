const TIME_UNITS = [
    { unit: 'year', seconds: 31_536_000 },
    { unit: 'month', seconds: 2_592_000 },
    { unit: 'week', seconds: 604_800 },
    { unit: 'day', seconds: 86_400 },
    { unit: 'hour', seconds: 3_600 },
    { unit: 'minute', seconds: 60 },
] as const;

const toDate = (input: string | Date): Date => new Date(input);

const pluralize = (count: number, singular: string): string =>
    count === 1 ? singular : `${singular}s`;

export const formatDate = (input: string | Date): string =>
    new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(toDate(input));

export const formatShortDate = (input: string | Date): string =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(toDate(input));

export const formatLongDate = (input: string | Date): string =>
    new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(toDate(input));

export const formatRelativeTime = (input: string | Date): string => {
    const diffInSeconds = Math.floor((Date.now() - toDate(input).getTime()) / 1000);

    const matchedUnit = TIME_UNITS.find(({ seconds }) => diffInSeconds >= seconds);

    return matchedUnit
        ? `${Math.floor(diffInSeconds / matchedUnit.seconds)} ${pluralize(
            Math.floor(diffInSeconds / matchedUnit.seconds),
            matchedUnit.unit
        )} ago`
        : 'just now';
};

export const formatMonthYear = (input: string | Date): string =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
    }).format(toDate(input));

export const isToday = (input: string | Date): boolean => {
    const date = toDate(input);
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const isThisWeek = (input: string | Date): boolean => {
    const date = toDate(input);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return date >= weekStart;
};
