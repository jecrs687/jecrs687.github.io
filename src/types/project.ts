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

export interface SkillCategory {
    [category: string]: Skill[];
}
