import { ComponentType } from 'react';

export type Theme = 'light' | 'dark';

export type SceneType = 'home' | 'cyber' | 'dojo' | 'library' | 'studio';

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export interface SceneContextType {
    currentScene: SceneType;
    setCurrentScene: (scene: SceneType) => void;
}
