import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaArrowDown } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import totoro from '../../assets/totoro-transparent.gif';
import backgroundJapan from '../../assets/background.jpg';

// 3D components
import HeroBackground from '../3d/HeroBackground';

const Home = () => {
  const { theme } = useTheme();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);



  // React Spring animation for floating Totoro
  const { y } = useSpring({
    from: { y: 0 },
    to: { y: -20 },
    config: {
      duration: 2000,
      mass: 1,
      tension: 120,
      friction: 14,
    },
    loop: { reverse: true },
  });

  // Typed text animation
  const [text, setText] = useState("");
  const fullText = "Full Stack Developer • Tech Enthusiast • Anime Lover";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  // Section variants for animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 3D animated background */}
        <div className="absolute inset-0 -z-10">
          <HeroBackground theme={theme} />
        </div>
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white dark:via-gray-900/40 dark:to-gray-900 -z-10"
          style={{ 
            backgroundSize: '400% 400%',
            animation: 'gradient-y 15s ease infinite'
          }}
        ></div>

        {/* Animated sakura petals (pseudo elements in CSS) */}
        <div className="sakura-petals"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            {/* Japanese/Korean name styled text */}
            <motion.h2 
              className="text-lg md:text-xl text-sakura-600 dark:text-sakura-400 font-jp mb-2 tracking-widest"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              エマヌエル カスコーネ
            </motion.h2>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Emanuel Cascone
            </motion.h1>

            <motion.div
              className="h-8 text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {text}
              <span className="inline-block w-0.5 h-5 bg-sakura-500 ml-1 animate-pulse"></span>
            </motion.div>

            <div className="flex justify-center space-x-5 mb-10">
              <motion.a 
                href="https://github.com/jecrs687" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-sakura-100 hover:text-sakura-600 dark:hover:bg-sakura-900/30 dark:hover:text-sakura-400 transition-all duration-300 transform hover:scale-110"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <FaGithub className="text-xl" />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/jecrs687/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-cyber-100 hover:text-cyber-600 dark:hover:bg-cyber-900/30 dark:hover:text-cyber-400 transition-all duration-300 transform hover:scale-110"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/jecrs687/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-fuji-100 hover:text-fuji-600 dark:hover:bg-fuji-900/30 dark:hover:text-fuji-400 transition-all duration-300 transform hover:scale-110"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <FaInstagram className="text-xl" />
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              <Link
                to="/projects"
                className="px-8 py-3 rounded-full bg-sakura-500 hover:bg-sakura-600 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View My Projects
              </Link>
              
              <Link
                to="/skills"
                className="px-8 py-3 rounded-full bg-transparent border-2 border-gray-300 dark:border-gray-700 hover:border-sakura-500 dark:hover:border-sakura-500 text-gray-800 dark:text-gray-200 font-medium transition-all duration-300 transform hover:scale-105"
              >
                Explore My Skills
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Totoro */}
        <div className="absolute right-8 sm:right-20 bottom-44 sm:bottom-24 h-24 md:h-40 z-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <animated.div style={{ transform: y.to(value => `translateY(${value}px)`) }}>
            <img src={totoro} alt="Totoro" className="h-full object-contain" />
          </animated.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center text-gray-600 dark:text-gray-400"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 font-light">Scroll to discover</span>
            <FaArrowDown />
          </div>
        </motion.div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/90 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5 dark:opacity-20 -z-10"></div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-heading text-gray-900 dark:text-white">
              About <span className="text-sakura-500">Me</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    Hi there! I'm <span className="font-medium text-sakura-600 dark:text-sakura-400">Emanuel Cascone</span>, a passionate full stack developer and tech enthusiast with a love for building creative digital experiences.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    When I'm not coding, you'll find me exploring the worlds of anime, reading interesting books, enjoying K-dramas, or immersing myself in J-pop and K-pop music.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    I believe in crafting solutions that blend functionality with delightful user experiences, taking inspiration from both Eastern and Western design philosophies.
                  </p>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200">My Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Programming', 'Anime', 'Books', 'K-drama', 'J-pop', 'K-pop', 'Tech', 'Music'].map((tag, index) => (
                      <motion.span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img 
                  src={backgroundJapan} 
                  alt="Emanuel Cascone" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section - Quick Links */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
              Explore <span className="text-cyber-500">My World</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover different aspects of my professional journey and creative endeavors
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Code", description: "Check out my GitHub repositories and coding projects", color: "cyber", link: "/repositories", delay: 0 },
              { title: "Skills", description: "Explore my technical skills and expertise", color: "matcha", link: "/skills", delay: 0.1 },
              { title: "Articles", description: "Read my thoughts and tutorials on tech", color: "fuji", link: "/articles", delay: 0.2 },
              { title: "Projects", description: "See my featured and highlighted work", color: "sakura", link: "/projects", delay: 0.3 },
            ].map((item) => (
              <motion.div
                key={item.title}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 group`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.5 }}
              >
                <Link to={item.link} className="block h-full">
                  <div className={`h-2 bg-${item.color}-500 group-hover:h-3 transition-all duration-300`}></div>
                  <div className="p-6">
                    <h3 className={`text-xl font-bold text-${item.color}-600 dark:text-${item.color}-400 mb-2`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {item.description}
                    </p>
                    <div className={`text-${item.color}-500 font-medium text-sm flex items-center mt-auto`}>
                      Explore
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS for animated sakura petals */}
      <style>{`
        @keyframes fall {
          0% {
            opacity: 1;
            top: -10%;
            transform: translateX(0) rotateZ(0deg);
          }
          100% {
            opacity: 0.7;
            top: 90%;
            transform: translateX(100px) rotateZ(360deg);
          }
        }
        
        .sakura-petals {
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
          top: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }
        
        .sakura-petals::after,
        .sakura-petals::before {
          content: "";
          position: absolute;
          display: block;
          width: 10px;
          height: 10px;
          background-color: #ffb7c5;
          border-radius: 150% 0 150% 0;
          animation: fall 10s linear infinite;
          transform-origin: center;
        }

        .sakura-petals::after {
          top: -10%;
          left: 30%;
          animation-delay: 3.5s;
          animation-duration: 11s;
        }

        .sakura-petals::before {
          top: -10%;
          left: 70%;
          opacity: 0.9;
          animation-delay: 2s;
          animation-duration: 9s;
        }
      `}</style>
    </div>
  );
};

export default Home;