/**
 * Type definitions for the application
 */

import { ComponentType } from 'react';

export interface UserInfo {
    name: string;
    nick: string;
    githubUser: string;
    mediumUser: string;
    devToUser: string;
    work: string;
    loves: string[];
    facebook: string;
    linkedin: string;
    github: string;
    instagram: string;
    avatar_url: string;
    country: string;
    bio: string;
    age: number | null;
    email: string;
    phone: string;
    city: string;
    address: string;
    login?: string;
    repos?: GitHubRepo[];
    devToArticles?: Article[];
    projects: {
        smallProjects: Project[];
        bigProjects: Project[];
    };
    skills: {
        [category: string]: Skill[];
    };
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    topics: string[];
    visibility: string;
    default_branch: string;
}

export interface Article {
    id: number;
    title: string;
    description: string;
    url: string;
    published_at: string;
    published_timestamp: string;
    tag_list: string[];
    slug: string;
    path: string;
    canonical_url: string;
    comments_count: number;
    positive_reactions_count: number;
    public_reactions_count: number;
    cover_image: string | null;
    social_image: string;
    reading_time_minutes: number;
    user: {
        name: string;
        username: string;
        twitter_username: string | null;
        github_username: string | null;
        profile_image: string;
        profile_image_90: string;
    };
}

export interface Project {
    name: string;
    link: string;
    description?: string;
    image?: string;
    technologies?: string[];
}

export interface Skill {
    name: string;
    percent: number;
}

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

export interface APIResponse<T> {
    data: T;
    error?: string;
}

export interface NavItem {
    path: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    scene: SceneType;
    description: string;
}
