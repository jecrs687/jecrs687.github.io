/**
 * Interactive Features Components
 * 
 * Cool UI features for enhanced user experience:
 * - Cursor follower effect
 * - Scroll progress indicator
 * - Magnetic buttons
 * - Text reveal animations
 */

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ============================================================================
// CURSOR FOLLOWER
// ============================================================================

interface CursorFollowerProps {
    /** Enable/disable the effect */
    enabled?: boolean;
    /** Size of the cursor dot */
    dotSize?: number;
    /** Size of the cursor ring */
    ringSize?: number;
}

/**
 * Custom cursor follower with smooth spring animation
 * Hides on mobile devices for better UX
 */
export const CursorFollower = memo(({
    enabled = true,
    dotSize = 8,
    ringSize = 40
}: CursorFollowerProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(true);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile || !enabled) return;

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Detect hoverable elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isHoverable = target.closest('a, button, [data-cursor-hover]');
            setIsHovering(!!isHoverable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseover', handleElementHover);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseover', handleElementHover);
        };
    }, [cursorX, cursorY, enabled, isMobile, isVisible]);

    if (isMobile || !enabled) return null;

    return (
        <>
            {/* Cursor dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    className="rounded-full bg-white"
                    animate={{
                        width: isHovering ? dotSize * 2 : dotSize,
                        height: isHovering ? dotSize * 2 : dotSize,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>

            {/* Cursor ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    className="rounded-full border-2 border-blue-500/50 dark:border-blue-400/50"
                    animate={{
                        width: isHovering ? ringSize * 1.5 : ringSize,
                        height: isHovering ? ringSize * 1.5 : ringSize,
                        opacity: isVisible ? 0.5 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </>
    );
});

CursorFollower.displayName = 'CursorFollower';

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

interface ScrollProgressProps {
    /** Position of the indicator */
    position?: 'top' | 'bottom';
    /** Height in pixels */
    height?: number;
    /** Color scheme */
    color?: 'gradient' | 'blue' | 'purple' | 'pink';
}

/**
 * Shows reading progress as a colored bar at top/bottom of screen
 */
export const ScrollProgress = memo(({
    position = 'top',
    height = 3,
    color = 'gradient'
}: ScrollProgressProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const colorClasses = {
        gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
    };

    return (
        <div
            className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'}`}
            style={{ height }}
        >
            <motion.div
                className={`h-full ${colorClasses[color]} shadow-lg`}
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
});

ScrollProgress.displayName = 'ScrollProgress';

// ============================================================================
// MAGNETIC BUTTON
// ============================================================================

interface MagneticProps {
    children: React.ReactNode;
    /** Strength of the magnetic effect (0-1) */
    strength?: number;
    /** Padding around the hit area */
    padding?: number;
}

/**
 * Wraps children with a magnetic hover effect
 */
export const Magnetic = memo(({ children, strength = 0.3, padding = 50 }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        x.set(deltaX);
        y.set(deltaY);
    }, [strength, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    const springX = useSpring(x, { damping: 15, stiffness: 150 });
    const springY = useSpring(y, { damping: 15, stiffness: 150 });

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY, padding }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
});

Magnetic.displayName = 'Magnetic';

// ============================================================================
// TEXT REVEAL ANIMATION
// ============================================================================

interface TextRevealProps {
    text: string;
    /** Animation trigger mode */
    trigger?: 'inView' | 'immediate';
    /** Delay between each character (seconds) */
    stagger?: number;
    /** Custom className */
    className?: string;
}

/**
 * Reveals text character by character with animation
 */
export const TextReveal = memo(({
    text,
    trigger = 'inView',
    stagger = 0.02,
    className = ''
}: TextRevealProps) => {
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
        },
    };

    return (
        <motion.span
            className={`inline-flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView={trigger === 'inView' ? 'visible' : undefined}
            animate={trigger === 'immediate' ? 'visible' : undefined}
            viewport={{ once: true, margin: '-100px' }}
        >
            {words.map((word, index) => (
                <span key={index} className="inline-flex mr-2">
                    {word.split('').map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            variants={child}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.span>
    );
});

TextReveal.displayName = 'TextReveal';

// ============================================================================
// SPOTLIGHT EFFECT
// ============================================================================

interface SpotlightProps {
    children: React.ReactNode;
    /** Size of the spotlight */
    size?: number;
    /** Intensity of the effect (0-1) */
    intensity?: number;
}

/**
 * Creates a spotlight effect following the cursor
 */
export const Spotlight = memo(({ children, size = 400, intensity = 0.15 }: SpotlightProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {children}
            <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{
                    background: isHovering
                        ? `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, rgba(255,255,255,${intensity}), transparent 80%)`
                        : 'none',
                }}
                transition={{ duration: 0.2 }}
            />
        </div>
    );
});

Spotlight.displayName = 'Spotlight';

// ============================================================================
// FLOATING ELEMENTS
// ============================================================================

interface FloatingElementProps {
    children: React.ReactNode;
    /** Floating range in pixels */
    range?: number;
    /** Animation duration in seconds */
    duration?: number;
    /** Initial delay */
    delay?: number;
}

/**
 * Makes children float with a smooth animation
 */
export const FloatingElement = memo(({
    children,
    range = 10,
    duration = 3,
    delay = 0
}: FloatingElementProps) => {
    return (
        <motion.div
            animate={{
                y: [0, -range, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                delay,
            }}
        >
            {children}
        </motion.div>
    );
});

FloatingElement.displayName = 'FloatingElement';

// ============================================================================
// TILT CARD
// ============================================================================

interface TiltCardProps {
    children: React.ReactNode;
    /** Maximum tilt angle in degrees */
    maxTilt?: number;
    /** Perspective value */
    perspective?: number;
    /** Enable shine effect */
    shine?: boolean;
}

/**
 * Card with 3D tilt effect on hover
 */
export const TiltCard = memo(({
    children,
    maxTilt = 10,
    perspective = 1000,
    shine = true
}: TiltCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);

        setTilt({
            x: -percentY * maxTilt,
            y: percentX * maxTilt,
        });

        if (shine) {
            setShinePosition({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
            });
        }
    }, [maxTilt, shine]);

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 });
        setShinePosition({ x: 50, y: 50 });
    }, []);

    return (
        <motion.div
            ref={cardRef}
            className="relative"
            style={{ perspective }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {children}

                {shine && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none rounded-inherit"
                        animate={{
                            background: `radial-gradient(circle at ${shinePosition.x}% ${shinePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                        }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
});

TiltCard.displayName = 'TiltCard';

// Re-export all (already exported inline)
