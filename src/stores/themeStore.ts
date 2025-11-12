/**
 * Zustand Store for Theme Management
 * Replaces ThemeContext with better performance and simpler API
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// Check system preference
const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
};

export const useThemeStore = create<ThemeState>()(
    persist(
        immer((set) => ({
            theme: getSystemTheme(),

            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    applyTheme(newTheme);
                    state.theme = newTheme;
                }),

            setTheme: (theme) =>
                set((state) => {
                    applyTheme(theme);
                    state.theme = theme;
                }),
        })),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                // Apply theme after rehydration
                if (state) {
                    applyTheme(state.theme);
                }
            },
        }
    )
);

// Subscribe to system theme changes
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        useThemeStore.getState().setTheme(newTheme);
    });
}
