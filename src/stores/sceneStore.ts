/**
 * Zustand Store for Scene Management
 * Manages 3D scene state across the application
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type SceneType = 'home' | 'cyber' | 'dojo' | 'library' | 'studio';

interface SceneState {
    currentScene: SceneType;
    previousScene: SceneType | null;
    isTransitioning: boolean;
    sceneHistory: SceneType[];

    setCurrentScene: (scene: SceneType) => void;
    startTransition: () => void;
    endTransition: () => void;
    goBack: () => void;
    clearHistory: () => void;
}

export const useSceneStore = create<SceneState>()(
    immer((set, get) => ({
        currentScene: 'home',
        previousScene: null,
        isTransitioning: false,
        sceneHistory: ['home'],

        setCurrentScene: (scene) =>
            set((state) => {
                state.previousScene = state.currentScene;
                state.currentScene = scene;

                // Add to history if it's a new scene
                if (state.sceneHistory[state.sceneHistory.length - 1] !== scene) {
                    state.sceneHistory.push(scene);

                    // Limit history to last 10 scenes
                    if (state.sceneHistory.length > 10) {
                        state.sceneHistory = state.sceneHistory.slice(-10);
                    }
                }
            }),

        startTransition: () =>
            set((state) => {
                state.isTransitioning = true;
            }),

        endTransition: () =>
            set((state) => {
                state.isTransitioning = false;
            }),

        goBack: () =>
            set((state) => {
                const history = state.sceneHistory;
                if (history.length > 1) {
                    history.pop(); // Remove current
                    const previousScene = history[history.length - 1];
                    if (previousScene) {
                        state.currentScene = previousScene;
                    }
                }
            }),

        clearHistory: () =>
            set((state) => {
                state.sceneHistory = [state.currentScene];
                state.previousScene = null;
            }),
    }))
);
