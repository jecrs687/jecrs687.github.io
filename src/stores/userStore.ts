/**
 * Zustand Store for User Data Management
 * Manages user information, repos, and articles
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserInfo, GitHubRepo, Article } from '../types';

interface UserState {
    userInfo: UserInfo | null;
    repos: GitHubRepo[];
    articles: Article[];
    isLoading: boolean;
    error: Error | null;
    lastFetched: number | null;

    setUserInfo: (info: UserInfo) => void;
    setRepos: (repos: GitHubRepo[]) => void;
    setArticles: (articles: Article[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: Error | null) => void;
    updateLastFetched: () => void;
    reset: () => void;

    // Computed/derived state
    shouldRefetch: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserStore = create<UserState>()(
    persist(
        immer((set, get) => ({
            userInfo: null,
            repos: [],
            articles: [],
            isLoading: false,
            error: null,
            lastFetched: null,

            setUserInfo: (info) =>
                set((state) => {
                    state.userInfo = info;
                }),

            setRepos: (repos) =>
                set((state) => {
                    state.repos = repos;
                }),

            setArticles: (articles) =>
                set((state) => {
                    state.articles = articles;
                }),

            setLoading: (loading) =>
                set((state) => {
                    state.isLoading = loading;
                }),

            setError: (error) =>
                set((state) => {
                    state.error = error;
                }),

            updateLastFetched: () =>
                set((state) => {
                    state.lastFetched = Date.now();
                }),

            reset: () =>
                set((state) => {
                    state.userInfo = null;
                    state.repos = [];
                    state.articles = [];
                    state.isLoading = false;
                    state.error = null;
                    state.lastFetched = null;
                }),

            shouldRefetch: () => {
                const { lastFetched } = get();
                if (!lastFetched) return true;
                return Date.now() - lastFetched > CACHE_DURATION;
            },
        })),
        {
            name: 'user-storage',
            partialize: (state) => ({
                userInfo: state.userInfo,
                repos: state.repos,
                articles: state.articles,
                lastFetched: state.lastFetched,
            }),
        }
    )
);
