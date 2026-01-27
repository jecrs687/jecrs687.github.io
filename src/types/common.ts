import type { ComponentType } from 'react';
import type { SceneType } from './theme';

export interface NavItem {
    path: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    scene: SceneType;
    description: string;
}

export interface APIResponse<T> {
    data: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
