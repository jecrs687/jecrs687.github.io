/**
 * React Query Hooks for API Data Fetching
 * Uses React Query for server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGithub, getDevTo } from '../services/api';
import { useUserStore } from '../stores';

// Query Keys
export const queryKeys = {
    github: ['github'] as const,
    devto: ['devto'] as const,
    userInfo: ['user-info'] as const,
};

/**
 * Hook to fetch GitHub data
 */
export function useGitHubData() {
    const { setRepos, setUserInfo, shouldRefetch } = useUserStore();

    return useQuery({
        queryKey: queryKeys.github,
        queryFn: async () => {
            const data = await getGithub();

            // Update Zustand store
            setUserInfo({
                name: data.name,
                nick: data.login,
                avatar_url: data.avatar_url,
                bio: data.bio || '',
            } as any);

            setRepos(data.repos);

            return data;
        },
        enabled: shouldRefetch(),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch Dev.to articles
 */
export function useDevToArticles() {
    const { setArticles, shouldRefetch } = useUserStore();

    return useQuery({
        queryKey: queryKeys.devto,
        queryFn: async () => {
            const data = await getDevTo();

            // Update Zustand store
            setArticles(data.devToArticles);

            return data;
        },
        enabled: shouldRefetch(),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to prefetch all data
 */
export function usePrefetchData() {
    const queryClient = useQueryClient();

    const prefetch = async () => {
        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: queryKeys.github,
                queryFn: getGithub,
            }),
            queryClient.prefetchQuery({
                queryKey: queryKeys.devto,
                queryFn: getDevTo,
            }),
        ]);
    };

    return { prefetch };
}

/**
 * Hook to invalidate and refetch all data
 */
export function useRefreshData() {
    const queryClient = useQueryClient();
    const { reset } = useUserStore();

    const refresh = useMutation({
        mutationFn: async () => {
            reset();
            await queryClient.invalidateQueries({ queryKey: queryKeys.github });
            await queryClient.invalidateQueries({ queryKey: queryKeys.devto });
        },
    });

    return refresh;
}

/**
 * Combined hook for fetching all user data
 */
export function useUserData() {
    const github = useGitHubData();
    const devto = useDevToArticles();

    return {
        isLoading: github.isLoading || devto.isLoading,
        isError: github.isError || devto.isError,
        error: github.error || devto.error,
        data: {
            github: github.data,
            devto: devto.data,
        },
        refetch: () => {
            github.refetch();
            devto.refetch();
        },
    };
}
