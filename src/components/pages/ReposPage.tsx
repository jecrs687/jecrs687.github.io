import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoRepo, GoStar, GoRepoForked, GoCode } from 'react-icons/go';
import { FaExternalLinkAlt, FaTerminal, FaNetworkWired, FaVirus } from 'react-icons/fa';
import Cube from '../3d/Cube'; // This will be our animated 3D component

interface Repo {
  [x: string]: any;
  full_name: string;
  html_url: string;
  name: string;
  description: string;
  language: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  homepage: string | null;
  stargazers_count?: number;
  forks_count?: number;
}

interface ReposPageProps {
  info: {
    repos: Repo[];
  };
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const ReposPage = ({ info }: ReposPageProps) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [sortBy, setSortBy] = useState('updated');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (info?.repos?.length) {
      setRepos(info.repos);
      setFilteredRepos(info.repos);
    }
  }, [info]);

  useEffect(() => {
    let results = [...repos];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply language filter
    if (languageFilter !== 'All') {
      results = results.filter(repo => repo.language === languageFilter);
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
    
    setFilteredRepos(results);
  }, [repos, searchTerm, languageFilter, sortBy]);

  // Get unique languages from repos
  const languages = ['All', ...new Set(repos.map(repo => repo.language).filter(Boolean))];

  // Language colors
  const languageColors: Record<string, string> = {
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
    // Add more languages as needed
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Generate tech pattern symbols for backgrounds
  const techPatternSymbols = ['0', '1', '{', '}', '<', '>', '/', '*', '#', '='];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background grid pattern - cyber theme */}
      <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5 dark:opacity-15 z-0"></div>
      
      {/* Floating tech symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {techPatternSymbols.map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-cyber-500/10 dark:text-cyber-400/10 select-none"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: 0.1 + (Math.random() * 0.2),
              scale: 0.5 + (Math.random() * 2),
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: ['0%', '100%'],
              rotate: [0, 360],
              opacity: [0.1 + (Math.random() * 0.2), 0.05]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15 + (Math.random() * 15),
              ease: "linear"
            }}
            style={{ 
              fontSize: `${2 + (Math.random() * 5)}rem`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-block mb-4"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-cyber-400 to-cyber-600 flex items-center justify-center text-white shadow-lg">
              <FaTerminal className="text-3xl" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-400 to-cyber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Code Repository
          </motion.h1>
          
          <motion.div
            className="flex items-center justify-center mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent w-24 sm:w-48"></div>
            <FaNetworkWired className="mx-4 text-cyber-500" />
            <div className="h-px bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent w-24 sm:w-48"></div>
          </motion.div>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-cyber-500">&lt;</span>
            Browse through my digital creations and open-source contributions
            <span className="text-cyber-500">/&gt;</span>
          </motion.p>
        </div>

        {/* 3D cube element */}
        <div className="absolute right-0 top-10 opacity-60 hidden lg:block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-40 h-40">
              <Cube color="#38bff8" wireframe={true} />
            </div>
          </motion.div>
        </div>

        {/* Filters and search */}
        <motion.div 
          className="mb-12 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-code">
                // search
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Find repository..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyber-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <motion.div
                    animate={{ 
                      rotate: searchTerm ? [0, 360] : 0
                    }}
                    transition={{ 
                      duration: 0.5, 
                      ease: "easeInOut"
                    }}
                  >
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-code">
                // language
              </label>
              <select
                id="language"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyber-500 focus:border-transparent transition-all"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang || 'null'} value={lang || 'null'}>
                    {lang || 'No Language'}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="sortby" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-code">
                // sort_by
              </label>
              <select
                id="sortby"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyber-500 focus:border-transparent transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">Recently Updated</option>
                <option value="created">Recently Created</option>
                <option value="stars">Most Stars</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Repository count */}
        <motion.div
          className="mb-6 text-sm font-code text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="text-cyber-500">const</span> repos = <span className="text-cyber-500">&#123;</span> 
          count: <span className="text-amber-500">{filteredRepos.length}</span> 
          <span className="text-cyber-500">&#125;;</span>
        </motion.div>

        {/* Repository grid */}
        {filteredRepos.length === 0 ? (
          <motion.div 
            className="text-center py-20 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
              className="mb-6"
            >
              <FaVirus className="inline-block text-6xl text-cyber-400 dark:text-cyber-500" />
            </motion.div>
            <motion.h3 
              className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 font-code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="text-cyber-500">404</span> // No repositories found
            </motion.h3>
            <motion.p 
              className="text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Try adjusting your search parameters and try again
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id || index}
                variants={item}
                onHoverStart={() => setHoverIndex(index)}
                onHoverEnd={() => setHoverIndex(null)}
                className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group transition-all duration-300 shadow-md hover:shadow-xl ${hoverIndex === index ? 'ring-2 ring-offset-2 ring-cyber-500 dark:ring-offset-gray-900' : ''}`}
              >
                {/* Repository language color bar */}
                {repo.language && (
                  <div 
                    className={`h-1.5 w-full bg-opacity-90 dark:bg-opacity-70`} 
                    style={{ backgroundColor: languageColors[repo.language] || '#888' }}
                  ></div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-cyber-500 transition-colors flex items-center group"
                      >
                        <GoRepo className="mr-2 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-cyber-500" />
                        <span className="truncate">{repo.name}</span>
                      </a>
                    </h3>
                    <div className="flex space-x-3">
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
                    {repo.description || "No description provided"}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.topics && repo.topics.slice(0, 3).map((topic: string) => (
                      <span 
                        key={topic} 
                        className="px-2 py-1 rounded-full bg-cyber-100 dark:bg-cyber-900/30 text-cyber-700 dark:text-cyber-400 text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    {repo.language ? (
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-1.5" 
                          style={{ backgroundColor: languageColors[repo.language] || '#888' }}
                        ></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{repo.language}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">No language detected</span>
                    )}
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-code text-cyber-500">last_push:</span> {formatDate(repo.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-700/80 px-6 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-code text-cyber-500">init:</span> {formatDate(repo.created_at)}
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.a 
                      href={repo.html_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-cyber-500 dark:text-gray-300 dark:hover:text-cyber-400 transition-colors"
                      title="View on GitHub"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
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
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, 10, -10, 10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <FaExternalLinkAlt />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Hover effect - tech circuit lines */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute left-0 top-0 w-2 h-2 border-l-2 border-t-2 border-cyber-500"></div>
                  <div className="absolute right-0 top-0 w-2 h-2 border-r-2 border-t-2 border-cyber-500"></div>
                  <div className="absolute left-0 bottom-0 w-2 h-2 border-l-2 border-b-2 border-cyber-500"></div>
                  <div className="absolute right-0 bottom-0 w-2 h-2 border-r-2 border-b-2 border-cyber-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReposPage;
