import { isBrowser } from './dom';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const checkUserAgent = (pattern: RegExp): boolean =>
    isBrowser && pattern.test(navigator.userAgent);

export const isMobileUserAgent = (): boolean =>
    checkUserAgent(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);

export const isMobileViewport = (): boolean =>
    isBrowser && window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

export const isTabletViewport = (): boolean =>
    isBrowser &&
    window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px) and (max-width: ${TABLET_BREAKPOINT}px)`).matches;

export const isDesktopViewport = (): boolean =>
    isBrowser && window.matchMedia(`(min-width: ${TABLET_BREAKPOINT + 1}px)`).matches;

export const isMobile = (): boolean => isMobileUserAgent() || isMobileViewport();

export const isTouchDevice = (): boolean =>
    isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export const getViewport = (): { width: number; height: number } =>
    isBrowser
        ? { width: window.innerWidth, height: window.innerHeight }
        : { width: 0, height: 0 };
