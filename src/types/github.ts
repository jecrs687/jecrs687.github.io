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

export interface GitHubUser {
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

export interface GitHubData extends GitHubUser {
    repos: GitHubRepo[];
}
