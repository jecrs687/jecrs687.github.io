export const truncate = (text: string, maxLength: number): string =>
    text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

export const capitalize = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const capitalizeWords = (text: string): string =>
    text.split(' ').map(capitalize).join(' ');

export const slugify = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const unslugify = (slug: string): string =>
    slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export const generateId = (): string =>
    `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

export const stripHtml = (html: string): string =>
    html.replace(/<[^>]*>/g, '');

export const extractInitials = (name: string): string =>
    name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
