import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaTag, FaBookOpen, FaTimes } from 'react-icons/fa';
import { useScene } from '@/contexts/SceneContext';
import { SearchInput, Select, Badge, Button, Card, CardContent } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animation';
import { formatDate } from '@/lib';

interface Article {
    url: string;
    social_image: string;
    title: string;
    description: string;
    tags?: string;
    published_at: string;
}

export interface ArticlesData {
    devToArticles?: Article[];
}

interface ArticlesPageProps {
    data: ArticlesData;
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
];

const extractTags = (articles: Article[]): string[] =>
    [...new Set(articles.flatMap((article) => article.tags?.split(', ') ?? []).filter(Boolean))];

const filterArticles = (
    articles: Article[],
    searchTerm: string,
    selectedTag: string,
    sortOrder: string
): Article[] => {
    const filtered = articles.filter((article) => {
        const matchesSearch =
            !searchTerm ||
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !selectedTag || article.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    return [...filtered].sort((a, b) => {
        const dateA = new Date(a.published_at).getTime();
        const dateB = new Date(b.published_at).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
};

const PageHeader: React.FC = () => (
    <div className="text-center mb-16">
        <motion.div
            className="mb-6 inline-block"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-fuji-400 to-fuji-600 shadow-neon-fuji flex items-center justify-center text-white transform rotate-12">
                <FaBookOpen className="text-3xl" />
            </div>
        </motion.div>

        <FadeIn>
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-fuji-600 to-fuji-400 bg-clip-text text-transparent font-heading">
                Library of Knowledge
            </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
            <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-fuji-500/50 to-transparent w-24 sm:w-48" />
                <FaBookOpen className="mx-4 text-fuji-500" />
                <div className="h-px bg-gradient-to-r from-transparent via-fuji-500/50 to-transparent w-24 sm:w-48" />
            </div>
        </FadeIn>

        <FadeIn delay={0.3}>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Thoughts, tutorials, and insights on technology and development
            </p>
        </FadeIn>
    </div>
);

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedTag: string;
    setSelectedTag: (value: string) => void;
    sortOrder: string;
    setSortOrder: (value: string) => void;
    tags: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    sortOrder,
    setSortOrder,
    tags,
}) => {
    const tagOptions = useMemo(
        () => [{ value: '', label: 'All Topics' }, ...tags.map((tag) => ({ value: tag, label: tag }))],
        [tags]
    );

    const hasActiveFilters = searchTerm || selectedTag;

    return (
        <FadeIn delay={0.4}>
            <div className="mb-12 max-w-3xl mx-auto rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <SearchInput
                                placeholder="Search for knowledge..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClear={() => setSearchTerm('')}
                                className="focus:ring-fuji-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Select
                                options={tagOptions}
                                value={selectedTag}
                                onChange={setSelectedTag}
                                placeholder="All Topics"
                                className="min-w-[150px]"
                            />

                            <Select
                                options={SORT_OPTIONS}
                                value={sortOrder}
                                onChange={setSortOrder}
                                className="min-w-[140px]"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {hasActiveFilters && (
                            <motion.div
                                className="mt-4 flex flex-wrap gap-2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {selectedTag && (
                                    <Badge variant="secondary" className="inline-flex items-center gap-1">
                                        Topic: {selectedTag}
                                        <button
                                            onClick={() => setSelectedTag('')}
                                            className="ml-1 hover:bg-fuji-200 dark:hover:bg-fuji-800 rounded-full p-0.5"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    </Badge>
                                )}

                                {searchTerm && (
                                    <Badge variant="secondary" className="inline-flex items-center gap-1">
                                        Search: {searchTerm}
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="ml-1 hover:bg-fuji-200 dark:hover:bg-fuji-800 rounded-full p-0.5"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    </Badge>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </FadeIn>
    );
};

interface ArticleCardProps {
    article: Article;
    index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
    const tags = article.tags?.split(', ').filter(Boolean) ?? [];

    return (
        <StaggerItem index={index}>
            <motion.article
                className="h-full"
                whileHover={{
                    y: -8,
                    boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)',
                }}
            >
                <Card className="h-full overflow-hidden" variant="glass">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                        <div className="relative h-48 overflow-hidden group">
                            {article.social_image ? (
                                <>
                                    <img
                                        src={article.social_image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
                                </>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-fuji-500 to-fuji-700 flex items-center justify-center p-6">
                                    <h3 className="text-white text-xl font-bold text-center">{article.title}</h3>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                                <div className="flex items-center text-sm opacity-90">
                                    <FaCalendarAlt className="mr-1" />
                                    <span>{formatDate(article.published_at)}</span>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                                {article.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        <FaTag className="mr-1 h-2 w-2" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <span className="text-fuji-600 dark:text-fuji-400 text-sm font-medium inline-flex items-center">
                                    Read more
                                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </div>
                        </CardContent>
                    </a>
                </Card>
            </motion.article>
        </StaggerItem>
    );
};

interface NoResultsProps {
    onClearFilters: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ onClearFilters }) => (
    <FadeIn delay={0.3}>
        <EmptyState
            icon={<FaBookOpen className="w-8 h-8" />}
            title="No articles found"
            description="Try adjusting your search or filter criteria"
            action={
                <Button variant="default" onClick={onClearFilters}>
                    Clear all filters
                </Button>
            }
            className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        />
    </FadeIn>
);

const ResultsCount: React.FC<{ filtered: number; total: number }> = ({ filtered, total }) => (
    <FadeIn delay={0.6}>
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {filtered} of {total} articles
        </div>
    </FadeIn>
);

const ArticlesPage: React.FC<ArticlesPageProps> = ({ data }) => {
    const { setCurrentScene } = useScene();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        setCurrentScene('library');
    }, [setCurrentScene]);

    const articles = useMemo(() => data.devToArticles ?? [], [data.devToArticles]);
    const tags = useMemo(() => extractTags(articles), [articles]);
    const filteredArticles = useMemo(
        () => filterArticles(articles, searchTerm, selectedTag, sortOrder),
        [articles, searchTerm, selectedTag, sortOrder]
    );

    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedTag('');
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-library-shelves bg-repeat z-0 opacity-20 dark:opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-gray-900 dark:to-gray-900 z-0" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <PageHeader />

                    <FilterBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        tags={tags}
                    />

                    <AnimatePresence mode="wait">
                        {filteredArticles.length === 0 ? (
                            <NoResults key="empty" onClearFilters={handleClearFilters} />
                        ) : (
                            <StaggerContainer
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredArticles.map((article, index) => (
                                    <ArticleCard key={article.url} article={article} index={index} />
                                ))}
                            </StaggerContainer>
                        )}
                    </AnimatePresence>

                    {filteredArticles.length > 0 && (
                        <ResultsCount filtered={filteredArticles.length} total={articles.length} />
                    )}

                    <div className="absolute top-40 -left-20 w-40 h-40 bg-fuji-400/10 dark:bg-fuji-400/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 -right-20 w-60 h-60 bg-fuji-500/10 dark:bg-fuji-500/5 rounded-full blur-3xl" />
                </div>
            </motion.div>
        </div>
    );
};

export default ArticlesPage;
