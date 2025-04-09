import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useSpring, animated, to } from 'react-spring';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaArrowDown, FaMusic, FaGuitar, FaBookOpen, FaCode, FaHeart, FaLanguage } from 'react-icons/fa';
import { SiMalt } from 'react-icons/si';
import { useTheme } from '../../contexts/ThemeContext';
import backgroundJapan from '../../assets/background.jpg';
import info from '../../information.json';

// 3D components
import HeroBackground from '../3d/HeroBackground';

// Custom components
const JapaneseWaveDivider = () => (
  <div className="w-full h-12 relative overflow-hidden my-8">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-full">
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        opacity=".15"
        fill="currentColor"
        className="text-sakura-400 dark:text-sakura-600"
      ></path>
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        opacity=".2"
        fill="currentColor"
        className="text-cyber-400 dark:text-cyber-600"
      ></path>
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        opacity=".25"
        fill="currentColor"
        className="text-fuji-400 dark:text-fuji-600"
      ></path>
    </svg>
  </div>
);

const SakuraDecoration = ({ className = "", size = "small" }) => {
  // Animation for sakura petals
  const rotation = useSpring({
    from: { rotation: 0 },
    to: { rotation: 360 },
    config: { duration: 20000 },
    loop: { reverse: false }
  });

  const pulse = useSpring({
    from: { scale: 1 },
    to: { scale: 1.1 },
    config: { duration: 2000 },
    loop: { reverse: true }
  });

  const sizes = {
    tiny: "w-3 h-3",
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <animated.div
      className={`relative ${sizes[size as keyof typeof sizes]} ${className}`}
      style={{
        transform: to([rotation.rotation, pulse.scale], (r, s) =>
          `rotate(${r}deg) scale(${s})`)
      }}
    >
      <div className="absolute w-full h-full rounded-full bg-sakura-300 dark:bg-sakura-500/70 opacity-80"></div>
      <div className="absolute w-full h-full rounded-full bg-sakura-300 dark:bg-sakura-500/70 opacity-80 rotate-45"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/4 h-1/4 rounded-full bg-sakura-500 dark:bg-sakura-300"></div>
      </div>
    </animated.div>
  );
};

// Featured interest card component
import { ElementType } from 'react';

interface InterestCardProps {
  icon: ElementType;
  title: string;
  description: string;
  color: string;
}

const InterestCard = ({ icon: Icon, title, description, color }: InterestCardProps) => {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800/90 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow hover:shadow-lg transition-all h-full`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
        <Icon className="text-xl" />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
};

const Home = () => {
  const { theme } = useTheme();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMood, setCurrentMood] = useState(0);

  // Moods array - showcasing Emma's personality
  const moods = [
    "Music Lover 🎵",
    "Anime Fan 🌸",
    "JPop Enthusiast 🎧",
    "Guitar Player 🎸",
    "Korean Drama Addict 📺",
    "Coder 💻",
    "Maltese Resident 🇲🇹",
    "Language Learner 🗣️"
  ];

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
  const fullText = "Digital Nomad • Creative Coder • Emma/Leli";
  const [index, setIndex] = useState(0);

  // Animation for the backdrop circles
  const circle1 = useSpring({
    from: { transform: 'translate(0%, 0%) scale(1)' },
    to: { transform: 'translate(10%, -10%) scale(1.1)' },
    config: { duration: 8000 },
    loop: { reverse: true }
  });

  const circle2 = useSpring({
    from: { transform: 'translate(0%, 0%) scale(1)' },
    to: { transform: 'translate(-10%, 10%) scale(0.9)' },
    config: { duration: 10000 },
    loop: { reverse: true }
  });

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

  useEffect(() => {
    // Start the animation once components are mounted
    controls.start({ opacity: 1, y: 0 });

    // Auto-scroll to the top when the component mounts
    window.scrollTo(0, 0);

    // Setup mood rotation
    const moodInterval = setInterval(() => {
      setCurrentMood(prev => (prev + 1) % moods.length);
    }, 3000);

    return () => {
      clearInterval(moodInterval);
    };
  }, [controls]);

  // Generate random particles for the hero section
  const generateParticles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 4 + 2;
      const x = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 10;

      return (
        <motion.div
          key={`particle-${i}`}
          className={`absolute ${i % 3 === 0 ? 'bg-sakura-400/30' : i % 3 === 1 ? 'bg-cyber-400/30' : 'bg-fuji-400/30'} rounded-full`}
          style={{
            width: size,
            height: size,
            left: `${x}%`,
            top: '-5%',
          }}
          animate={{
            top: '105%',
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: delay,
          }}
        />
      );
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 3D animated background */}
        <div className="absolute inset-0 -z-10">
          <HeroBackground theme={theme} />
        </div>

        {/* Background decorative circles */}
        <div className="absolute inset-0 overflow-hidden -z-5 opacity-30">
          <animated.div
            className="absolute w-3/4 h-3/4 rounded-full bg-gradient-to-br from-sakura-200/30 to-sakura-500/30 blur-3xl"
            style={circle1}
          />
          <animated.div
            className="absolute right-0 bottom-0 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-cyber-200/30 to-cyber-500/30 blur-3xl"
            style={circle2}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white dark:via-gray-900/50 dark:to-gray-900 -z-10"
          style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-y 15s ease infinite'
          }}
        ></div>

        {/* Animated floating particles */}
        {generateParticles(15)}

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            {/* Decorative sakura flowers */}
            <div className="absolute -left-5 sm:left-20 top-10">
              <SakuraDecoration size="medium" />
            </div>
            <div className="absolute -right-2 sm:right-24 top-32">
              <SakuraDecoration size="small" />
            </div>

            {/* Japanese/Korean name styled text */}
            <motion.h2
              className="text-lg md:text-xl font-jp mb-2 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-sakura-500 to-cyber-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              エマ • レリ
            </motion.h2>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Emma (Leli)
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

            {/* Animated mood indicator */}
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMood}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
                >
                  {moods[currentMood]}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center space-x-5 mb-10">
              <motion.a
                href="https://github.com/jecrs687"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-sakura-100 hover:text-sakura-600 dark:hover:bg-sakura-900/30 dark:hover:text-sakura-400 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.1 }}
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
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-cyber-100 hover:text-cyber-600 dark:hover:bg-cyber-900/30 dark:hover:text-cyber-400 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.1 }}
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
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-fuji-100 hover:text-fuji-600 dark:hover:bg-fuji-900/30 dark:hover:text-fuji-400 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.1 }}
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
                to="/instagram"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-sakura-500 to-cyber-500 hover:from-sakura-600 hover:to-cyber-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-sakura-500/20"
              >
                Instagram Page
              </Link>

              <Link
                to="/projects"
                className="px-8 py-3 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-sakura-500 dark:hover:border-sakura-500 text-gray-800 dark:text-gray-200 font-medium transition-all duration-300"
              >
                Explore Projects
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Totoro */}
        <div className="absolute right-8 sm:right-20 bottom-44 sm:bottom-24 h-24 md:h-40 z-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <animated.div style={{ transform: y.to(value => `translateY(${value}px)`) }}>
            <img src={"/pikachu.gif"} alt="Totoro" className="h-full object-contain w-[350px] sm:w-[350px] md:w-[475px]" />
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

      {/* Japanese-inspired wave divider */}
      <JapaneseWaveDivider />

      {/* About Me Section - Updated to reflect Emma's personality */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md relative">
        {/* Background decoration - subtle wave pattern */}
        <div className="absolute inset-0 bg-pattern-japanese opacity-5 dark:opacity-10 -z-10"></div>

        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center font-heading text-gray-900 dark:text-white flex justify-center items-center">
              <span className="font-jp mr-3 text-sakura-500">私の話</span> My Story
            </h2>

            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Brazilian-Italian living in Malta, known as Emma or Leli, with a passion for coding and Asian culture
            </p>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    こんにちは! <span className="font-kr ml-1">안녕하세요!</span> Hello! I'm <span className="font-medium text-sakura-600 dark:text-sakura-400">Emma</span>, but my Maltese friends call me <span className="font-medium text-cyber-600 dark:text-cyber-400">Leli</span>.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    I'm passionate about music, especially J-pop, and love playing guitar. When I'm not coding, you'll find me watching anime, reading books, or enjoying K-dramas.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Currently I'm living in Malta and studying Japanese and Korean languages. I'm super sociable and deeply loyal to my friends and family, especially my sister Aurora.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                    <span className="font-kr mr-2 text-fuji-500">취미</span> My Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {info.loves.map((interest, index) => (
                      <motion.span
                        key={interest}
                        className={`px-3 py-1 rounded-full text-sm ${index % 5 === 0 ? "bg-sakura-100 text-sakura-800 dark:bg-sakura-900/30 dark:text-sakura-300" :
                          index % 5 === 1 ? "bg-cyber-100 text-cyber-800 dark:bg-cyber-900/30 dark:text-cyber-300" :
                            index % 5 === 2 ? "bg-fuji-100 text-fuji-800 dark:bg-fuji-900/30 dark:text-fuji-300" :
                              index % 5 === 3 ? "bg-matcha-100 text-matcha-800 dark:bg-matcha-900/30 dark:text-matcha-300" :
                                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  className="rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 relative"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Decorative elements on the image */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <SakuraDecoration />
                  </div>
                  <div className="absolute -bottom-2 -right-2 z-10">
                    <SakuraDecoration />
                  </div>

                  <img
                    src={backgroundJapan}
                    alt="Emma in Japan"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with Japanese text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent flex items-end p-4">
                    <p className="text-white font-jp text-lg">旅の思い出</p>
                  </div>
                </motion.div>

                {/* Badge indicating location */}
                <motion.div
                  className="absolute top-4 -right-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                  whileHover={{ y: -5 }}
                >
                  <SiMalt className="text-red-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Malta</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Japanese-inspired wave divider */}
      <JapaneseWaveDivider />

      {/* Interests Section - Highlighting Emma's main interests */}
      <section className="py-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white flex justify-center items-center">
              <span className="text-cyber-500 mr-2">♥</span>
              <span className="font-jp mr-3">情熱</span> My Passions
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Things that bring joy and meaning to my life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <InterestCard
                icon={FaMusic}
                title="Music & JPop"
                description="From J-pop to K-pop, music is the soundtrack of my life. I love discovering new artists and attending karaoke sessions."
                color="from-sakura-400 to-sakura-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <InterestCard
                icon={FaGuitar}
                title="Playing Guitar"
                description="Music isn't just for listening. I enjoy playing guitar and learning new songs in my free time."
                color="from-cyber-400 to-cyber-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <InterestCard
                icon={FaBookOpen}
                title="Anime & KDrama"
                description="I'm a big fan of anime and Korean dramas. They're my perfect escape and inspiration."
                color="from-fuji-400 to-fuji-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <InterestCard
                icon={FaLanguage}
                title="Languages"
                description="Currently studying Japanese and Korean. I love the challenge and beauty of learning new languages."
                color="from-matcha-400 to-matcha-600"
              />
            </motion.div>
          </div>

          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/instagram"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/20 transition-colors font-medium"
            >
              <span>Learn more about me</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects section with Japanese/Korean styling */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white flex justify-center items-center">
              <span className="font-kr mr-3 bg-clip-text text-transparent bg-gradient-to-r from-cyber-400 to-fuji-500">창작물</span>
              My Digital Creations
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore my creative projects and digital works
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {(info.projects.bigProjects || []).slice(0, 3).map((project, index) => (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                key={project.name}
                className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-2 w-full bg-gradient-to-r from-sakura-400 to-cyber-500 group-hover:h-3 transition-all"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{project.name}</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">View Project</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-sakura-500 to-cyber-500 rounded-full flex items-center justify-center text-white">
                      <FaCode />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyber-500 to-fuji-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyber-500/20 transition-all"
            >
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer section with Totoro */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900/90 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
            <g fill="none" fillRule="evenodd">
              <g stroke="currentColor" strokeWidth="1" className="text-sakura-600 dark:text-sakura-400">
                <path d="M30 5L30 55M5 30L55 30" />
              </g>
            </g>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <animated.div style={{ transform: y.to(value => `translateY(${value / 2}px)`) }}>
              <img src={"/pikachu.gif"} alt="Totoro" className="h-16 object-contain" />
            </animated.div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
            <span className="font-jp mr-2">ありがとう!</span>
            Thanks for visiting
            <FaHeart className="text-sakura-500 mx-1.5" />
          </p>
        </div>
      </section>

      {/* CSS for animations and backgrounds */}
      <style>{`
        @keyframes gradient-y {
          0% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 50% 100%;
          }
          100% {
            background-position: 50% 0%;
          }
        }
        
        .bg-pattern-japanese {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c-5.523 0-10-4.477-10-10S14.477 0 20 0s10 4.477 10 10-4.477 10-10 10zm0 20c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z' fill='%23000000' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        .font-jp {
          font-family: 'Noto Sans JP', sans-serif;
        }

        .font-kr {
          font-family: 'Noto Sans KR', sans-serif;
        }

        .bg-cyber-grid {
          background-size: 20px 20px;
          background-image: linear-gradient(to right, rgba(200, 200, 200, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(200, 200, 200, 0.05) 1px, transparent 1px);
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;