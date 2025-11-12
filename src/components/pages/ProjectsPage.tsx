import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { FaLink, FaCode, FaArrowRight, FaPalette } from 'react-icons/fa';
import { useScene } from '../../contexts/SceneContext';

interface Project {
  name: string;
  link: string;
  description?: string;
  technologies?: string[];
  category?: string;
  image?: string;
}

interface ProjectsData {
  projects: {
    smallProjects: Project[];
    bigProjects?: Project[];
  };
  palette?: { primary: string; secundary: string; third: string; }[];
}

const ProjectsPage = ({ data }: { data: ProjectsData }) => {
  const { setCurrentScene } = useScene();
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Get all projects from both small and big projects
  const allProjects = [...(data.projects.smallProjects || [])];
  const bigProjects = data.projects.bigProjects || [];
  const palette = data.palette;

  // Set the scene to studio
  useEffect(() => {
    setCurrentScene('studio');
  }, [setCurrentScene]);

  // Extract categories
  useEffect(() => {
    const cats = ["all"];
    allProjects.forEach(project => {
      if (project.category && !cats.includes(project.category)) {
        cats.push(project.category);
      }
    });
    setCategories(cats);
  }, [allProjects]);

  // Filter projects by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, allProjects]);

  return (
    <div className="min-h-screen relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-project-grid bg-repeat"></div>
        <motion.div
          className="absolute top-0 -left-32 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-cyber-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 right-0 w-80 h-80 bg-gradient-to-br from-sakura-500/20 to-primary-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 py-16 px-4 sm:px-6 lg:px-8"
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
              <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-neon-sakura flex items-center justify-center text-white transform rotate-6">
                <FaPalette className="text-3xl" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-sakura-400 bg-clip-text text-transparent font-heading">
              Creative Studio
            </h1>

            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent w-24 sm:w-48"></div>
              <div className="mx-4 text-primary-500">✦</div>
              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent w-24 sm:w-48"></div>
            </motion.div>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A showcase of my creative work and technical projects
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div
            className="mb-12 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-700 p-1 flex flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                      ? 'bg-primary-500 text-white shadow-neon-sakura'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  index={index}
                  palette={palette}
                  isHovered={hoveredProject === project.name}
                  onHover={() => setHoveredProject(project.name)}
                  onLeave={() => setHoveredProject(null)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Featured Projects Section */}
          {bigProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-24"
            >
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sakura-500 to-primary-500 bg-clip-text text-transparent mb-4">
                  Featured Works
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-sakura-400 to-primary-400 mx-auto rounded-full"></div>
              </motion.div>

              <div className="space-y-16">
                {bigProjects.map((project, index) => (
                  <FeaturedProjectCard
                    key={project.name}
                    project={project}
                    index={index}
                    palette={palette}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ProjectCard = ({
  project,
  index,
  palette,
  isHovered,
  onHover,
  onLeave
}: {
  project: Project;
  index: number;
  palette: { primary: string; secundary: string; third: string; }[];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  // Get a color from the palette based on the index
  const paletteIndex = index % palette.length;
  const colorScheme = palette[paletteIndex];

  const tilt = useSpring({
    transform: isHovered ? 'scale(1.03) translateY(-10px)' : 'scale(1) translateY(0px)',
    boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    config: { tension: 300, friction: 20 }
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex"
    >
      <animated.div
        style={tilt}
        className="relative h-72 rounded-xl overflow-hidden cursor-pointer w-full backdrop-blur-sm border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={() => window.open(`https://jecrs687.github.io${project.link}`, '_blank')}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 w-full h-2/3"
          style={{
            background: project.image
              ? `url(${project.image}) center/cover no-repeat`
              : `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secundary}, ${colorScheme.third})`,
          }}
        />

        {/* Category tag */}
        {project.category && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 shadow-sm">
            {project.category}
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {project.description || `A creative project showcasing my work in ${project.category || 'development'}.`}
          </p>

          <div className="flex justify-between items-center">
            {/* Tech stack pills */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 2).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 2 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    +{project.technologies.length - 2}
                  </span>
                )}
              </div>
            )}

            <motion.div
              className="text-primary-600 dark:text-primary-400 flex items-center text-sm font-medium"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span>View project</span>
              <FaArrowRight className="ml-2" />
            </motion.div>
          </div>
        </div>
      </animated.div>
    </motion.div>
  );
};

const FeaturedProjectCard = ({
  project,
  index,
  palette
}: {
  project: Project;
  index: number;
  palette: { primary: string; secundary: string; third: string; }[];
}) => {
  const isEven = index % 2 === 0;
  const paletteIndex = index % palette.length;
  const colorScheme = palette[paletteIndex];

  const [hovered, setHovered] = useState(false);

  const spring = useSpring({
    transform: hovered ? 'translateY(-10px)' : 'translateY(0px)',
    boxShadow: hovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    config: { tension: 300, friction: 20 }
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        <animated.div
          style={spring}
          className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden"
        >
          <div
            className="absolute inset-0 transform hover:scale-105 transition-transform duration-700 ease-in-out"
            style={{
              background: project.image
                ? `url(${project.image}) center/cover no-repeat`
                : `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secundary})`,
            }}
          />

          {!project.image && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                  <FaCode className="text-5xl text-white mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                </div>
              </motion.div>
            </div>
          )}
        </animated.div>

        <div className="lg:w-1/2 p-8 flex flex-col justify-between">
          {project.category && (
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                {project.category}
              </span>
            </div>
          )}

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{project.name}</h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {project.description || `An impressive featured project that showcases my skills in ${project.category || 'development'}. This work represents some of my best efforts and technical capabilities.`}
          </p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Technologies:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={`${project.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-500 to-sakura-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.03]"
          >
            <FaLink className="mr-2" /> Explore Project
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsPage;