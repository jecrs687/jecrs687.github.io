import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaTag, FaSearch, FaBookOpen, FaSort, FaTimes } from 'react-icons/fa';
import { useScene } from '../../contexts/SceneContext';

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

const ArticlesPage = ({ data }: { data: ArticlesData }) => {
  const { setCurrentScene } = useScene();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the current scene to library
    setCurrentScene('library');
  }, [setCurrentScene]);

  useEffect(() => {
    if (data.devToArticles && data.devToArticles.length > 0) {
      setArticles(data.devToArticles);
      setFilteredArticles(data.devToArticles);

      // Extract all unique tags
      const tags = data.devToArticles
        .map(article => article.tags?.split(', ') || [])
        .flat()
        .filter((tag, index, self) => tag && self.indexOf(tag) === index);

      setAllTags(tags);
    }
  }, [data]);

  useEffect(() => {
    let result = [...articles];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter(article =>
        article.tags && article.tags.includes(selectedTag)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.published_at).getTime();
      const dateB = new Date(b.published_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredArticles(result);
  }, [searchTerm, selectedTag, articles, sortOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-library-shelves bg-repeat z-0 opacity-20 dark:opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-gray-900 dark:to-gray-900 z-0"></div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-6 inline-block"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-fuji-400 to-fuji-600 shadow-neon-fuji flex items-center justify-center text-white transform rotate-12">
                <FaBookOpen className="text-3xl" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-fuji-600 to-fuji-400 bg-clip-text text-transparent font-heading">
              Library of Knowledge
            </h1>

            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-fuji-500/50 to-transparent w-24 sm:w-48"></div>
              <FaBookOpen className="mx-4 text-fuji-500" />
              <div className="h-px bg-gradient-to-r from-transparent via-fuji-500/50 to-transparent w-24 sm:w-48"></div>
            </motion.div>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights on technology and development
            </p>
          </motion.div>

          {/* Search and filter panel */}
          <motion.div
            className="mb-12 max-w-3xl mx-auto rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ boxShadow: isSearchFocused ? '0 0 0 3px rgba(139, 92, 246, 0.5)' : undefined }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search for knowledge..."
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fuji-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <select
                    className="px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fuji-500 focus:border-transparent min-w-[150px] transition-all"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="">All Topics</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>

                  <button
                    onClick={toggleSortOrder}
                    className="px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-fuji-500 focus:border-transparent flex items-center gap-2 transition-all"
                  >
                    <FaSort className="text-fuji-500" />
                    {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              {(selectedTag || searchTerm) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTag && (
                    <motion.span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuji-100 text-fuji-800 dark:bg-fuji-900/40 dark:text-fuji-200"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <span>Topic: {selectedTag}</span>
                      <button
                        className="ml-1 rounded-full hover:bg-fuji-200 dark:hover:bg-fuji-800 p-1"
                        onClick={() => setSelectedTag('')}
                      >
                        <FaTimes size={10} />
                      </button>
                    </motion.span>
                  )}

                  {searchTerm && (
                    <motion.span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuji-100 text-fuji-800 dark:bg-fuji-900/40 dark:text-fuji-200"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <span>Search: {searchTerm}</span>
                      <button
                        className="ml-1 rounded-full hover:bg-fuji-200 dark:hover:bg-fuji-800 p-1"
                        onClick={handleClearSearch}
                      >
                        <FaTimes size={10} />
                      </button>
                    </motion.span>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Results section */}
          {filteredArticles.length === 0 ? (
            <motion.div
              className="text-center py-20 max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-6"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-fuji-100 dark:bg-fuji-900/30 flex items-center justify-center text-fuji-500">
                  <FaSearch className="text-3xl" />
                </div>
              </motion.div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
                No articles found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedTag(''); }}
                className="px-4 py-2 bg-fuji-500 hover:bg-fuji-600 text-white rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.url || index}
                  className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)'
                  }}
                  layout
                >
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <div className="relative h-48 overflow-hidden group">
                      {article.social_image ? (
                        <>
                          <img
                            src={article.social_image}
                            alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-fuji-500 to-fuji-700 flex items-center justify-center p-6">
                          <h3 className="text-white text-xl font-bold text-center">{article.title}</h3>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                        <div className="flex items-center text-sm mb-1 opacity-90">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                        {article.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags && article.tags.split(', ').map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuji-100 text-fuji-800 dark:bg-fuji-900/40 dark:text-fuji-200"
                          >
                            <FaTag className="mr-1 h-2 w-2" />
                            {tag}
                          </span>
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
                    </div>
                  </a>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* Showing results count */}
          {filteredArticles.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredArticles.length} of {articles.length} articles
            </div>
          )}

          {/* Decorative elements */}
          <div className="absolute top-40 -left-20 w-40 h-40 bg-fuji-400/10 dark:bg-fuji-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 -right-20 w-60 h-60 bg-fuji-500/10 dark:bg-fuji-500/5 rounded-full blur-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArticlesPage;
