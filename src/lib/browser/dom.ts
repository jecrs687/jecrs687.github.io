export const isBrowser = typeof window !== 'undefined';

export const isServer = !isBrowser;

export const getScrollPosition = (): { x: number; y: number } =>
    isBrowser
        ? { x: window.pageXOffset, y: window.pageYOffset }
        : { x: 0, y: 0 };

export const scrollToElement = (elementId: string, offset = 0): void => {
    if (!isBrowser) return;

    const element = document.getElementById(elementId);
    if (!element) return;

    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
    if (!isBrowser) return;
    window.scrollTo({ top: 0, behavior });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!isBrowser || !navigator.clipboard) return false;

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

export const getPreferredColorScheme = (): 'light' | 'dark' =>
    isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

export const prefersReducedMotion = (): boolean =>
    isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
