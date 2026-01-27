import { useState, useEffect } from 'react';
import { isMobile as checkMobile, isTouchDevice } from '@/lib/browser';
import { MOBILE_BREAKPOINT } from '@/lib/constants';

export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const updateMobileState = () => setIsMobile(checkMobile());

        updateMobileState();

        const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        mediaQuery.addEventListener('change', updateMobileState);

        return () => mediaQuery.removeEventListener('change', updateMobileState);
    }, []);

    return isMobile;
};

export const useIsTouchDevice = (): boolean => {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(isTouchDevice());
    }, []);

    return isTouch;
};

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        setMatches(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
};

export const useWindowSize = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
};
