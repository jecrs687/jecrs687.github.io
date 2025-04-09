import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaCode, FaLightbulb, FaBook, FaPalette, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { useScene } from '../../contexts/SceneContext';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentScene, setCurrentScene } = useScene();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Update current scene based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentScene('home');
    if (path === '/repositories') setCurrentScene('cyber');
    if (path === '/skills') setCurrentScene('dojo');
    if (path === '/articles') setCurrentScene('library');
    if (path === '/projects') setCurrentScene('studio');
  }, [location.pathname, setCurrentScene]);
  
  const navItems = [
    { path: '/', name: 'Home', icon: FaHome, scene: 'home', description: 'Welcome screen' },
    { path: '/repositories', name: 'Code', icon: FaCode, scene: 'cyber', description: 'My GitHub projects' },
    { path: '/skills', name: 'Skills', icon: FaLightbulb, scene: 'dojo', description: 'My tech expertise' },
    { path: '/articles', name: 'Articles', icon: FaBook, scene: 'library', description: 'My blog posts' },
    { path: '/projects', name: 'Projects', icon: FaPalette, scene: 'studio', description: 'Featured work' },
  ];

  // Generate scene-specific styling
  const getSceneStyles = (scene: string) => {
    switch(scene) {
      case 'home':
        return {
          accent: 'sakura',
          iconClass: 'text-sakura-500',
          activeClass: 'bg-sakura-100 dark:bg-sakura-900/20 border-sakura-500 text-sakura-600 dark:text-sakura-400 shadow-neon-sakura',
          hoverClass: 'hover:bg-sakura-50 dark:hover:bg-sakura-900/10 hover:text-sakura-600 dark:hover:text-sakura-400 hover:shadow-neon-sakura'
        };
      case 'cyber':
        return {
          accent: 'cyber',
          iconClass: 'text-cyber-500',
          activeClass: 'bg-cyber-100 dark:bg-cyber-900/20 border-cyber-500 text-cyber-600 dark:text-cyber-400 shadow-neon-cyber',
          hoverClass: 'hover:bg-cyber-50 dark:hover:bg-cyber-900/10 hover:text-cyber-600 dark:hover:text-cyber-400 hover:shadow-neon-cyber'
        };
      case 'dojo':
        return {
          accent: 'matcha',
          iconClass: 'text-matcha-500',
          activeClass: 'bg-matcha-100 dark:bg-matcha-900/20 border-matcha-500 text-matcha-600 dark:text-matcha-400 shadow-neon-matcha',
          hoverClass: 'hover:bg-matcha-50 dark:hover:bg-matcha-900/10 hover:text-matcha-600 dark:hover:text-matcha-400 hover:shadow-neon-matcha'
        };
      case 'library':
        return {
          accent: 'fuji',
          iconClass: 'text-fuji-500',
          activeClass: 'bg-fuji-100 dark:bg-fuji-900/20 border-fuji-500 text-fuji-600 dark:text-fuji-400 shadow-neon-fuji',
          hoverClass: 'hover:bg-fuji-50 dark:hover:bg-fuji-900/10 hover:text-fuji-600 dark:hover:text-fuji-400 hover:shadow-neon-fuji'
        };
      case 'studio':
        return {
          accent: 'primary',
          iconClass: 'text-primary-500',
          activeClass: 'bg-primary-100 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400 shadow-neon-sakura',
          hoverClass: 'hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-neon-sakura'
        };
      default:
        return {
          accent: 'sakura',
          iconClass: 'text-sakura-500',
          activeClass: 'bg-sakura-100 dark:bg-sakura-900/20 border-sakura-500 text-sakura-600 dark:text-sakura-400 shadow-neon-sakura',
          hoverClass: 'hover:bg-sakura-50 dark:hover:bg-sakura-900/10 hover:text-sakura-600 dark:hover:text-sakura-400 hover:shadow-neon-sakura'
        };
    }
  };

  const currentStyles = getSceneStyles(currentScene);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: '18rem' },
    collapsed: { width: '5.5rem' }
  };

  const navItemVariants = {
    expanded: { x: 0, opacity: 1, display: 'block' },
    collapsed: { x: -20, opacity: 0, transitionEnd: { display: 'none' } }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        y: { stiffness: 1000 }
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    }
  };

  return (
    <>
      {/* Mobile navigation */}
      <div className="lg:hidden">
        {/* Mobile menu button */}
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)} 
          className={`fixed top-4 right-4 z-50 p-2 rounded-full shadow-lg ${
            showMobileMenu 
              ? `bg-gradient-to-r from-${currentStyles.accent}-500 to-${currentStyles.accent}-600 text-white` 
              : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white'
          }`}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={showMobileMenu ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            {showMobileMenu ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.div>
        </button>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              className="fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              {/* Animated background elements for visual interest */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-full bg-${currentStyles.accent}-500/5 dark:bg-${currentStyles.accent}-500/10`}></div>
                <motion.div 
                  className={`absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br from-${currentStyles.accent}-400/30 to-${currentStyles.accent}-600/30 blur-3xl`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.div 
                  className={`absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-tr from-${currentStyles.accent}-600/30 to-${currentStyles.accent}-400/30 blur-3xl`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -90],
                    opacity: [0.3, 0.4, 0.3]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </div>

              {/* Menu content */}
              <div className="p-8 w-full max-w-md z-10">
                <div className="text-center mb-8">
                  <motion.div 
                    className="inline-block mb-2"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <div className={`w-16 h-16 rounded-anime bg-gradient-to-br from-${currentStyles.accent}-400 to-${currentStyles.accent}-600 shadow-${currentStyles.accent === 'matcha' ? 'neon-matcha' : currentStyles.accent === 'cyber' ? 'neon-cyber' : currentStyles.accent === 'fuji' ? 'neon-fuji' : 'neon-sakura'} mx-auto flex items-center justify-center text-white font-bold text-xl font-anime`}>
                      EC
                    </div>
                  </motion.div>
                  <motion.h2 
                    className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-jp"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    ジェームズ エマヌエル
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-400 font-kr mt-1"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Emanuel Cascone
                  </motion.p>
                </div>
                
                <nav>
                  <ul className="space-y-3">
                    {navItems.map((item, index) => {
                      const isActive = location.pathname === item.path;
                      const itemStyles = getSceneStyles(item.scene);
                      
                      return (
                        <motion.li
                          key={item.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (index * 0.1) }}
                        >
                          <NavLink
                            to={item.path}
                            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                              isActive 
                                ? `${itemStyles.activeClass} border-l-4`
                                : `text-gray-700 dark:text-gray-300 ${itemStyles.hoverClass} border-l-4 border-transparent`
                            }`}
                          >
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                              isActive 
                                ? `bg-${item.scene === 'dojo' ? 'matcha' : item.scene === 'cyber' ? 'cyber' : item.scene === 'library' ? 'fuji' : item.scene === 'studio' ? 'primary' : 'sakura'}-100 dark:bg-${item.scene === 'dojo' ? 'matcha' : item.scene === 'cyber' ? 'cyber' : item.scene === 'library' ? 'fuji' : item.scene === 'studio' ? 'primary' : 'sakura'}-900/30`
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                            >
                              <item.icon className={`text-xl ${isActive ? itemStyles.iconClass : ''}`} />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium font-anime">{item.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                            </div>
                          </NavLink>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
                
                <motion.div 
                  className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-600 hover:from-amber-400/30 hover:to-amber-500/30' 
                        : 'bg-gradient-to-r from-indigo-400/20 to-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:from-indigo-400/30 hover:to-indigo-500/30'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-amber-400/30' : 'bg-indigo-400/30'}`}>
                      {theme === 'dark' ? <FaSun className="text-amber-500" /> : <FaMoon className="text-indigo-500" />}
                    </div>
                    <span className="ml-2 font-medium">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bottom tab navigation */}
        <motion.nav 
          className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg z-10"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="grid grid-cols-5 h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const itemStyles = getSceneStyles(item.scene);
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center ${
                      isActive ? itemStyles.iconClass : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? `bg-${item.scene === 'dojo' ? 'matcha' : item.scene === 'cyber' ? 'cyber' : item.scene === 'library' ? 'fuji' : item.scene === 'studio' ? 'primary' : 'sakura'}-100 dark:bg-${item.scene === 'dojo' ? 'matcha' : item.scene === 'cyber' ? 'cyber' : item.scene === 'library' ? 'fuji' : item.scene === 'studio' ? 'primary' : 'sakura'}-900/40`
                        : 'bg-transparent'
                    }`}>
                      <item.icon className="text-lg" />
                    </div>
                    <span className={`text-xs mt-1 font-medium ${
                      isActive ? itemStyles.iconClass : ''
                    }`}>{item.name}</span>
                    
                    {isActive && (
                      <motion.div 
                        className={`h-1 w-6 bg-${item.scene === 'dojo' ? 'matcha' : item.scene === 'cyber' ? 'cyber' : item.scene === 'library' ? 'fuji' : item.scene === 'studio' ? 'primary' : 'sakura'}-500 rounded-full mt-1`}
                        layoutId="tabIndicator"
                      />
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </motion.nav>
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg z-50 overflow-hidden border-r border-gray-200 dark:border-gray-700"
        variants={sidebarVariants}
        animate={expanded ? 'expanded' : 'collapsed'}
        initial="collapsed"
        transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex items-center justify-center py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-sakura-400 to-cyber-500 shadow-lg animate-breathing">
            <span className="font-bold text-white">EC</span>
          </div>
          <motion.span
            className="font-bold text-lg ml-4 text-gray-800 dark:text-white font-heading"
            variants={navItemVariants}
            initial="collapsed"
            animate={expanded ? 'expanded' : 'collapsed'}
            transition={{ duration: 0.2 }}
          >
            Emanuel
          </motion.span>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const itemStyles = getSceneStyles(item.scene);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center py-3 px-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? `${itemStyles.activeClass} border-l-4`
                    : `text-gray-600 dark:text-gray-400 border-l-4 border-transparent ${itemStyles.hoverClass}`
                }`}
              >
                <motion.div 
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${isActive ? itemStyles.iconClass : ''}`}
                  whileHover={{ rotate: isActive ? 0 : 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon className="text-xl" />
                </motion.div>
                <motion.div
                  className="ml-3 overflow-hidden"
                  variants={navItemVariants}
                  initial="collapsed"
                  animate={expanded ? 'expanded' : 'collapsed'}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-medium whitespace-nowrap">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.description}</div>
                </motion.div>
              </NavLink>
            );
          })}
        </div>

        <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center py-3 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-gray-600 dark:text-gray-400"
          >
            <motion.div 
              className="w-8 h-8 flex items-center justify-center rounded-md"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-400" />}
            </motion.div>
            <motion.span
              className="ml-3 font-medium whitespace-nowrap"
              variants={navItemVariants}
              initial="collapsed"
              animate={expanded ? 'expanded' : 'collapsed'}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Navbar;
