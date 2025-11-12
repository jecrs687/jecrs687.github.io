/**
 * Instagram Link Page - Enhanced Mobile-First Bio Page
 * Modern, type-safe implementation with improved animations and design
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram, Globe, BookOpen, Music, Heart, Star, Mic, Guitar, Users, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import info from '../../information.json';

// Custom animated button component
const AnimatedLink = ({
  href,
  icon: Icon,
  text,
  gradient = "from-sakura-500 to-cyber-500",
  iconClass = ""
}: {
  href: string;
  icon: React.ComponentType<any>;
  text: string;
  gradient?: string;
  iconClass?: string;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full sm:w-64 flex items-center p-4 mb-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.97 }}
      viewport={{ once: true }}
    >
      <div className={`mr-4 w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${gradient}`}>
        <Icon className={`text-xl ${iconClass}`} />
      </div>
      <div className="font-medium text-gray-800 dark:text-white">{text}</div>
    </motion.a>
  );
};

interface Project {
  name: string;
  link: string;
}

// Japanese/Korean style decorative component
const AsianDecoration = ({ type }: { type: 'sakura' | 'wave' | 'lantern' | 'torii' }) => {
  const decorations = {
    sakura: (
      <div className="relative">
        <motion.div
          className="w-6 h-6 bg-sakura-200 dark:bg-sakura-900/40 rounded-full relative"
          animate={{
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute w-6 h-6 rotate-[22.5deg] bg-sakura-200 dark:bg-sakura-900/40 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-sakura-400 dark:bg-sakura-600 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    ),
    wave: (
      <motion.svg
        width="40"
        height="20"
        viewBox="0 0 40 20"
        className="text-cyber-400 dark:text-cyber-600"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0.5
        }}
      >
        <motion.path
          d="M0 10 Q5 0, 10 10 Q15 20, 20 10 Q25 0, 30 10 Q35 20, 40 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </motion.svg>
    ),
    lantern: (
      <div className="relative">
        <motion.div
          className="w-3 h-1 bg-amber-500 rounded-full mb-0.5 mx-auto"
          animate={{ y: [-1, 0, -1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="w-6 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-lg relative overflow-hidden"
          animate={{
            boxShadow: ['0 0 8px rgba(239, 68, 68, 0.3)', '0 0 16px rgba(239, 68, 68, 0.6)', '0 0 8px rgba(239, 68, 68, 0.3)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute w-full h-full bg-opacity-10 bg-pattern-japanese"></div>
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-500 rounded-t-lg"></div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500 rounded-b-lg"></div>
        </motion.div>
      </div>
    ),
    torii: (
      <div className="relative my-1">
        <motion.div
          className="w-8 h-6"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-1 bg-red-600 rounded-sm absolute top-0"></div>
          <div className="w-8 h-1 bg-red-600 rounded-sm absolute top-2"></div>
          <div className="w-1 h-6 bg-red-600 rounded-sm absolute left-1"></div>
          <div className="w-1 h-6 bg-red-600 rounded-sm absolute right-1"></div>
        </motion.div>
      </div>
    )
  };

  return decorations[type];
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const gradients = [
    "from-sakura-400 to-sakura-600",
    "from-cyber-400 to-cyber-600",
    "from-matcha-400 to-matcha-600",
    "from-fuji-400 to-fuji-600"
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800/90 rounded-xl overflow-hidden shadow-lg relative mb-4 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
    >
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
          {project.name}
        </h3>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            View Project
          </span>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white`}>
            <FaCode />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

const InstagramLinkPage = () => {
  const [showQuote, setShowQuote] = useState(false);
  const [currentMood, setCurrentMood] = useState(0);

  // Animated Japanese characters
  const japaneseChars = "人生を楽しむ"; // "Enjoy life" in Japanese
  const koreanChars = "함께하자"; // "Let's do it together" in Korean

  // Current mood options - updated to match Emma's interests
  const moods = [
    "Coding mode 💻",
    "Learning Japanese 🇯🇵",
    "Learning Korean 🇰🇷",
    "Music lover 🎵",
    "Reading books 📚",
    "Missing Malta 🇲🇹",
    "Karaoke time 🎤",
    "Anime fan 🌸",
  ];

  // Spring animation for the floating elements
  const floatAnim = useSpring({
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-10px)' },
    config: { mass: 1, tension: 120, friction: 14 },
    loop: { reverse: true },
  });

  useEffect(() => {
    // Auto-scroll to the top when the component mounts
    window.scrollTo(0, 0);

    // Show quote after a delay
    const timer = setTimeout(() => {
      setShowQuote(true);
    }, 1500);

    // Rotate through moods
    const moodInterval = setInterval(() => {
      setCurrentMood((prev) => (prev + 1) % moods.length);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(moodInterval);
    };
  }, []);

  const projects = [
    ...(info.projects.bigProjects || []).slice(0, 3)
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  // Generate animated background elements (sakura petals or particles)
  const generateBackgroundElements = () => {
    const elements = [];

    // Sakura petals
    for (let i = 0; i < 15; i++) {
      elements.push(
        <motion.div
          key={`petal-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20%`,
            filter: 'blur(1px)',
            zIndex: 0
          }}
          animate={{
            top: '120%',
            left: `${Math.random() * 100}%`,
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 10
          }}
        >
          {/* Sakura petal shape */}
          <div className="w-6 h-6 relative opacity-70">
            <div className="absolute inset-0 bg-sakura-300 dark:bg-sakura-500 rounded-full"></div>
            <div className="absolute inset-0 bg-sakura-300 dark:bg-sakura-500 rounded-full rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-sakura-500 dark:bg-sakura-300 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Lanterns
    for (let i = 0; i < 5; i++) {
      elements.push(
        <motion.div
          key={`lantern-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${10 + (i * 20)}%`,
            top: `-40%`,
            zIndex: 0
          }}
          animate={{
            top: ['5%', '15%', '5%'],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.5
          }}
        >
          <div className="opacity-30 dark:opacity-50">
            <AsianDecoration type="lantern" />
          </div>
        </motion.div>
      );
    }

    return elements;
  };

  // Personal interests to display - updated to match Emma's preferences
  const interests = [
    { name: "Music 🎵", icon: FaMusic, color: "from-indigo-500 to-purple-500" },
    { name: "Anime 🌸", icon: FaStar, color: "from-pink-500 to-red-500" },
    { name: "JPop 🎧", icon: FaMusic, color: "from-blue-500 to-pink-500" },
    { name: "KDramas 📺", icon: FaBookmark, color: "from-red-500 to-amber-500" },
    { name: "Guitar 🎸", icon: FaGuitar, color: "from-amber-700 to-amber-900" },
    { name: "Books 📚", icon: FaBookOpen, color: "from-emerald-500 to-teal-700" },
    { name: "Karaoke 🎤", icon: FaMicrophone, color: "from-cyan-500 to-blue-500" },
    { name: "Coding 💻", icon: FaJsSquare, color: "from-yellow-500 to-amber-700" },
    { name: "Friends 👯", icon: FaUserFriends, color: "from-violet-500 to-purple-700" },
    { name: "Malta 🇲🇹", icon: SiMalt, color: "from-red-500 to-white-500" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-pink-50/10 to-indigo-50/10 dark:from-gray-900 dark:via-indigo-900/5 dark:to-pink-900/5">
      {/* Korean wave pattern overlay */}
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6c2 0 3 1 4 2s2 2 4 2 3-1 4-2 2-2 4-2 3 1 4 2 2 2 4 2 3-1 4-2 2-2 4-2 3 1 4 2 2 2 4 2' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 12px'
        }}
        className="absolute inset-0 bg-repeat opacity-5 dark:opacity-10 dark:[background-image:url('data:image/svg+xml,%3Csvg_width=%2740%27_height=%2712%27_viewBox=%270_0_40_12%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath_d=%27M0_6c2_0_3_1_4_2s2_2_4_2_3-1_4-2_2-2_4-2_3_1_4_2_2_2_4_2_3-1_4-2_2-2_4-2_3_1_4_2_2_2_4_2%27_fill=%27%23ffffff%27_fill-opacity=%270.4%27_fill-rule=%27evenodd%27/%3E%3C/svg%3E')]"
      >
      </div>

      {/* Animated background elements */}
      {generateBackgroundElements()}

      {/* Main container */}
      <div className="max-w-md mx-auto px-4 py-16 relative z-10">
        {/* Japanese & Korean characters */}
        <div className="absolute top-10 left-0 w-5 flex flex-col items-center space-y-3">
          {japaneseChars.split('').map((char, i) => (
            <motion.div
              key={`jp-${i}`}
              className="font-jp text-lg text-sakura-600 dark:text-sakura-400 writing-vertical"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={charVariants}
            >
              {char}
            </motion.div>
          ))}
        </div>

        <div className="absolute top-10 right-0 w-5 flex flex-col items-center space-y-3">
          {koreanChars.split('').map((char, i) => (
            <motion.div
              key={`kr-${i}`}
              className="font-kr text-lg text-cyber-600 dark:text-cyber-400 writing-vertical"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={charVariants}
            >
              {char}
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <AsianDecoration type="torii" />
        </div>

        {/* Profile header */}
        <motion.div
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-32 h-32 mx-auto relative mb-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            {/* Decorative circle behind avatar */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-sakura-500 to-fuji-400 animate-spin-slow opacity-30 blur-md"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sakura-500 to-fuji-400 animate-pulse-slow"></div>

            <img
              src="/assets/profile.jpg"
              alt="Emanuel Cascone"
              className="w-full h-full object-cover rounded-full p-1 bg-white dark:bg-gray-900 relative z-10"
            />

            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg z-20"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bg-green-500 w-4 h-4 rounded-full"></div>
            </motion.div>

            {/* Small sakura decoration */}
            <div className="absolute -top-2 -left-2 z-20">
              <AsianDecoration type="sakura" />
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sakura-600 to-cyber-500 text-transparent bg-clip-text mb-2 font-jp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            エマ・レリ
          </motion.h1>

          <motion.h2
            className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 font-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Emma (Leli)
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            @jecrs687
          </motion.p>

          {/* Current mood */}
          <motion.div
            className="absolute -right-2 top-0"
            animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMood}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-l-4 border-sakura-500 transform rotate-3"
              >
                {moods[currentMood]}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="flex justify-center space-x-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href={info.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-sakura-100 hover:text-sakura-500 dark:hover:bg-sakura-900/30 dark:hover:text-sakura-400 transition-all"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub className="text-xl" />
            </motion.a>
            <motion.a
              href={info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-cyber-100 hover:text-cyber-500 dark:hover:bg-cyber-900/30 dark:hover:text-cyber-400 transition-all"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin className="text-xl" />
            </motion.a>
            <motion.a
              href={info.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-fuji-100 hover:text-fuji-500 dark:hover:bg-fuji-900/30 dark:hover:text-fuji-400 transition-all"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram className="text-xl" />
            </motion.a>
            <motion.a
              href={info.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGlobe className="text-xl" />
            </motion.a>
          </motion.div>

          {/* Quote animation */}
          <AnimatePresence>
            {showQuote && (
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {/* Decorative quotation marks */}
                <div className="absolute -top-3 -left-2 text-3xl text-sakura-300 dark:text-sakura-700 font-serif">
                  "
                </div>
                <div className="absolute -bottom-3 -right-2 text-3xl text-sakura-300 dark:text-sakura-700 font-serif">
                  "
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                  <span className="text-sakura-600 dark:text-sakura-400 font-medium">
                    <span className="font-kr mr-1">안녕하세요!</span>
                    <span className="font-jp mr-1">こんにちは!</span>
                  </span> <br />
                  {info.bio}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Japanese/Korean wave decoration */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AsianDecoration type="wave" />
          </motion.div>

          {/* Interests tags - updated with Emma's interests */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                className={`px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center`}
                whileHover={{ scale: 1.05, background: `linear-gradient(90deg, ${interest.color.split(' ')[0].replace('from-', '')} 0%, ${interest.color.split(' ')[1].replace('to-', '')} 100%)`, color: 'white' }}
                whileTap={{ scale: 0.95 }}
                variants={{
                  hidden: { opacity: 0, y: 20, x: index % 2 === 0 ? -20 : 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    transition: { duration: 0.5, delay: 0.7 + (index * 0.1) }
                  }
                }}
              >
                <interest.icon className="mr-1 text-xs" />
                {interest.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Centered Japanese/Korean decoration */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <AsianDecoration type="lantern" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            <AsianDecoration type="sakura" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            <AsianDecoration type="lantern" />
          </div>
        </div>

        {/* Story/About Me section with Asian styling */}
        <motion.div
          className="mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 dark:border-gray-700 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="absolute -top-3 -right-3">
            <AsianDecoration type="sakura" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-kr flex items-center">
            <span className="font-jp text-sakura-600 dark:text-sakura-400 mr-2">物語</span>
            <span className="font-heading">My Story</span>
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
            Living in beautiful Malta, where everyone calls me Leli! Brazilian-Italian by birth, global citizen by heart. ✨
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
            I'm passionate about <span className="text-sakura-600 dark:text-sakura-400 font-medium">music</span> and play the guitar 🎸. You'll often find me at karaoke singing my favorite JPop songs!
          </p>

          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Currently studying <span className="font-jp text-cyber-600 dark:text-cyber-400">日本語</span> and <span className="font-kr text-fuji-600 dark:text-fuji-400">한국어</span> because I love Asian culture, anime, and KDramas. My friends mean the world to me - always loyal! And I adore my sister Aurora. 💫
          </p>
        </motion.div>

        {/* Links section */}
        <motion.div
          className="space-y-4 flex flex-col items-center mb-12 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Floating animated elements */}
          <animated.div
            style={floatAnim}
            className="absolute -left-6 top-40 opacity-50"
          >
            <AsianDecoration type="sakura" />
          </animated.div>

          <animated.div
            style={{
              ...floatAnim,
              transform: floatAnim.transform.to(v => v.replace('-10px', '-5px'))
            }}
            className="absolute -right-10 top-20 opacity-30"
          >
            <AsianDecoration type="torii" />
          </animated.div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-jp flex items-center">
            <span className="mr-2">つながろう</span>
            <span className="font-heading">Connect With Me</span>
          </h2>

          <div className="w-full flex flex-col items-center">
            <AnimatedLink
              href={info.github}
              icon={FaGithub}
              text="My Code on GitHub"
              gradient="from-gray-600 to-gray-900"
            />
            <AnimatedLink
              href={info.linkedin}
              icon={FaLinkedin}
              text="Professional Profile"
              gradient="from-blue-500 to-blue-700"
            />
            <AnimatedLink
              href={info.instagram}
              icon={FaInstagram}
              text="My Instagram Feed"
              gradient="from-pink-500 via-red-500 to-yellow-500"
            />
            <AnimatedLink
              href={info.facebook}
              icon={FaGlobe}
              text="Facebook"
              gradient="from-blue-600 to-blue-800"
            />
            <AnimatedLink
              href={`https://medium.com/@${info.mediumUser}`}
              icon={FaMedium}
              text="Read My Articles"
              gradient="from-gray-700 to-black"
            />
          </div>
        </motion.div>

        {/* Projects section - with more creative title */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center font-kr flex justify-center items-center">
            <span className="inline-block mr-2">창작물</span>
            <span className="font-heading">My Digital Creations</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}

            <motion.a
              href="https://jecrs687.github.io/projects"
              className="col-span-1 sm:col-span-2 flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-matcha-500 to-cyber-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              もっと見る - View All Projects
            </motion.a>
          </div>
        </motion.div>

        {/* About me quick facts with more Japanese/Korean styling */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center font-jp flex justify-center items-center">
            <span className="mr-2">私について</span>
            <span className="font-heading">Quick Facts</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="bg-white dark:bg-gray-800/90 p-4 rounded-xl shadow backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-jp">場所 • Location</p>
              <p className="font-medium text-gray-800 dark:text-white">Malta 🇲🇹</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800/90 p-4 rounded-xl shadow backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-kr">언어 • Languages</p>
              <p className="font-medium text-gray-800 dark:text-white">
                Learning Japanese & Korean
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800/90 p-4 rounded-xl shadow backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-jp">別名 • Nickname</p>
              <p className="font-medium text-gray-800 dark:text-white">
                Emma / Leli ✨
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800/90 p-4 rounded-xl shadow backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-kr">성격 • Personality</p>
              <p className="font-medium text-gray-800 dark:text-white">
                Loyal & Sociable
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800/90 p-4 rounded-xl shadow backdrop-blur-sm border border-gray-200 dark:border-gray-700 col-span-2"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-jp">趣味 • Favorites</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {info.loves.slice(0, 5).map((love, i) => (
                  <span key={i} className={`px-2 py-1 text-xs rounded-md ${i % 5 === 0 ? "bg-sakura-100 text-sakura-800 dark:bg-sakura-900/30 dark:text-sakura-300" :
                    i % 5 === 1 ? "bg-cyber-100 text-cyber-800 dark:bg-cyber-900/30 dark:text-cyber-300" :
                      i % 5 === 2 ? "bg-matcha-100 text-matcha-800 dark:bg-matcha-900/30 dark:text-matcha-300" :
                        i % 5 === 3 ? "bg-fuji-100 text-fuji-800 dark:bg-fuji-900/30 dark:text-fuji-300" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                    {love}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer with Japanese/Korean elements */}
        <motion.div
          className="text-center pt-8 border-t border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex justify-center space-x-4 mb-4">
            <AsianDecoration type="sakura" />
            <AsianDecoration type="wave" />
            <AsianDecoration type="sakura" />
          </div>

          <Link
            to="/"
            className="text-sm font-jp text-gray-500 dark:text-gray-400 hover:text-sakura-500 dark:hover:text-sakura-400 transition-colors"
          >
            ポートフォリオへ • Visit Full Portfolio
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 font-kr">
            <span className="inline-block mr-1">정성껏</span>
            Created with <FaHeart className="inline text-sakura-500 mx-1" /> by Emma
          </p>
        </motion.div>
      </div>

      {/* Custom CSS for vertical writing and animations */}
      <style>{`
        .writing-vertical {
          writing-mode: vertical-rl;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .bg-pattern-japanese {
          background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0V0zm4 4h4v4H4V4zm4 0h4v4H8V4zm4 0h4v4h-4V4zm0 4h4v4h-4V8zm-4 0h4v4H8V8zm-4 0h4v4H4V8zm-4 4h4v4H0v-4z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default InstagramLinkPage;