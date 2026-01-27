import type { GitHubRepo } from './github';
import type { Article } from './article';
import type { Project, SkillCategory } from './project';

export interface SocialLinks {
    facebook: string;
    linkedin: string;
    github: string;
    instagram: string;
}

export interface UserInfo {
    name: string;
    nick: string;
    githubUser: string;
    mediumUser: string;
    devToUser: string;
    work: string;
    loves: string[];
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
    skills: SkillCategory;
    facebook: string;
    linkedin: string;
    github: string;
    instagram: string;
}
