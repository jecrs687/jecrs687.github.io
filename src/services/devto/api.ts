import { createApiClient, createGetRequest } from '../http';
import { ARTICLES_FALLBACK } from '@/constants/ARTICLES_FALLBACK';
import user from '@/information.json';
import type { Article } from '@/types';

const DEVTO_BASE_URL = 'https://dev.to/api/articles';

const devtoClient = createApiClient(DEVTO_BASE_URL);

const fetchArticles = createGetRequest<Article[]>(
    devtoClient,
    ARTICLES_FALLBACK as Article[]
);

export const getDevToArticles = async (): Promise<Article[]> =>
    fetchArticles('', {
        username: user.devToUser,
        per_page: 50,
    });
