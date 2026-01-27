import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoRepo, GoStar, GoRepoForked, GoCode } from 'react-icons/go';
import { FaExternalLinkAlt, FaTerminal, FaNetworkWired } from 'react-icons/fa';
import { SearchInput, Select, Badge, Card, CardContent, CardFooter } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animation';
import Cube from '@/components/3d/Cube';
import { formatDate } from '@/lib';

interface Repo {
    id?: number;
    full_name: string;
    html_url: string;
    name: string;
    description: string | null;
    language: string | null;
    fork: boolean;
    created_at: string;
    updated_at: string;
    homepage: string | null;
    stargazers_count?: number;
    forks_count?: number;
    topics?: string[];
}

interface ReposPageProps {
    info: {
        repos: Repo[];
    };
}

const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    C: '#555555',
    'C++': '#f34b7d',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Go: '#00ADD8',
    VHDL: '#543978',
    Rust: '#dea584',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
};

const SORT_OPTIONS = [
    { value: 'updated', label: 'Recently Updated' },
    { value: 'created', label: 'Recently Created' },
    { value: 'stars', label: 'Most Stars' },
    { value: 'name', label: 'Name (A-Z)' },
];

const TECH_SYMBOLS = ['0', '1', '{', '}', '<', '>', '/', '*', '#', '='];

const sortRepos = (repos: Repo[], sortBy: string): Repo[] => {
    const sortFunctions: Record<string, (a: Repo, b: Repo) => number> = {
        name: (a, b) => a.name.localeCompare(b.name),
        stars: (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0),
        created: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        updated: (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    };
    return [...repos].sort(sortFunctions[sortBy] ?? sortFunctions.updated);
};

const filterRepos = (repos: Repo[], searchTerm: string, languageFilter: string): Repo[] =>
    repos
        .filter((repo) => {
            const matchesSearch =
                !searchTerm ||
                repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = languageFilter === 'All' || repo.language === languageFilter;
            return matchesSearch && matchesLanguage;
        });

const FloatingSymbol: React.FC<{ symbol: string; index: number }> = ({ symbol, index }) => (
    <motion.div
        className="absolute text-cyber-500/10 dark:text-cyber-400/10 select-none"
        initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.2,
            scale: 0.5 + Math.random() * 2,
            rotate: Math.random() * 360,
        }}
        animate={{
            y: ['0%', '100%'],
            rotate: [0, 360],
            opacity: [0.1 + Math.random() * 0.2, 0.05],
        }}
        transition={{
            repeat: Infinity,
            duration: 15 + Math.random() * 15,
            ease: 'linear',
        }}
        style={{
            fontSize: `${2 + Math.random() * 5}rem`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
        }}
    >
        {symbol}
    </motion.div>
);

const PageHeader: React.FC = () => (
    <div className="text-center mb-12">
        <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-cyber-400 to-cyber-600 flex items-center justify-center text-white shadow-lg">
                <FaTerminal className="text-3xl" />
            </div>
        </motion.div>

        <FadeIn delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-400 to-cyber-600 bg-clip-text text-transparent">
                Code Repository
            </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
            <div className="flex items-center justify-center mb-2">
                <div className="h-px bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent w-24 sm:w-48" />
                <FaNetworkWired className="mx-4 text-cyber-500" />
                <div className="h-px bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent w-24 sm:w-48" />
            </div>
        </FadeIn>

        <FadeIn delay={0.4}>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-code">
                <span className="text-cyber-500">&lt;</span>
                Browse through my digital creations and open-source contributions
                <span className="text-cyber-500">/&gt;</span>
            </p>
        </FadeIn>
    </div>
);

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    languageFilter: string;
    setLanguageFilter: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    languages: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    setSearchTerm,
    languageFilter,
    setLanguageFilter,
    sortBy,
    setSortBy,
    languages,
}) => {
    const languageOptions = useMemo(
        () => languages.map((lang) => ({ value: lang || 'null', label: lang || 'No Language' })),
        [languages]
    );

    return (
        <FadeIn delay={0.5}>
            <div className="mb-12 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid gap-6 md:grid-cols-12">
                    <div className="md:col-span-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-code">
                            // search
                        </label>
                        <SearchInput
                            placeholder="Find repository..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClear={() => setSearchTerm('')}
                            className="focus:ring-cyber-500 focus:border-cyber-500"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-code">
                            // language
                        </label>
                        <Select
                            options={languageOptions}
                            value={languageFilter}
                            onChange={setLanguageFilter}
                            placeholder="All Languages"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-code">
                            // sort_by
                        </label>
                        <Select options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

interface RepoCardProps {
    repo: Repo;
    index: number;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, index }) => {
    const languageColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? '#888' : undefined;

    return (
        <StaggerItem index={index}>
            <Card
                className="h-full group transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:ring-cyber-500 dark:hover:ring-offset-gray-900"
                variant="glass"
            >
                {repo.language && (
                    <div className="h-1.5 w-full" style={{ backgroundColor: languageColor }} />
                )}

                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1">
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cyber-500 transition-colors flex items-center group/link"
                            >
                                <GoRepo className="mr-2 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover/link:text-cyber-500" />
                                <span className="truncate">{repo.name}</span>
                            </a>
                        </h3>
                        <div className="flex space-x-3 ml-2">
                            {(repo.stargazers_count ?? 0) > 0 && (
                                <span className="flex items-center text-amber-500 dark:text-amber-400 text-sm">
                                    <GoStar className="mr-1" />
                                    {repo.stargazers_count}
                                </span>
                            )}
                            {(repo.forks_count ?? 0) > 0 && (
                                <span className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <GoRepoForked className="mr-1" />
                                    {repo.forks_count}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2 min-h-[40px]">
                        {repo.description || 'No description provided'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics?.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        {repo.language ? (
                            <div className="flex items-center">
                                <span
                                    className="w-3 h-3 rounded-full mr-1.5"
                                    style={{ backgroundColor: languageColor }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {repo.language}
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">No language detected</span>
                        )}

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-code text-cyber-500">last_push:</span>{' '}
                            {formatDate(repo.updated_at)}
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="bg-gray-50/80 dark:bg-gray-700/80 px-6 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-code text-cyber-500">init:</span>{' '}
                        {formatDate(repo.created_at)}
                    </div>

                    <div className="flex space-x-3">
                        <motion.a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-cyber-500 dark:text-gray-300 dark:hover:text-cyber-400 transition-colors"
                            title="View on GitHub"
                            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <GoCode />
                        </motion.a>

                        {repo.homepage && (
                            <motion.a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-cyber-500 dark:text-gray-300 dark:hover:text-cyber-400 transition-colors"
                                title="View deployed site"
                                whileHover={{ scale: 1.2, rotate: [0, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <FaExternalLinkAlt />
                            </motion.a>
                        )}
                    </div>
                </CardFooter>

                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute left-0 top-0 w-2 h-2 border-l-2 border-t-2 border-cyber-500" />
                    <div className="absolute right-0 top-0 w-2 h-2 border-r-2 border-t-2 border-cyber-500" />
                    <div className="absolute left-0 bottom-0 w-2 h-2 border-l-2 border-b-2 border-cyber-500" />
                    <div className="absolute right-0 bottom-0 w-2 h-2 border-r-2 border-b-2 border-cyber-500" />
                </div>
            </Card>
        </StaggerItem>
    );
};

const RepoCount: React.FC<{ count: number }> = ({ count }) => (
    <FadeIn delay={0.6}>
        <div className="mb-6 text-sm font-code text-gray-600 dark:text-gray-400">
            <span className="text-cyber-500">const</span> repos = <span className="text-cyber-500">{'{'}</span>
            count: <span className="text-amber-500">{count}</span>
            <span className="text-cyber-500">{'}'}</span>;
        </div>
    </FadeIn>
);

const NoResults: React.FC = () => (
    <FadeIn delay={0.7}>
        <EmptyState
            icon={<GoRepo className="w-8 h-8" />}
            title="// No repositories found"
            description="Try adjusting your search parameters and try again"
            className="rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
        />
    </FadeIn>
);

const ReposPage: React.FC<ReposPageProps> = ({ info }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [languageFilter, setLanguageFilter] = useState('All');
    const [sortBy, setSortBy] = useState('updated');

    const repos = info?.repos ?? [];

    const languages = useMemo(
        () => ['All', ...new Set(repos.map((repo) => repo.language).filter(Boolean) as string[])],
        [repos]
    );

    const filteredRepos = useMemo(
        () => sortRepos(filterRepos(repos, searchTerm, languageFilter), sortBy),
        [repos, searchTerm, languageFilter, sortBy]
    );

    const handleSearchChange = useCallback((value: string) => setSearchTerm(value), []);
    const handleLanguageChange = useCallback((value: string) => setLanguageFilter(value), []);
    const handleSortChange = useCallback((value: string) => setSortBy(value), []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5 dark:opacity-15 z-0" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {TECH_SYMBOLS.map((symbol, i) => (
                    <FloatingSymbol key={i} symbol={symbol} index={i} />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <PageHeader />

                <div className="absolute right-0 top-10 opacity-60 hidden lg:block">
                    <FadeIn delay={1}>
                        <div className="w-40 h-40">
                            <Cube color="#38bff8" wireframe={true} />
                        </div>
                    </FadeIn>
                </div>

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchChange}
                    languageFilter={languageFilter}
                    setLanguageFilter={handleLanguageChange}
                    sortBy={sortBy}
                    setSortBy={handleSortChange}
                    languages={languages}
                />

                <RepoCount count={filteredRepos.length} />

                <AnimatePresence mode="wait">
                    {filteredRepos.length === 0 ? (
                        <NoResults key="empty" />
                    ) : (
                        <StaggerContainer key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRepos.map((repo, index) => (
                                <RepoCard key={repo.id ?? repo.name} repo={repo} index={index} />
                            ))}
                        </StaggerContainer>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReposPage;
