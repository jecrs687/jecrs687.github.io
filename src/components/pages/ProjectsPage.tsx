import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { FaLink, FaCode, FaArrowRight, FaPalette } from 'react-icons/fa';
import { useScene } from '@/contexts/SceneContext';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animation';
import { capitalize } from '@/lib';

interface Project {
    name: string;
    link: string;
    description?: string;
    technologies?: string[];
    category?: string;
    image?: string;
}

interface ColorScheme {
    primary: string;
    secundary: string;
    third: string;
}

interface ProjectsData {
    projects: {
        smallProjects: Project[];
        bigProjects?: Project[];
    };
    palette?: ColorScheme[];
}

interface ProjectsPageProps {
    data: ProjectsData;
}

const DEFAULT_PALETTE: ColorScheme[] = [
    { primary: '#f472b6', secundary: '#c084fc', third: '#60a5fa' },
    { primary: '#60a5fa', secundary: '#34d399', third: '#a78bfa' },
    { primary: '#f59e0b', secundary: '#ef4444', third: '#f472b6' },
];

const extractCategories = (projects: Project[]): string[] => {
    const categories = new Set(projects.map((p) => p.category).filter(Boolean) as string[]);
    return ['all', ...categories];
};

const filterByCategory = (projects: Project[], category: string): Project[] =>
    category === 'all' ? projects : projects.filter((p) => p.category === category);

const PageHeader: React.FC = () => (
    <div className="text-center mb-16">
        <motion.div
            className="mb-6 inline-block"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-neon-sakura flex items-center justify-center text-white transform rotate-6">
                <FaPalette className="text-3xl" />
            </div>
        </motion.div>

        <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-sakura-400 bg-clip-text text-transparent font-heading">
                Creative Studio
            </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
            <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent w-24 sm:w-48" />
                <div className="mx-4 text-primary-500">✦</div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent w-24 sm:w-48" />
            </div>
        </FadeIn>

        <FadeIn delay={0.3}>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A showcase of my creative work and technical projects
            </p>
        </FadeIn>
    </div>
);

interface CategoryFilterProps {
    categories: string[];
    selected: string;
    onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, onSelect }) => (
    <FadeIn delay={0.4}>
        <div className="mb-12 flex flex-wrap justify-center gap-3">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-700 p-1 flex flex-wrap justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selected === category
                                ? 'bg-primary-500 text-white shadow-neon-sakura'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {capitalize(category)}
                    </button>
                ))}
            </div>
        </div>
    </FadeIn>
);

interface ProjectCardProps {
    project: Project;
    index: number;
    colorScheme: ColorScheme;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, colorScheme }) => {
    const [isHovered, setIsHovered] = useState(false);

    const tilt = useSpring({
        transform: isHovered ? 'scale(1.03) translateY(-10px)' : 'scale(1) translateY(0px)',
        boxShadow: isHovered
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        config: { tension: 300, friction: 20 },
    });

    const backgroundStyle = project.image
        ? { background: `url(${project.image}) center/cover no-repeat` }
        : { background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secundary}, ${colorScheme.third})` };

    const handleClick = useCallback(
        () => window.open(`https://jecrs687.github.io${project.link}`, '_blank'),
        [project.link]
    );

    return (
        <StaggerItem index={index}>
            <animated.div
                style={tilt}
                className="relative h-72 rounded-xl overflow-hidden cursor-pointer w-full backdrop-blur-sm border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                <div className="absolute inset-0 w-full h-2/3" style={backgroundStyle} />

                {project.category && (
                    <Badge variant="secondary" className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90">
                        {project.category}
                    </Badge>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                        {project.description ?? `A creative project showcasing my work in ${project.category ?? 'development'}.`}
                    </p>

                    <div className="flex justify-between items-center">
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {project.technologies.slice(0, 2).map((tech) => (
                                    <Badge key={tech} variant="outline" className="text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                                {project.technologies.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{project.technologies.length - 2}
                                    </Badge>
                                )}
                            </div>
                        )}

                        <motion.div
                            className="text-primary-600 dark:text-primary-400 flex items-center text-sm font-medium"
                            animate={{ x: isHovered ? 5 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <span>View project</span>
                            <FaArrowRight className="ml-2" />
                        </motion.div>
                    </div>
                </div>
            </animated.div>
        </StaggerItem>
    );
};

interface FeaturedProjectCardProps {
    project: Project;
    index: number;
    colorScheme: ColorScheme;
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({ project, index, colorScheme }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isEven = index % 2 === 0;

    const spring = useSpring({
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0px)',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        config: { tension: 300, friction: 20 },
    });

    const backgroundStyle = project.image
        ? { background: `url(${project.image}) center/cover no-repeat` }
        : { background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secundary})` };

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card variant="glass" className="overflow-hidden shadow-xl">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <animated.div style={spring} className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                        <div
                            className="absolute inset-0 transform hover:scale-105 transition-transform duration-700 ease-in-out"
                            style={backgroundStyle}
                        />

                        {!project.image && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center">
                                        <FaCode className="text-5xl text-white mb-4 mx-auto" />
                                        <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </animated.div>

                    <CardContent className="lg:w-1/2 p-8 flex flex-col justify-between">
                        {project.category && (
                            <Badge variant="secondary" className="w-fit mb-2">
                                {project.category}
                            </Badge>
                        )}

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{project.name}</h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {project.description ??
                                `An impressive featured project that showcases my skills in ${project.category ?? 'development'}.`}
                        </p>

                        {project.technologies && project.technologies.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Technologies:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <Badge key={tech} variant="outline">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            variant="gradient"
                            className="w-fit"
                            onClick={() => window.open(project.link, '_blank')}
                        >
                            <FaLink className="mr-2" /> Explore Project
                        </Button>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
};

const BackgroundDecoration: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-project-grid bg-repeat" />
        <motion.div
            className="absolute top-0 -left-32 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-cyber-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
            className="absolute bottom-20 right-0 w-80 h-80 bg-gradient-to-br from-sakura-500/20 to-primary-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }}
        />
    </div>
);

const ProjectsPage: React.FC<ProjectsPageProps> = ({ data }) => {
    const { setCurrentScene } = useScene();
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        setCurrentScene('studio');
    }, [setCurrentScene]);

    const allProjects = useMemo(() => data.projects.smallProjects ?? [], [data.projects.smallProjects]);
    const bigProjects = useMemo(() => data.projects.bigProjects ?? [], [data.projects.bigProjects]);
    const palette = data.palette ?? DEFAULT_PALETTE;

    const categories = useMemo(() => extractCategories(allProjects), [allProjects]);
    const filteredProjects = useMemo(
        () => filterByCategory(allProjects, selectedCategory),
        [allProjects, selectedCategory]
    );

    const getColorScheme = useCallback((index: number) => palette[index % palette.length], [palette]);

    return (
        <div className="min-h-screen relative">
            <BackgroundDecoration />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 py-16 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <PageHeader />

                    <CategoryFilter
                        categories={categories}
                        selected={selectedCategory}
                        onSelect={setSelectedCategory}
                    />

                    <AnimatePresence mode="wait">
                        <StaggerContainer
                            key={selectedCategory}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.name}
                                    project={project}
                                    index={index}
                                    colorScheme={getColorScheme(index)}
                                />
                            ))}
                        </StaggerContainer>
                    </AnimatePresence>

                    {bigProjects.length > 0 && (
                        <FadeIn delay={0.3}>
                            <div className="mt-24">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-sakura-500 to-primary-500 bg-clip-text text-transparent mb-4">
                                        Featured Works
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-sakura-400 to-primary-400 mx-auto rounded-full" />
                                </div>

                                <div className="space-y-16">
                                    {bigProjects.map((project, index) => (
                                        <FeaturedProjectCard
                                            key={project.name}
                                            project={project}
                                            index={index}
                                            colorScheme={getColorScheme(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectsPage;
