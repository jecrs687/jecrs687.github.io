import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserInfo, GitHubRepo, Article } from '@/types';
import { FIVE_MINUTES_MS } from '@/lib';

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
    shouldRefetch: () => boolean;
}

const initialState = {
    userInfo: null,
    repos: [],
    articles: [],
    isLoading: false,
    error: null,
    lastFetched: null,
};

export const useUserStore = create<UserState>()(
    persist(
        immer((set, get) => ({
            ...initialState,

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
                    Object.assign(state, initialState);
                }),

            shouldRefetch: () => {
                const { lastFetched } = get();
                return !lastFetched || Date.now() - lastFetched > FIVE_MINUTES_MS;
            },
        })),
        {
            name: 'user-storage',
            partialize: ({ userInfo, repos, articles, lastFetched }) => ({
                userInfo,
                repos,
                articles,
                lastFetched,
            }),
        }
    )
);
