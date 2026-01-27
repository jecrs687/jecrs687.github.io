/**
 * Instagram Link Page - "You've Been Hacked" Edition
 * 
 * A fun, lightweight page that playfully shows visitors what data
 * websites can collect just by them visiting.
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  Terminal,
  Wifi,
  Monitor,
  Clock,
  Globe2,
  Battery,
  Cpu,
  MapPin,
  Eye,
  Shield,
  Skull,
  Heart,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import info from '../../information.json';

// ============================================================================
// TYPES
// ============================================================================

interface VisitorData {
  browser: string;
  os: string;
  screenSize: string;
  colorDepth: string;
  timezone: string;
  language: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  online: boolean;
  deviceMemory: string;
  hardwareConcurrency: string;
  connectionType: string;
  platform: string;
  vendor: string;
  touchSupport: boolean;
  localTime: string;
  referrer: string;
  historyLength: number;
}

// ============================================================================
// VISITOR DATA COLLECTION
// ============================================================================

const getBrowserInfo = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox 🦊';
  if (ua.includes('Edg')) return 'Edge 🌐';
  if (ua.includes('Chrome')) return 'Chrome 🔵';
  if (ua.includes('Safari')) return 'Safari 🧭';
  if (ua.includes('Opera')) return 'Opera 🔴';
  return 'Unknown Browser 🌐';
};

const getOSInfo = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows 🪟';
  if (ua.includes('Mac')) return 'macOS 🍎';
  if (ua.includes('Linux')) return 'Linux 🐧';
  if (ua.includes('Android')) return 'Android 🤖';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS 📱';
  return 'Unknown OS 💻';
};

const getConnectionType = (): string => {
  const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
  return nav.connection?.effectiveType?.toUpperCase() || 'Unknown';
};

const collectVisitorData = (): VisitorData => ({
  browser: getBrowserInfo(),
  os: getOSInfo(),
  screenSize: `${window.screen.width}x${window.screen.height}`,
  colorDepth: `${window.screen.colorDepth}-bit`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: navigator.language,
  cookiesEnabled: navigator.cookieEnabled,
  doNotTrack: navigator.doNotTrack === '1',
  online: navigator.onLine,
  deviceMemory: `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory || '?'} GB`,
  hardwareConcurrency: `${navigator.hardwareConcurrency || '?'} cores`,
  connectionType: getConnectionType(),
  platform: navigator.platform,
  vendor: navigator.vendor || 'Unknown',
  touchSupport: 'ontouchstart' in window,
  localTime: new Date().toLocaleTimeString(),
  referrer: document.referrer || 'Direct visit',
  historyLength: window.history.length,
});

// ============================================================================
// HACKER TERMINAL EFFECT
// ============================================================================

const HackerTerminal = memo(({
  data,
  onComplete
}: {
  data: VisitorData;
  onComplete: () => void;
}) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    '> INITIALIZING CONNECTION...',
    '> ACCESSING TARGET DEVICE...',
    '> ████████████████████ 100%',
    '> ',
    '> ⚠️  TARGET ACQUIRED ⚠️',
    '> ',
    `> 🖥️  BROWSER: ${data.browser}`,
    `> 💻 OS: ${data.os}`,
    `> 📐 SCREEN: ${data.screenSize}`,
    `> 🌍 TIMEZONE: ${data.timezone}`,
    `> 🗣️  LANGUAGE: ${data.language}`,
    `> 🧠 CPU CORES: ${data.hardwareConcurrency}`,
    `> 💾 RAM: ${data.deviceMemory}`,
    `> 📡 CONNECTION: ${data.connectionType}`,
    `> 🔗 REFERRER: ${data.referrer.slice(0, 30)}${data.referrer.length > 30 ? '...' : ''}`,
    `> 🍪 COOKIES: ${data.cookiesEnabled ? 'ENABLED' : 'DISABLED'}`,
    `> 👆 TOUCH: ${data.touchSupport ? 'YES' : 'NO'}`,
    '> ',
    '> 🔓 ACCESS GRANTED',
    '> ',
    '> Just kidding! 😄',
    '> This is what ANY website can see.',
    '> Stay safe online! 🛡️',
  ];

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Type out lines
  useEffect(() => {
    if (currentIndex < terminalLines.length) {
      const delay = terminalLines[currentIndex].includes('████') ? 800 :
        terminalLines[currentIndex] === '> ' ? 200 :
          terminalLines[currentIndex].includes('Just kidding') ? 1000 : 80;

      const timeout = setTimeout(() => {
        setLines(prev => [...prev, terminalLines[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      const completeTimeout = setTimeout(onComplete, 2000);
      return () => clearTimeout(completeTimeout);
    }
  }, [currentIndex, terminalLines, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        {/* Terminal Header */}
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-sm ml-2 font-mono">visitor_scan.sh</span>
        </div>

        {/* Terminal Body */}
        <div className="bg-gray-900 rounded-b-lg p-4 font-mono text-sm min-h-[400px] max-h-[70vh] overflow-y-auto">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                ${line.includes('⚠️') ? 'text-red-400 font-bold' : ''}
                ${line.includes('🔓') || line.includes('Just kidding') ? 'text-green-400' : ''}
                ${line.includes('Stay safe') ? 'text-cyan-400' : ''}
                ${!line.includes('⚠️') && !line.includes('🔓') && !line.includes('Just kidding') && !line.includes('Stay safe') ? 'text-green-500' : ''}
                leading-relaxed
              `}
            >
              {line}
            </motion.div>
          ))}

          {/* Blinking cursor */}
          {currentIndex < terminalLines.length && (
            <span className={`text-green-500 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
              ▋
            </span>
          )}
        </div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onComplete}
          className="mt-4 text-gray-500 hover:text-white transition-colors text-sm font-mono"
        >
          [PRESS TO SKIP]
        </motion.button>
      </div>
    </motion.div>
  );
});

HackerTerminal.displayName = 'HackerTerminal';

// ============================================================================
// SOCIAL LINK COMPONENT
// ============================================================================

const SocialLink = memo(({
  href,
  icon: Icon,
  label,
  color
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`
      flex items-center gap-3 px-5 py-3.5 rounded-2xl
      bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
      border border-gray-200/50 dark:border-gray-700/50
      shadow-sm hover:shadow-lg transition-all duration-300
      group
    `}
  >
    <div className={`p-2 rounded-xl ${color} transition-transform group-hover:scale-110`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="font-medium text-gray-800 dark:text-gray-200 flex-1">
      {label}
    </span>
    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.a>
));

SocialLink.displayName = 'SocialLink';

// ============================================================================
// DATA CARD COMPONENT
// ============================================================================

const DataCard = memo(({
  icon: Icon,
  label,
  value,
  delay
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring' }}
    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-xs"
  >
    <Icon className="w-3.5 h-3.5 text-gray-500" />
    <span className="text-gray-500">{label}:</span>
    <span className="font-mono text-gray-700 dark:text-gray-300 truncate">{value}</span>
  </motion.div>
));

DataCard.displayName = 'DataCard';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InstagramLinkPage = () => {
  const [showTerminal, setShowTerminal] = useState(true);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  // Collect visitor data on mount
  useEffect(() => {
    setVisitorData(collectVisitorData());
  }, []);

  // Handle terminal complete
  const handleTerminalComplete = useCallback(() => {
    setShowTerminal(false);
    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6'],
    });
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dark', newValue);
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  }, []);

  const socialLinks = [
    { href: info.github, icon: Github, label: 'GitHub', color: 'bg-gray-900 dark:bg-gray-700' },
    { href: info.linkedin, icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-600' },
    { href: info.instagram, icon: Instagram, label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
    { href: `mailto:${info.email}`, icon: Mail, label: 'Email Me', color: 'bg-green-600' },
  ];

  return (
    <>
      {/* Hacker Terminal Intro */}
      <AnimatePresence>
        {showTerminal && visitorData && (
          <HackerTerminal data={visitorData} onComplete={handleTerminalComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!showTerminal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500"
          >
            {/* Subtle Grid Pattern */}
            <div
              className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Top Bar */}
            <div className="fixed top-4 right-4 z-40 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDataPanel(prev => !prev)}
                className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                {isDark ? (
                  <span className="text-xl">☀️</span>
                ) : (
                  <span className="text-xl">🌙</span>
                )}
              </motion.button>
            </div>

            {/* Visitor Data Panel */}
            <AnimatePresence>
              {showDataPanel && visitorData && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-20 right-4 z-30 p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-xs"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Your Exposed Data
                    </span>
                  </div>
                  <div className="space-y-2">
                    <DataCard icon={Monitor} label="Browser" value={visitorData.browser} delay={0} />
                    <DataCard icon={Cpu} label="OS" value={visitorData.os} delay={0.05} />
                    <DataCard icon={Monitor} label="Screen" value={visitorData.screenSize} delay={0.1} />
                    <DataCard icon={Clock} label="Timezone" value={visitorData.timezone} delay={0.15} />
                    <DataCard icon={Globe2} label="Language" value={visitorData.language} delay={0.2} />
                    <DataCard icon={Wifi} label="Connection" value={visitorData.connectionType} delay={0.25} />
                  </div>
                  <p className="mt-3 text-[10px] text-gray-500 dark:text-gray-400">
                    💡 No data is stored. This is just a demo!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 py-16 min-h-screen flex flex-col justify-center">
              {/* Profile Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-10"
              >
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="relative inline-block mb-6"
                >
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full animate-pulse opacity-75 blur-sm" />
                  <img
                    src="/assets/profile.jpg"
                    alt={info.name}
                    className="relative w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center"
                  >
                    <Terminal className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {info.name}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 dark:text-gray-400 font-medium mb-4"
                >
                  {info.nick}
                </motion.p>

                {/* Fun tagline */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20"
                >
                  <Skull className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Friendly Hacker • Creative Coder
                  </span>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-3 mb-10"
              >
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <SocialLink {...link} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Fun Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-3 gap-4 mb-10"
              >
                {[
                  { emoji: '☕', value: '∞', label: 'Coffees' },
                  { emoji: '🐛', value: '404', label: 'Bugs Fixed' },
                  { emoji: '💻', value: '24/7', label: 'Coding' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="text-center p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="text-2xl mb-1">{stat.emoji}</div>
                    <div className="font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Explore Portfolio
                </Link>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-center text-xs text-gray-400 mt-10"
              >
                Made with <Heart className="w-3 h-3 inline text-red-500" /> and a bit of chaos
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstagramLinkPage;
