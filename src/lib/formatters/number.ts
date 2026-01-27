const MILLION = 1_000_000;
const THOUSAND = 1_000;

const formatMillions = (value: number) => `${(value / MILLION).toFixed(1)}M`;
const formatThousands = (value: number) => `${(value / THOUSAND).toFixed(1)}K`;

export const formatCompactNumber = (value: number): string =>
    value >= MILLION
        ? formatMillions(value)
        : value >= THOUSAND
            ? formatThousands(value)
            : String(value);

export const formatWithCommas = (value: number): string =>
    new Intl.NumberFormat('en-US').format(value);

export const formatPercentage = (value: number, decimals = 0): string =>
    `${value.toFixed(decimals)}%`;

export const formatOrdinal = (value: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = value % 100;
    const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
    return `${value}${suffix}`;
};
