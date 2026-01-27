import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGitHubData, getDevToArticles } from '@/services';
import { useUserStore } from '@/stores';
import { FIVE_MINUTES_MS } from '@/lib';

export const queryKeys = {
    github: ['github'] as const,
    devto: ['devto'] as const,
    userInfo: ['user-info'] as const,
};

export const useGitHubData = () => {
    const { setRepos, setUserInfo, shouldRefetch } = useUserStore();

    return useQuery({
        queryKey: queryKeys.github,
        queryFn: async () => {
            const data = await getGitHubData();

            setUserInfo({
                name: data.name,
                nick: data.login,
                avatar_url: data.avatar_url,
                bio: data.bio || '',
            } as Parameters<typeof setUserInfo>[0]);

            setRepos(data.repos);

            return data;
        },
        enabled: shouldRefetch(),
        staleTime: FIVE_MINUTES_MS,
    });
};

export const useDevToArticles = () => {
    const { setArticles, shouldRefetch } = useUserStore();

    return useQuery({
        queryKey: queryKeys.devto,
        queryFn: async () => {
            const articles = await getDevToArticles();
            setArticles(articles);
            return { devToArticles: articles };
        },
        enabled: shouldRefetch(),
        staleTime: FIVE_MINUTES_MS,
    });
};

export const usePrefetchData = () => {
    const queryClient = useQueryClient();

    const prefetch = () =>
        Promise.all([
            queryClient.prefetchQuery({
                queryKey: queryKeys.github,
                queryFn: getGitHubData,
            }),
            queryClient.prefetchQuery({
                queryKey: queryKeys.devto,
                queryFn: getDevToArticles,
            }),
        ]);

    return { prefetch };
};

export const useRefreshData = () => {
    const queryClient = useQueryClient();
    const { reset } = useUserStore();

    return useMutation({
        mutationFn: async () => {
            reset();
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.github }),
                queryClient.invalidateQueries({ queryKey: queryKeys.devto }),
            ]);
        },
    });
};

export const useUserData = () => {
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
};
