import { createApiClient, createGetRequest } from '../http';
import { REPOS_FALLBACK } from '@/constants/REPOS_FALLBACK';
import { GITHUB_FALLBACK } from '@/constants/GITHUB_FALLBACK';
import user from '@/information.json';
import type { GitHubRepo, GitHubUser, GitHubData } from '@/types';

const GITHUB_BASE_URL = `https://api.github.com/users/${user.githubUser}`;

const githubClient = createApiClient(GITHUB_BASE_URL, {
    Accept: 'application/vnd.github.v3+json',
});

const fetchUserInfo = createGetRequest<GitHubUser>(
    githubClient,
    GITHUB_FALLBACK as GitHubUser
);

const fetchRepos = createGetRequest<GitHubRepo[]>(
    githubClient,
    REPOS_FALLBACK as GitHubRepo[]
);

export const getGitHubData = async (): Promise<GitHubData> => {
    const [userInfo, repos] = await Promise.all([
        fetchUserInfo(),
        fetchRepos('/repos'),
    ]);

    return { ...userInfo, repos };
};
