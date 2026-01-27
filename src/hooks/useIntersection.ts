import { useState, useEffect, useCallback, useRef } from 'react';

interface IntersectionOptions extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
    options: IntersectionOptions = {}
): [React.RefCallback<HTMLElement>, boolean] => {
    const { freezeOnceVisible = false, ...observerOptions } = options;
    const [isIntersecting, setIsIntersecting] = useState(false);
    const frozen = useRef(false);

    const callback = useCallback(
        ([entry]: IntersectionObserverEntry[]) => {
            if (frozen.current) return;

            const isVisible = entry?.isIntersecting ?? false;
            setIsIntersecting(isVisible);

            if (freezeOnceVisible && isVisible) {
                frozen.current = true;
            }
        },
        [freezeOnceVisible]
    );

    const observerRef = useRef<IntersectionObserver | null>(null);

    const setRef = useCallback(
        (node: HTMLElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            if (node) {
                observerRef.current = new IntersectionObserver(callback, observerOptions);
                observerRef.current.observe(node);
            }
        },
        [callback, observerOptions]
    );

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    return [setRef, isIntersecting];
};
