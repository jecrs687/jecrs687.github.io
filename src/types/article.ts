export interface ArticleAuthor {
    name: string;
    username: string;
    twitter_username: string | null;
    github_username: string | null;
    profile_image: string;
    profile_image_90: string;
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
    user: ArticleAuthor;
}
