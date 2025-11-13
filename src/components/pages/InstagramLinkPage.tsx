/**
 * Instagram Bio Link Page
 * Optimized for Instagram visitors with engaging interactions
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Instagram,
  Globe,
  BookOpen,
  Code2,
  MapPin,
  Music,
  Sparkles,
  Zap,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Moon,
  Sun,
  Trophy,
  Users,
  Camera,
  Shuffle,
  Palette,
  Flame,
  QrCode,
  PartyPopper,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import info from '../../information.json';

// Instagram-style link component with click tracking
const SocialLink = ({
  href,
  icon: Icon,
  text,
  color = "gray"
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  color?: string;
}) => {
  const [clicked, setClicked] = useState(false);

  const colorClasses = {
    gray: "hover:bg-gray-900 dark:hover:bg-white hover:border-gray-900",
    blue: "hover:bg-blue-600 hover:border-blue-600",
    pink: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:border-transparent",
    green: "hover:bg-green-600 hover:border-green-600",
    black: "hover:bg-black hover:border-black",
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`relative w-full flex items-center justify-center gap-3 p-4 mb-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 group ${colorClasses[color as keyof typeof colorClasses]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white transition-colors"
        animate={clicked ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
        {text}
      </div>
      <AnimatePresence>
        {clicked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.a>
  );
};

interface Project {
  name: string;
  link: string;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative block bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden group"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, borderColor: "#3b82f6" }}
      whileTap={{ scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <div className="p-4 aspect-square flex flex-col items-center justify-center text-center">
        <motion.div
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h3 className="font-semibold text-gray-900 dark:text-white capitalize text-sm leading-tight">
          {project.name}
        </h3>
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      />
    </motion.a>
  );
};

const InstagramLinkPage = () => {
  const [viewCount, setViewCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liveVisitors, setLiveVisitors] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentFact, setCurrentFact] = useState(0);
  const [colorTheme, setColorTheme] = useState<'default' | 'purple' | 'blue' | 'green' | 'orange'>('default');
  const [shuffledProjects, setShuffledProjects] = useState<typeof info.projects.bigProjects>([]);

  // New features state
  const [streak, setStreak] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [comboCount, setComboCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [easterEggsFound, setEasterEggsFound] = useState<number[]>([]);
  const [doubleTapHearts, setDoubleTapHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [currentAge, setCurrentAge] = useState('0.0000000000');
  const [dayProgress, setDayProgress] = useState(0);
  const [yearProgress, setYearProgress] = useState(0);

  // Cinema intro state
  const [introStage, setIntroStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [storyStage, setStoryStage] = useState(0);

  const lastReactionTime = useRef<number>(0);
  const comboTimeout = useRef<ReturnType<typeof setTimeout>>();
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const contentRef = useRef<HTMLDivElement>(null);

  const funFacts = [
    "🌍 Globe-trotter currently based in Malta",
    "💻 Built my first website at age 12",
    "🎮 Gaming enthusiast & tech collector",
    "📚 Always learning new technologies",
    "🎵 Code better with lo-fi beats",
    "🌙 Night owl & early bird hybrid",
    "☕ Powered by coffee and curiosity",
    "🚀 Turning ideas into reality, one line at a time"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    // Cinema intro sequence
    const introSequence = [
      { delay: 0, stage: 0 },      // Black screen
      { delay: 1000, stage: 1 },   // Studio logo
      { delay: 3000, stage: 2 },   // Title card
      { delay: 5500, stage: 3 },   // Name reveal
      { delay: 7500, stage: 4 },   // Final transition
    ];

    introSequence.forEach(({ delay, stage }) => {
      setTimeout(() => setIntroStage(stage), delay);
    });

    // End intro and show content with dramatic effect
    setTimeout(() => {
      setShowContent(true);
      // Trigger confetti for grand entrance
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
        startVelocity: 45,
        gravity: 1.2,
        ticks: 300
      });
    }, 8500);

    // Check dark mode preference
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);

    // Simulate view counter
    const stored = localStorage.getItem('pageViews');
    const count = stored ? parseInt(stored) : Math.floor(Math.random() * 500) + 1000;
    setViewCount(count);
    localStorage.setItem('pageViews', (count + 1).toString());

    // Check for achievements
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', visitCount.toString());
    checkAchievements(visitCount);

    // Load like count
    const likes = localStorage.getItem('likeCount');
    setLikeCount(likes ? parseInt(likes) : Math.floor(Math.random() * 100) + 50);

    // Calculate streak
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastVisit === today) {
      // Same day, maintain streak
      const currentStreak = parseInt(localStorage.getItem('streak') || '1');
      setStreak(currentStreak);
    } else if (lastVisit === yesterday) {
      // Consecutive day, increment streak
      const currentStreak = parseInt(localStorage.getItem('streak') || '1') + 1;
      setStreak(currentStreak);
      localStorage.setItem('streak', currentStreak.toString());
      localStorage.setItem('lastVisit', today);

      if (currentStreak % 7 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      // Streak broken, reset
      setStreak(1);
      localStorage.setItem('streak', '1');
      localStorage.setItem('lastVisit', today);
    }

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Load easter eggs
    const foundEggs = localStorage.getItem('easterEggs');
    if (foundEggs) setEasterEggsFound(JSON.parse(foundEggs));

    // Calculate age - Birthday: October 15, 2000 at 7:00 AM GMT-3
    const calculateAge = () => {
      // Birthday: 2000-10-15 07:00:00 GMT-3 (which is 10:00:00 UTC)
      const birthDate = new Date('2000-10-15T10:00:00.000Z');
      const now = new Date();
      const ageInMilliseconds = now.getTime() - birthDate.getTime();
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
      return ageInYears.toFixed(10);
    };

    // Calculate progress bars
    const calculateProgress = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayProg = ((now.getTime() - startOfDay.getTime()) / 86400000) * 100;

      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const yearProg = ((now.getTime() - startOfYear.getTime()) / (365.25 * 86400000)) * 100;

      setDayProgress(dayProg);
      setYearProgress(yearProg);
    };

    // Update age every 0.1 seconds
    setCurrentAge(calculateAge());
    calculateProgress();
    const ageInterval = setInterval(() => {
      setCurrentAge(calculateAge());
      calculateProgress();
    }, 100);

    // Simulate live visitors with fluctuation
    const interval = setInterval(() => {
      setLiveVisitors(Math.floor(Math.random() * 5) + 1);
    }, 5000);

    // Parallax scroll effect
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = window.scrollY;
        setScrollY(scrollPosition);

        // Story progression based on scroll
        const viewportHeight = window.innerHeight;
        if (scrollPosition > viewportHeight * 0.3) setStoryStage(1);
        if (scrollPosition > viewportHeight * 0.8) setStoryStage(2);
        if (scrollPosition > viewportHeight * 1.5) setStoryStage(3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize

    // Typing effect
    const text = "Full Stack Developer & Creative Technologist";
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    // Shake to shuffle detection
    const setupShakeListener = async () => {
      if (typeof DeviceMotionEvent !== 'undefined') {
        // Check if permission request is available (iOS 13+)
        if ('requestPermission' in DeviceMotionEvent && typeof (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === 'function') {
          try {
            const permission = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
            if (permission === 'granted') {
              window.addEventListener('devicemotion', handleShake);
            }
          } catch (error) {
            console.error('Device motion permission error:', error);
          }
        } else {
          window.addEventListener('devicemotion', handleShake);
        }
      }
    };
    setupShakeListener();

    return () => {
      clearInterval(interval);
      clearInterval(ageInterval);
      clearInterval(typingInterval);
      window.removeEventListener('devicemotion', handleShake);
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAchievements = (visitCount: number) => {
    const newAchievements: string[] = [];
    if (visitCount === 1) newAchievements.push('First Visit! 🎉');
    if (visitCount === 10) newAchievements.push('Regular Visitor! 🔥');
    if (visitCount === 50) newAchievements.push('Super Fan! ⭐');
    if (visitCount === 100) newAchievements.push('Legend! 👑');

    if (newAchievements.length > 0) {
      setAchievements(newAchievements);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleShake = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (acceleration && (Math.abs(acceleration.x || 0) > 15 || Math.abs(acceleration.y || 0) > 15 || Math.abs(acceleration.z || 0) > 15)) {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      shakeTimeoutRef.current = setTimeout(() => shuffleProjects(), 500);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emma | leli',
          text: 'Check out my links!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  const handleReaction = (emoji: string) => {
    const id = Date.now();
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 50 + 25;
    setReactions([...reactions, { id, emoji, x, y }]);

    // Increment like count
    const newCount = likeCount + 1;
    setLikeCount(newCount);
    localStorage.setItem('likeCount', newCount.toString());

    // Combo system
    const now = Date.now();
    const timeSinceLastReaction = now - lastReactionTime.current;

    if (timeSinceLastReaction < 2000) {
      // Within combo window
      const newCombo = comboCount + 1;
      setComboCount(newCombo);

      let multiplier = 1;
      if (newCombo >= 5) multiplier = 3;
      else if (newCombo >= 3) multiplier = 2;
      else if (newCombo >= 2) multiplier = 1.5;

      setComboMultiplier(multiplier);

      // Clear existing timeout
      if (comboTimeout.current) clearTimeout(comboTimeout.current);

      // Reset combo after 2 seconds of no activity
      comboTimeout.current = setTimeout(() => {
        setComboCount(0);
        setComboMultiplier(1);
      }, 2000);
    } else {
      setComboCount(1);
      setComboMultiplier(1);
    }

    lastReactionTime.current = now;

    // Trigger confetti with combo multiplier
    confetti({
      particleCount: Math.floor(50 * comboMultiplier),
      spread: 60 + (comboMultiplier * 20),
      origin: { y: 0.7 },
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
    });

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  const shuffleProjects = () => {
    const projects = [...(info.projects.bigProjects || [])];
    const shuffled = projects.sort(() => Math.random() - 0.5).slice(0, 4);
    setShuffledProjects(shuffled);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  const cycleColorTheme = () => {
    const themes: Array<'default' | 'purple' | 'blue' | 'green' | 'orange'> = ['default', 'purple', 'blue', 'green', 'orange'];
    const currentIndex = themes.indexOf(colorTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length] as 'default' | 'purple' | 'blue' | 'green' | 'orange';
    setColorTheme(nextTheme);
  };

  const toggleScreenshotMode = () => {
    setScreenshotMode(!screenshotMode);
  };

  const nextFact = () => {
    setCurrentFact((currentFact + 1) % funFacts.length);
  };

  const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent) => {
    const id = Date.now();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in event
      ? (event.touches[0]?.clientX ?? 0) - rect.left
      : event.clientX - rect.left;
    const y = 'touches' in event
      ? (event.touches[0]?.clientY ?? 0) - rect.top
      : event.clientY - rect.top;

    setDoubleTapHearts([...doubleTapHearts, { id, x, y }]);

    setTimeout(() => {
      setDoubleTapHearts(prev => prev.filter(h => h.id !== id));
    }, 1000);
  };

  const handleEasterEgg = (eggId: number) => {
    if (easterEggsFound.includes(eggId)) return;

    const newFound = [...easterEggsFound, eggId];
    setEasterEggsFound(newFound);
    localStorage.setItem('easterEggs', JSON.stringify(newFound));

    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
    });

    if (newFound.length === 5) {
      // All easter eggs found!
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 180,
          origin: { y: 0.5 },
          startVelocity: 45
        });
      }, 500);
    }
  };

  const projects = shuffledProjects.length > 0
    ? shuffledProjects
    : [...(info.projects.bigProjects || []).slice(0, 4)];

  const highlights = [
    { icon: Code2, label: "Projects", color: "from-blue-500 to-cyan-500" },
    { icon: Music, label: "Music", color: "from-purple-500 to-pink-500" },
    { icon: BookOpen, label: "Articles", color: "from-orange-500 to-red-500" },
    { icon: Sparkles, label: "About", color: "from-yellow-500 to-orange-500" },
  ];

  const themeColors = {
    default: 'bg-gray-50 dark:bg-gray-900',
    purple: 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950 dark:via-pink-950 dark:to-purple-950',
    blue: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-950',
    green: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950 dark:via-emerald-950 dark:to-green-950',
    orange: 'bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 dark:from-orange-950 dark:via-yellow-950 dark:to-orange-950'
  };

  return (
    <div className={`min-h-screen ${themeColors[colorTheme]} relative transition-colors duration-700`}>
      {/* CINEMA INTRO OVERLAY */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />

            {/* Film Grain Effect */}
            <motion.div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              }}
              animate={{ opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            {/* Stage 0: Black Screen with Light Leak */}
            {introStage === 0 && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent"
                  initial={{ x: "-50%", scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </motion.div>
            )}

            {/* Stage 1: Minimal Epic Logo */}
            {introStage === 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center relative"
              >
                {/* Orbiting Particles */}
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-3 h-3"
                    initial={{ x: -6, y: -6, opacity: 0 }}
                    animate={{
                      rotate: 360,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      rotate: { duration: 4, ease: "linear", repeat: Infinity },
                      opacity: { duration: 0.5, times: [0, 0.2, 0.8, 1] },
                      delay: i * 0.08
                    }}
                    style={{
                      transformOrigin: '6px 6px',
                    }}
                  >
                    <motion.div
                      className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                      animate={{
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.08
                      }}
                      style={{
                        transform: `translate(${Math.cos((i / 16) * Math.PI * 2) * 100}px, ${Math.sin((i / 16) * Math.PI * 2) * 100}px)`
                      }}
                    />
                  </motion.div>
                ))}

                {/* Main Logo with Enhanced 3D Effect */}
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                    rotateZ: [0, 0, 0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotateY: { duration: 2.5, ease: "easeInOut" },
                    rotateZ: { duration: 8, ease: "linear", repeat: Infinity },
                    scale: { duration: 2, ease: "easeInOut", repeat: Infinity }
                  }}
                  className="relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 1)) drop-shadow(0 0 80px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 120px rgba(236, 72, 153, 0.6))',
                  }}
                >
                  <Code2 className="w-48 h-48 text-white" />
                </motion.div>

                {/* Energy Rings */}
                {[1, 2, 3, 4, 5].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                    style={{
                      borderColor: ring % 2 === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'
                    }}
                    initial={{ width: 0, height: 0, opacity: 1 }}
                    animate={{
                      width: [0, 600],
                      height: [0, 600],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: ring * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}

                {/* Particle Explosion */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white"
                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i / 30) * Math.PI * 2) * 200,
                      y: Math.sin((i / 30) * Math.PI * 2) * 200,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + (i * 0.02),
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                ))}
              </motion.div>
            )}            {/* Stage 2: Epic Title Card with Matrix Effect */}
            {introStage === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center px-8 relative"
              >
                {/* Enhanced Matrix Rain Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute font-mono text-xs"
                      style={{
                        left: `${(i / 30) * 100}%`,
                        color: i % 3 === 0 ? 'rgba(59, 130, 246, 0.4)' : i % 3 === 1 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'
                      }}
                      initial={{ y: -100, opacity: 0 }}
                      animate={{
                        y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        delay: i * 0.08,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2
                      }}
                    >
                      {Array.from({ length: 25 }, () => String.fromCharCode(33 + Math.random() * 94)).join('\n')}
                    </motion.div>
                  ))}
                </div>

                {/* Geometric Shapes Flying Through */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`shape-${i}`}
                    className="absolute"
                    initial={{
                      x: -100,
                      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                      opacity: 0,
                      rotate: 0,
                      scale: 0.5
                    }}
                    animate={{
                      x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1000,
                      opacity: [0, 0.6, 0],
                      rotate: 360,
                      scale: [0.5, 1.5, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    {i % 3 === 0 ? (
                      <div className="w-8 h-8 border-2 border-blue-400" />
                    ) : i % 3 === 1 ? (
                      <div className="w-8 h-8 rounded-full border-2 border-purple-400" />
                    ) : (
                      <div className="w-8 h-8 border-2 border-pink-400 transform rotate-45" />
                    )}
                  </motion.div>
                ))}

                {/* Animated Top Line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "400px" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 via-purple-500 to-transparent mx-auto mb-12 relative"
                >
                  <motion.div
                    className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.5)',
                        '0 0 40px rgba(139, 92, 246, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Main Text with 3D Effect */}
                <motion.div className="relative">
                  <motion.h2
                    initial={{ opacity: 0, letterSpacing: "1em", scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      letterSpacing: "0.3em",
                      scale: 1,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-white text-4xl md:text-6xl font-bold mb-12 uppercase relative z-10"
                    style={{
                      textShadow: '0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.6), 2px 2px 0 rgba(236, 72, 153, 0.5)',
                    }}
                  >
                    PRESENTS
                  </motion.h2>

                  {/* Rotating Hexagon */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="300" height="300" viewBox="0 0 100 100" className="opacity-20">
                      <motion.polygon
                        points="50,5 90,25 90,75 50,95 10,75 10,25"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Animated Bottom Line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "400px" }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 via-pink-400 to-transparent mx-auto relative"
                >
                  <motion.div
                    className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(139, 92, 246, 0.5)',
                        '0 0 40px rgba(236, 72, 153, 0.5)',
                        '0 0 20px rgba(139, 92, 246, 0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Stage 3: Epic Name Reveal */}
            {introStage === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8 }}
                className="text-center px-8 relative"
              >
                {/* Multi-layer Spotlight effect */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
                    animate={{
                      background: [
                        'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
                </motion.div>

                {/* Holographic Grid Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
                      backgroundSize: '50px 50px',
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-white text-6xl md:text-8xl font-black mb-8 tracking-tight relative z-10"
                >
                  <motion.div className="relative inline-block">
                    <motion.span
                      initial={{ opacity: 0, x: -100, rotateY: -90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                      className="block mb-2"
                      style={{
                        textShadow: '0 0 40px rgba(59, 130, 246, 1), 0 0 80px rgba(59, 130, 246, 0.8), 4px 4px 0 rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      EMANUEL
                    </motion.span>

                    {/* Glitch Effect on First Name */}
                    <motion.span
                      className="absolute top-0 left-0 block mb-2 text-blue-500 opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0],
                        x: [-2, 2, -2],
                      }}
                      transition={{
                        delay: 0.5,
                        duration: 0.3,
                        repeat: 3,
                        repeatDelay: 0.5
                      }}
                    >
                      EMANUEL
                    </motion.span>
                  </motion.div>

                  <motion.div className="relative inline-block">
                    <motion.span
                      initial={{ opacity: 0, x: 100, rotateY: 90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
                      className="block bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
                      style={{
                        filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.6))',
                      }}
                    >
                      CASCONE
                    </motion.span>

                    {/* Glitch Effect on Last Name */}
                    <motion.span
                      className="absolute top-0 left-0 block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent opacity-60"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 0.6, 0],
                        x: [2, -2, 2],
                      }}
                      transition={{
                        delay: 0.8,
                        duration: 0.3,
                        repeat: 3,
                        repeatDelay: 0.5
                      }}
                    >
                      CASCONE
                    </motion.span>
                  </motion.div>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="relative z-10"
                >
                  {/* Animated Social Handle */}
                  <motion.div
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 40px rgba(139, 92, 246, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Github className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <span className="text-white text-xl font-mono tracking-wider">@jecrs687</span>
                  </motion.div>
                </motion.div>

                {/* Lens flare effect */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 100, 0],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                />

                {/* Floating Sparkles & Icons */}
                {[...Array(20)].map((_, i) => {
                  const icons = [Sparkles, Zap, TrendingUp, Code2];
                  const Icon = icons[i % icons.length];
                  const colors = ['text-blue-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400', 'text-yellow-400'];

                  return (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{
                        x: Math.cos((i / 20) * Math.PI * 2) * 150,
                        y: Math.sin((i / 20) * Math.PI * 2) * 150,
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{
                        x: Math.cos((i / 20) * Math.PI * 2) * (250 + Math.sin(i) * 100),
                        y: Math.sin((i / 20) * Math.PI * 2) * (250 + Math.cos(i) * 100),
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.5, 1, 0],
                        rotate: [0, 360, 720],
                      }}
                      transition={{
                        delay: i * 0.08,
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "easeInOut"
                      }}
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                    >
                      <Icon className={`w-5 h-5 ${colors[i % colors.length]}`} style={{
                        filter: 'drop-shadow(0 0 8px currentColor)'
                      }} />
                    </motion.div>
                  );
                })}

                {/* Energy Burst Lines */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute top-1/2 left-1/2 origin-left h-0.5 bg-gradient-to-r from-blue-400 to-transparent"
                    initial={{ width: 0, opacity: 0, rotate: (i / 12) * 360 }}
                    animate={{
                      width: [0, 200, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      delay: 1.5 + i * 0.05,
                      duration: 1,
                      ease: "easeOut"
                    }}
                    style={{
                      transform: `rotate(${(i / 12) * 360}deg)`,
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Stage 4: Epic Transition Out */}
            {introStage === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"
              >
                {/* Multiple Camera Flash Effects */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0, 0.6, 0, 1, 0] }}
                  transition={{ duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.6, 0.8, 1] }}
                  className="absolute inset-0 bg-white"
                />

                {/* Spiral Vortex Effect */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`vortex-${i}`}
                    className="absolute top-1/2 left-1/2 rounded-full border-2 border-blue-400/50"
                    initial={{
                      width: 0,
                      height: 0,
                      opacity: 1,
                      rotate: 0
                    }}
                    animate={{
                      width: 2000,
                      height: 2000,
                      opacity: 0,
                      rotate: 360
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.03,
                      ease: "easeOut"
                    }}
                    style={{
                      marginLeft: '-1000px',
                      marginTop: '-1000px'
                    }}
                  />
                ))}

                {/* Particle Burst */}
                {[...Array(100)].map((_, i) => (
                  <motion.div
                    key={`burst-${i}`}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
                    }}
                    initial={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 1
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i / 100) * Math.PI * 2) * (200 + Math.random() * 300),
                      y: Math.sin((i / 100) * Math.PI * 2) * (200 + Math.random() * 300),
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.005,
                      ease: "easeOut"
                    }}
                  />
                ))}

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                  className="absolute top-0 left-0 right-0 h-1/2 bg-black origin-left"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 h-1/2 bg-black origin-right"
                />
              </motion.div>
            )}            {/* Cinematic Bars (Top & Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-black pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-black pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Gradient */}
      {colorTheme !== 'default' && (
        <motion.div
          className="fixed inset-0 pointer-events-none opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Floating Reaction Emojis */}
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 1, y: 0, scale: 0 }}
            animate={{ opacity: 0, y: -200, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="fixed text-4xl pointer-events-none z-40"
            style={{
              left: `${reaction.x}%`,
              top: `${reaction.y}%`,
            }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Screenshot Mode Watermark */}
      {screenshotMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/80 text-white text-xs rounded-full font-mono"
        >
          @jecrs687 • jecrs687.github.io
        </motion.div>
      )}

      {/* Floating Action Buttons */}
      {!screenshotMode && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform border-2 border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform border-2 border-gray-200 dark:border-gray-700 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="w-5 h-5" />
            {showShare && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -left-24 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
              >
                Link copied!
              </motion.div>
            )}
          </motion.button>

          {/* Copy Link Button */}
          <motion.button
            onClick={handleCopyLink}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform border-2 border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              ) : (
                <motion.div key="copy">
                  <Copy className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Color Theme Switcher */}
          <motion.button
            onClick={cycleColorTheme}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform border-2 border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Palette className="w-5 h-5" />
          </motion.button>

          {/* Screenshot Mode */}
          <motion.button
            onClick={toggleScreenshotMode}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 ${screenshotMode
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Camera className="w-5 h-5" />
          </motion.button>

          {/* Shuffle Projects */}
          <motion.button
            onClick={shuffleProjects}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform border-2 border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>

          {/* Particles Toggle */}
          <motion.button
            onClick={() => setShowParticles(!showParticles)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 ${showParticles
              ? 'bg-purple-500 text-white border-purple-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>

          {/* QR Code */}
          <motion.button
            onClick={() => setShowQR(!showQR)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 ${showQR
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <QrCode className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scan to Visit</h3>
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG value={window.location.href} size={200} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">@jecrs687</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle Background */}
      {showParticles && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      )}

      {/* Double Tap Hearts */}
      <AnimatePresence>
        {doubleTapHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0, y: 0 }}
            animate={{ opacity: 0, scale: 2, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed text-red-500 pointer-events-none z-40"
            style={{
              left: heart.x,
              top: heart.y,
            }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Combo Counter */}
      <AnimatePresence>
        {comboCount > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>{comboCount}x COMBO!</span>
              {comboMultiplier > 1 && <span className="text-xl">🔥</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORYTELLING PARALLAX SECTION */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative"
          >
            {/* Story Chapter 1: The Journey Begins */}
            <motion.section
              className="min-h-screen flex items-center justify-center relative overflow-hidden"
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
              }}
            >
              {/* Animated Background Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={`bg-particle-${i}`}
                    className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="max-w-4xl mx-auto px-6 text-center z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: storyStage >= 0 ? 1 : 0, y: storyStage >= 0 ? 0 : 50 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.div
                    className="mb-8"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-16 h-16 mx-auto text-blue-400 mb-4" style={{
                      filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))'
                    }} />
                  </motion.div>

                  <motion.h2
                    className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                    style={{
                      textShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    Every Line of Code Tells a Story
                  </motion.h2>

                  <motion.p
                    className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: storyStage >= 0 ? 1 : 0 }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    From a curious 12-year-old crafting first websites, to building experiences that inspire millions.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: storyStage >= 0 ? 1 : 0, scale: storyStage >= 0 ? 1 : 0.8 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-500"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="w-5 h-5" />
                    </motion.div>
                    <span>Scroll to explore the journey</span>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ↓
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Floating Code Snippets */}
              {['</>', '{}', '[]', '( )', '=>'].map((symbol, i) => (
                <motion.div
                  key={symbol}
                  className="absolute text-4xl font-mono text-blue-400/20 dark:text-blue-400/10"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + Math.sin(i) * 20}%`,
                    transform: `translateY(${-scrollY * (0.2 + i * 0.1)}px)`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </motion.section>

            {/* Story Chapter 2: The Craft */}
            <motion.section
              className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-blue-950/20"
              style={{
                transform: `translateY(${scrollY * 0.3}px)`,
              }}
            >
              <div className="max-w-4xl mx-auto px-6 z-10">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: storyStage >= 1 ? 1 : 0, x: storyStage >= 1 ? 0 : -100 }}
                  transition={{ duration: 1 }}
                  className="grid md:grid-cols-3 gap-8"
                >
                  {[
                    { icon: Code2, title: "Innovation", desc: "Pushing boundaries with cutting-edge technology" },
                    { icon: Zap, title: "Performance", desc: "Optimized experiences that feel instant" },
                    { icon: Heart, title: "Passion", desc: "Crafted with care and attention to detail" }
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: storyStage >= 1 ? 1 : 0, y: storyStage >= 1 ? 0 : 50 }}
                      transition={{ delay: i * 0.2, duration: 0.8 }}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105"
                      style={{
                        transform: `translateY(${-scrollY * (0.1 + i * 0.05)}px)`,
                      }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                        className="mb-4"
                      >
                        <item.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>

            {/* Story Chapter 3: The Numbers */}
            <motion.section
              className="min-h-[60vh] flex items-center justify-center relative overflow-hidden"
              style={{
                transform: `translateY(${scrollY * 0.2}px)`,
              }}
            >
              <div className="max-w-5xl mx-auto px-6 z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: storyStage >= 2 ? 1 : 0, scale: storyStage >= 2 ? 1 : 0.8 }}
                  transition={{ duration: 1 }}
                  className="text-center"
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-12">
                    Impact in Numbers
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { value: "10+", label: "Years Coding", icon: Code2 },
                      { value: "50+", label: "Projects Built", icon: Zap },
                      { value: "1M+", label: "Lines of Code", icon: TrendingUp },
                      { value: "∞", label: "Ideas", icon: Sparkles }
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: storyStage >= 2 ? 1 : 0, y: storyStage >= 2 ? 0 : 30 }}
                        transition={{ delay: i * 0.15, duration: 0.8 }}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl text-white relative overflow-hidden group hover:scale-110 transition-transform"
                        style={{
                          transform: `translateY(${-scrollY * 0.08}px)`,
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                        <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                        <div className="text-4xl font-black mb-1">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Story Chapter 4: The Tech Stack - 3D Cards */}
            <motion.section
              className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-950/20"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
              }}
            >
              <div className="max-w-6xl mx-auto px-6 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: storyStage >= 3 ? 1 : 0, y: storyStage >= 3 ? 0 : 50 }}
                  transition={{ duration: 1 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Master of Technologies
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Building with the best tools in the industry
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      category: "Frontend",
                      techs: ["React", "TypeScript", "Tailwind", "Next.js"],
                      gradient: "from-blue-500 to-cyan-500",
                      icon: Code2
                    },
                    {
                      category: "Backend",
                      techs: ["Node.js", "Python", "PostgreSQL", "Redis"],
                      gradient: "from-purple-500 to-pink-500",
                      icon: Zap
                    },
                    {
                      category: "Tools",
                      techs: ["Docker", "AWS", "Git", "CI/CD"],
                      gradient: "from-orange-500 to-red-500",
                      icon: TrendingUp
                    }
                  ].map((stack, i) => (
                    <motion.div
                      key={stack.category}
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{
                        opacity: storyStage >= 3 ? 1 : 0,
                        rotateY: storyStage >= 3 ? 0 : -90
                      }}
                      transition={{ delay: i * 0.2, duration: 0.8 }}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        z: 50
                      }}
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent relative overflow-hidden group"
                      style={{
                        transform: `translateY(${-scrollY * (0.05 + i * 0.02)}px)`,
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                    >
                      {/* Animated gradient background on hover */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${stack.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                      />

                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mb-6"
                      >
                        <stack.icon className={`w-16 h-16 mx-auto bg-gradient-to-r ${stack.gradient} bg-clip-text text-transparent`} style={{
                          filter: 'drop-shadow(0 0 20px currentColor)'
                        }} />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {stack.category}
                      </h3>

                      <div className="space-y-3">
                        {stack.techs.map((tech, techIndex) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                              opacity: storyStage >= 3 ? 1 : 0,
                              x: storyStage >= 3 ? 0 : -20
                            }}
                            transition={{ delay: i * 0.2 + techIndex * 0.1 + 0.3 }}
                            className={`px-4 py-2 rounded-full bg-gradient-to-r ${stack.gradient} text-white text-sm font-semibold text-center`}
                          >
                            {tech}
                          </motion.div>
                        ))}
                      </div>

                      {/* 3D floating particles */}
                      {[...Array(5)].map((_, particleIndex) => (
                        <motion.div
                          key={`particle-${particleIndex}`}
                          className="absolute w-2 h-2 bg-white/50 rounded-full"
                          animate={{
                            y: [0, -20, 0],
                            x: [0, Math.sin(particleIndex) * 10, 0],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2 + particleIndex * 0.5,
                            repeat: Infinity,
                            delay: particleIndex * 0.2
                          }}
                          style={{
                            left: `${20 + particleIndex * 15}%`,
                            top: `${30 + Math.sin(particleIndex) * 20}%`,
                          }}
                        />
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-lg mx-auto px-4 py-12"
      >
        {/* Profile Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Avatar */}
          <motion.div
            className="w-28 h-28 mx-auto mb-6 relative cursor-pointer select-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onDoubleClick={handleDoubleTap}
            onTouchStart={(e) => {
              const now = Date.now();
              const target = e.currentTarget as HTMLElement & { lastTap?: number };
              const lastTap = target.lastTap || 0;
              if (now - lastTap < 300) {
                handleDoubleTap(e);
              }
              target.lastTap = now;
            }}
          >
            <img
              src="/assets/profile.jpg"
              alt="Emma | leli"
              className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
          </motion.div>

          {/* Greeting */}
          {greeting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-sm font-medium text-purple-600 dark:text-purple-400"
            >
              {greeting}! 👋
            </motion.div>
          )}

          {/* Name & Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Emma | leli
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-1 font-mono">
              {typedText}
              <motion.span
                className="inline-block w-0.5 h-5 bg-gray-600 dark:bg-gray-400 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
              @jecrs687
            </p>
          </motion.div>

          {/* Streak Badge */}
          {streak > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-semibold"
            >
              <Flame className="w-4 h-4" />
              {streak} day streak!
            </motion.div>
          )}

          {/* Stats Row */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-4 text-sm flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Malta</span>
            </div>
            <motion.div
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <TrendingUp className="w-4 h-4" />
              <motion.span
                key={viewCount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {viewCount.toLocaleString()} views
              </motion.span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 text-green-600 dark:text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            >
              <Users className="w-4 h-4" />
              <motion.span
                key={liveVisitors}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {liveVisitors} online
              </motion.span>
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Age Counter */}
          <motion.div
            className="mt-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
                Current Age
              </div>
              <div className="font-mono text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentAge}
              </div>
            </div>
          </motion.div>

          {/* Reaction Bar */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {['❤️', '🔥', '👏', '💯'].map((emoji, index) => (
              <motion.button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {emoji}
              </motion.button>
            ))}
            <motion.span
              className="text-sm text-gray-500 dark:text-gray-400 ml-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {likeCount > 0 && `${likeCount.toLocaleString()}`}
            </motion.span>
          </motion.div>

          {/* Fun Fact Generator */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={nextFact}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-800 text-sm text-gray-700 dark:text-gray-300 font-medium hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentFact}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="block"
                >
                  {funFacts[currentFact]}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Tap for another fact</span>
            </motion.button>
          </motion.div>

          {/* Life Progress Bars */}
          <motion.div
            className="mt-6 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">Life Progress</div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Today</span>
                <span className="font-mono">{dayProgress.toFixed(7)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  style={{ width: `${dayProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dayProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Year 2025</span>
                <span className="font-mono">{yearProgress.toFixed(7)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{ width: `${yearProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${yearProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Easter Egg Counter */}
          {easterEggsFound.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl"
            >
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                <PartyPopper className="w-4 h-4" />
                <span>Easter Eggs: {easterEggsFound.length}/5</span>
              </div>
            </motion.div>
          )}

          {/* Achievement Badges */}
          <AnimatePresence>
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="mt-4 flex flex-wrap gap-2 justify-center"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold flex items-center gap-1 border-2 border-yellow-300 dark:border-yellow-700"
                  >
                    <Trophy className="w-3 h-3" />
                    {achievement}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instagram-style Story Highlights */}
        <motion.div
          className="mb-8 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex gap-4 justify-start px-2">
            {highlights.map((highlight, i) => (
              <motion.div
                key={highlight.label}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${highlight.color} p-0.5`}>
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <highlight.icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{highlight.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Currently Listening / Status Badge */}
        <motion.div
          className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex-shrink-0"
          >
            <Music className="w-5 h-5 text-green-600 dark:text-green-400" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">
              Currently Vibing to
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              JPop & Coding Beats 🎵
            </div>
          </div>
          <motion.div
            className="flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-green-500 rounded-full"
                animate={{
                  height: ["8px", "16px", "8px"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          className="mb-8 grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center"
            whileHover={{ scale: 1.05, borderColor: "#3b82f6" }}
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {projects.length}+
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Projects
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center"
            whileHover={{ scale: 1.05, borderColor: "#8b5cf6" }}
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              3+
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Languages
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center"
            whileHover={{ scale: 1.05, borderColor: "#10b981" }}
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              ∞
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Ideas
            </div>
          </motion.div>
        </motion.div>

        {/* Social Links Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <SocialLink
            href={info.github}
            icon={Github}
            text="GitHub"
            color="black"
          />
          <SocialLink
            href={info.linkedin}
            icon={Linkedin}
            text="LinkedIn"
            color="blue"
          />
          <SocialLink
            href={info.instagram}
            icon={Instagram}
            text="Instagram"
            color="pink"
          />
          <SocialLink
            href={`https://medium.com/@${info.mediumUser}`}
            icon={BookOpen}
            text="Medium"
            color="black"
          />
          <SocialLink
            href={info.facebook}
            icon={Globe}
            text="Portfolio"
            color="gray"
          />
        </motion.div>

        {/* Featured Projects with Cool Animation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Latest Projects
            </h2>
            <Link
              to="/projects"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Footer with Fun Interaction */}
        <motion.div
          className="text-center pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              Explore Full Portfolio
            </Link>
          </motion.div>
          <p className="text-xs text-gray-500 dark:text-gray-600 mt-6">
            Made with passion • © 2025
          </p>

          {/* Hidden Easter Eggs */}
          <div className="mt-8 flex justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
            {[1, 2, 3, 4, 5].map((id) => (
              <motion.button
                key={id}
                onClick={() => handleEasterEgg(id)}
                className={`w-3 h-3 rounded-full ${easterEggsFound.includes(id)
                  ? 'bg-yellow-400'
                  : 'bg-gray-300 dark:bg-gray-700'
                  } hover:scale-150 transition-transform`}
                whileHover={{ scale: 2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InstagramLinkPage;
