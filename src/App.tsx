/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getGithub, getDevTo } from './services/api';
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/common/LoadingScreen';
import data from './information.json';

// Theme provider context
import { ThemeProvider } from './contexts/ThemeContext';
import { SceneProvider } from './contexts/SceneContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./components/pages/Home'));
const ReposPage = lazy(() => import('./components/pages/ReposPage'));
const SkillsPage = lazy(() => import('./components/pages/SkillsPage'));
const ArticlesPage = lazy(() => import('./components/pages/ArticlesPage'));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage'));
const InstagramLinkPage = lazy(() => import('./components/pages/InstagramLinkPage'));

// Page transitions - enhanced with smoother animations
const pageVariants = {
  initial: {
    opacity: 0,
    y: -10,
    x: -10,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 10,
    x: 10,
    scale: 0.98,
  }
};

const pageTransition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  duration: 0.4
};

// Detect if device is mobile
const isMobileDevice = () => {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia('(max-width: 768px)').matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const [info, setInfo] = useState(data);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile on mount
    setIsMobile(isMobileDevice());

    // Add resize listener to update mobile state
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const github = await getGithub() as any;

        const updatedInfo = {
          ...info,
          nick: github.login,
          name: github.name,
          avatar_url: github.avatar_url,
          repos: github.repos
        };

        setInfo(updatedInfo);

        const devTo = await getDevTo();
        setInfo(prevInfo => ({ ...prevInfo, ...devTo }));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    if (data.githubUser !== '') {
      loadData();
    }
  }, []);

  // If mobile and on homepage, redirect to Instagram
  if (isMobile && location.pathname === '/') {
    return <Navigate to="/instagram" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="scene-wrapper scene-home"
            >
              <Home />
            </motion.div>
          } />
          <Route path="/repositories" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="scene-wrapper scene-cyber"
            >
              <ReposPage info={info} />
            </motion.div>
          } />
          <Route path="/skills" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="scene-wrapper scene-dojo"
            >
              <SkillsPage data={info} />
            </motion.div>
          } />
          <Route path="/articles" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="scene-wrapper scene-library"
            >
              <ArticlesPage data={info as any} />
            </motion.div>
          } />
          <Route path="/projects" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="scene-wrapper scene-studio"
            >
              <ProjectsPage data={info} />
            </motion.div>
          } />
          <Route path="/instagram" element={
            <InstagramLinkPage />
          } />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  const location = useLocation();
  const isInstagramPage = location.pathname === '/instagram';

  return (
    <ThemeProvider>
      <SceneProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/10 to-gray-100 dark:from-gray-900 dark:via-indigo-900/5 dark:to-gray-800 transition-colors duration-500">
          {!isInstagramPage && (
            <div className="fixed top-0 left-0 right-0 z-50 w-[250px]">
              <Navbar />
            </div>
          )}
          <main className={!isInstagramPage ? "flex-grow pt-16 lg:pt-16 lg:pl-20" : "flex-grow"}>
            <AnimatedRoutes />
          </main>
          {!isInstagramPage && (
            <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-jp mr-1">作成者</span>
                      Designed with <span className="text-sakura-500">♥</span> by <a href="https://github.com/jecrs687" className="font-medium text-sakura-600 hover:text-sakura-700 dark:text-sakura-400 dark:hover:text-sakura-300 transition-colors">Emma (Leli)</a> © {new Date().getFullYear()}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <a href="https://github.com/jecrs687" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                      <span className="sr-only">GitHub</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/jecrs687/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/jecrs687/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                      <span className="sr-only">Instagram</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="mailto:emanuelcascone@gmail.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                      <span className="sr-only">Email</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </SceneProvider>
    </ThemeProvider>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
