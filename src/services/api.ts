/**
 * API Service Layer
 * Handles all external API calls with proper error handling and typing
 */

import axios, { AxiosError } from 'axios';
import user from '../information.json';
import { REPOS_FALLBACK } from '../constants/REPOS_FALLBACK';
import { GITHUB_FALLBACK } from '../constants/GITHUB_FALLBACK';
import { ARTICLES_FALLBACK } from '../constants/ARTICLES_FALLBACK';
import type { GitHubRepo, Article } from '../types';

// Create axios instances with proper configuration
const github = axios.create({
   baseURL: `https://api.github.com/users/${user.githubUser}`,
   timeout: 10000,
   headers: {
      'Accept': 'application/vnd.github.v3+json',
   },
});

const devTo = axios.create({
   baseURL: `https://dev.to/api/articles`,
   timeout: 10000,
   headers: {
      'Accept': 'application/json',
   },
});

// Add response interceptor for better error handling
github.interceptors.response.use(
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   (response: any) => response,
   (error: AxiosError) => {
      console.error('GitHub API Error:', error.message);
      return Promise.reject(error);
   }
);

devTo.interceptors.response.use(
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   (response: any) => response,
   (error: AxiosError) => {
      console.error('Dev.to API Error:', error.message);
      return Promise.reject(error);
   }
);

interface GitHubUserInfo {
   login: string;
   name: string;
   avatar_url: string;
   bio: string;
   public_repos: number;
   followers: number;
   following: number;
   created_at: string;
   updated_at: string;
}

interface GitHubResponse extends GitHubUserInfo {
   repos: GitHubRepo[];
}

/**
 * Fetches GitHub user information and repositories
 * Falls back to cached data if API request fails
 */
export async function getGithub(): Promise<GitHubResponse> {
   try {
      const userInfoPromise = github
         .get<GitHubUserInfo>('')
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         .then((response: any) => response.data as GitHubUserInfo)
         .catch(() => GITHUB_FALLBACK as GitHubUserInfo);

      const reposPromise = github
         .get<GitHubRepo[]>('/repos')
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         .then((response: any) => response.data as GitHubRepo[])
         .catch(() => REPOS_FALLBACK as GitHubRepo[]);

      const [userInfo, repos] = await Promise.all([userInfoPromise, reposPromise]);

      return { ...userInfo, repos };
   } catch (error) {
      console.error('Error fetching GitHub data:', error);
      return {
         ...GITHUB_FALLBACK as GitHubUserInfo,
         repos: REPOS_FALLBACK as GitHubRepo[],
      };
   }
}

interface DevToResponse {
   devToArticles: Article[];
}

/**
 * Fetches Dev.to articles for the configured user
 * Falls back to cached data if API request fails
 */
export async function getDevTo(): Promise<DevToResponse> {
   try {
      const response = await devTo.get<Article[]>('', {
         params: {
            username: user.devToUser,
            per_page: 50,
         },
      });

      return { devToArticles: response.data };
   } catch (error) {
      console.error('Error fetching Dev.to articles:', error);
      return { devToArticles: ARTICLES_FALLBACK as Article[] };
   }
}

/**
 * Utility function to check if data is stale
 * Can be used to implement cache invalidation logic
 */
export function isDataStale(lastFetch: number, maxAge: number = 5 * 60 * 1000): boolean {
   return Date.now() - lastFetch > maxAge;
}
