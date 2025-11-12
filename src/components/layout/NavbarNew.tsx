/**
 * Enhanced Navigation Bar
 * Modern, responsive navbar with smooth animations
 */

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Code2, Lightbulb, BookOpen, Palette, Moon, Sun, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { useThemeStore } from '@/stores/themeStore';
import { useSceneStore } from '@/stores/sceneStore';

const navItems = [
    {
        path: '/',
        name: 'Home',
        icon: Home,
        scene: 'home' as const,
        description: 'Welcome to my portfolio',
        color: 'sakura'
    },
    {
        path: '/repositories',
        name: 'Repositories',
        icon: Code2,
        scene: 'cyber' as const,
        description: 'Explore my GitHub projects',
        color: 'cyber'
    },
    {
        path: '/skills',
        name: 'Skills',
        icon: Lightbulb,
        scene: 'dojo' as const,
        description: 'My technical expertise',
        color: 'matcha'
    },
    {
        path: '/articles',
        name: 'Articles',
        icon: BookOpen,
        scene: 'library' as const,
        description: 'Read my latest thoughts',
        color: 'fuji'
    },
    {
        path: '/projects',
        name: 'Projects',
        icon: Palette,
        scene: 'studio' as const,
        description: 'View my featured work',
        color: 'sakura'
    },
];

export function Navbar() {
    const [expanded, setExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useThemeStore();
    const { setCurrentScene } = useSceneStore();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Update scene based on current route
    useEffect(() => {
        const item = navItems.find(nav => nav.path === location.pathname);
        if (item) {
            setCurrentScene(item.scene);
        }
    }, [location.pathname, setCurrentScene]);

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={expanded ? 'expanded' : 'collapsed'}
                variants={{
                    expanded: { width: '16rem' },
                    collapsed: { width: '5rem' }
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                className="hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 z-40 shadow-xl"
            >
                {/* Logo/Brand */}
                <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-800">
                    <motion.div
                        animate={expanded ? { scale: 1 } : { scale: 0.8 }}
                        className="text-2xl font-bold bg-gradient-to-r from-sakura-500 to-cyber-500 bg-clip-text text-transparent"
                    >
                        {expanded ? 'Portfolio' : 'P'}
                    </motion.div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.path} content={item.description} position="right">
                                <NavLink to={item.path}>
                                    {({ isActive: active }) => (
                                        <motion.div
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                                                active
                                                    ? `bg-${item.color}-100 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 shadow-lg`
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            )}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <AnimatePresence>
                                                {expanded && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="font-medium whitespace-nowrap"
                                                    >
                                                        {item.name}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </NavLink>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Theme Toggle */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                    <Tooltip content={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} position="right">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className={cn(
                                'w-full',
                                expanded ? 'justify-start px-3' : 'justify-center'
                            )}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                            <AnimatePresence>
                                {expanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="ml-3 font-medium"
                                    >
                                        {theme === 'light' ? 'Dark' : 'Light'} Mode
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </Tooltip>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="text-xl font-bold bg-gradient-to-r from-sakura-500 to-cyber-500 bg-clip-text text-transparent">
                        Portfolio
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed inset-x-0 top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl"
                    >
                        <nav className="px-4 py-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {({ isActive: active }) => (
                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                className={cn(
                                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                                    active
                                                        ? `bg-${item.color}-100 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 shadow-lg`
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
