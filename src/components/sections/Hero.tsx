/**
 * Enhanced Hero Section
 * Modern hero with gradient animations and improved copy
 */

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';

interface HeroProps {
    name?: string;
    title?: string;
    subtitle?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    email?: string;
}

export function Hero({
    name = 'Your Name',
    title = 'Full Stack Developer',
    subtitle = 'Building exceptional digital experiences with modern technologies',
    githubUrl,
    linkedinUrl,
    email,
}: HeroProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sakura-50 via-white to-cyber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

            {/* Animated gradient orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.2, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-1/4 right-1/4 w-96 h-96 bg-sakura-300/30 dark:bg-sakura-500/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyber-300/30 dark:bg-cyber-500/10 rounded-full blur-3xl"
            />

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-4xl mx-auto text-center"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-6">
                    <Badge variant="gradient" size="lg" className="inline-flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                        </span>
                        Available for opportunities
                    </Badge>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-bold mb-6"
                >
                    <span className="text-gray-900 dark:text-white">Hi, I'm </span>
                    <span className="bg-gradient-to-r from-sakura-500 to-cyber-500 bg-clip-text text-transparent">
                        {name}
                    </span>
                </motion.h1>

                {/* Title */}
                <motion.h2
                    variants={itemVariants}
                    className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
                >
                    {title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
                >
                    {subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center gap-4 mb-12"
                >
                    <Link to="/projects">
                        <Button size="lg" variant="gradient" className="group">
                            View My Work
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link to="/repositories">
                        <Button size="lg" variant="outline">
                            Explore Code
                        </Button>
                    </Link>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center gap-4"
                >
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </a>
                    )}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </a>
                    )}
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </a>
                    )}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    variants={itemVariants}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-2"
                    >
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
