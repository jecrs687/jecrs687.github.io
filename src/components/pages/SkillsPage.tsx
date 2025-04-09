import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { FaMedal, FaLeaf, FaCode, FaServer, FaDatabase, FaTools } from 'react-icons/fa';

interface Skill {
  name: string;
  percent: number;
}

interface SkillsData {
  skills: {
    [key: string]: Skill[];
  };
}

// Category icons mapping
const categoryIcons: {[key: string]: any} = {
  'Frontend': FaCode,
  'Backend': FaServer,
  'Database': FaDatabase,
  'DevOps': FaTools,
  // Add more mappings as needed
};

// Get default icon if not found in mapping
const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || FaLeaf;
};

const SkillsPage = ({ data }: { data: SkillsData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animateChart, setAnimateChart] = useState(false);
  const categories = Object.keys(data.skills);

  // Trigger chart animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Create combined data for radar chart
  const radarData = categories.map(category => {
    const skills = data.skills[category];
    const avgPercent = skills.reduce((sum, skill) => sum + skill.percent, 0) / skills.length;
    return {
      subject: category,
      A: avgPercent,
      fullMark: 100
    };
  });

  const handleCategorySelect = (category: string) => {
    // If already selected, deselect
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      // Add a slight delay before showing skills for animation purposes
      setTimeout(() => {
        setSelectedCategory(category);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-matcha-50/30 to-gray-100 dark:from-gray-900 dark:via-matcha-900/10 dark:to-gray-800 pt-8 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background bamboo pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2384cc16' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm20 0l2.83-2.83 1.41 1.41L21.41 4.24h-1.41V3.07zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM20 7.93l2.83-2.83 1.41 1.41-2.83 2.83H20V7.93zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      ></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            className="inline-block mb-4"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-matcha-400 to-matcha-600 flex items-center justify-center text-white shadow-lg">
              <FaMedal className="text-3xl" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-matcha-600 to-matcha-400 bg-clip-text text-transparent font-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Skill Dōjō
          </motion.h1>
          
          <motion.div
            className="flex items-center justify-center mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-matcha-500/50 to-transparent w-24 sm:w-48"></div>
            <FaLeaf className="mx-4 text-matcha-500" />
            <div className="h-px bg-gradient-to-r from-transparent via-matcha-500/50 to-transparent w-24 sm:w-48"></div>
          </motion.div>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-matcha-600 dark:text-matcha-400">修行</span> - A journey of continuous learning and improvement
          </motion.p>
        </div>

        {/* Skills Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Radar Chart */}
          <motion.div 
            className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <span className="inline-block w-1 h-6 bg-matcha-500 mr-3"></span>
                Skill Proficiency Map
              </h2>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category, index) => {
                  const Icon = getCategoryIcon(category);
                  
                  return (
                    <motion.button
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center 
                        ${selectedCategory === category
                          ? 'bg-matcha-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-matcha-100 dark:hover:bg-matcha-900/30 hover:text-matcha-700 dark:hover:text-matcha-400'
                        }`}
                      onClick={() => handleCategorySelect(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                    >
                      <Icon className="mr-2 text-xs" />
                      {category}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#cbd5e0" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" stroke="#718096" />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#84cc16"
                      fill="#84cc16"
                      fillOpacity={0.6}
                      animationBegin={300}
                      animationDuration={1500}
                      isAnimationActive={animateChart}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
          
          {/* Skill Distribution Pie Chart */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="p-6 h-full">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <span className="inline-block w-1 h-6 bg-matcha-500 mr-3"></span>
                Skill Distribution
              </h2>
              
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories.map((category) => ({
                        name: category,
                        value: data.skills[category].length,
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name}) => name}
                      isAnimationActive={animateChart}
                      animationBegin={300}
                      animationDuration={1500}
                    >
                      {categories.map((_, index) => {
                        // Green color palette for zen/matcha theme
                        const colors = [
                          '#84cc16', // matcha-500
                          '#65a30d', // matcha-600
                          '#4d7c0f', // matcha-700
                          '#3f6212', // matcha-800
                          '#a3e635', // matcha-400
                          '#bef264', // matcha-300
                        ];
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={colors[index % colors.length]} 
                            strokeWidth={2}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: <span className="font-medium text-matcha-600 dark:text-matcha-400">
                    {Object.values(data.skills).reduce((acc, skills) => acc + skills.length, 0)}
                  </span> skills across <span className="font-medium text-matcha-600 dark:text-matcha-400">
                    {categories.length}
                  </span> categories
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Selected Category Skills */}
        <AnimatePresence mode="wait">
          {selectedCategory ? (
            <motion.div 
              key="selectedSkills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="inline-block w-1.5 h-8 bg-matcha-500 mr-4"></span>
                  {selectedCategory} Skills
                </h2>
                
                <motion.button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-matcha-100 dark:hover:bg-matcha-900/30 text-sm font-medium transition-all flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Categories
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.skills[selectedCategory].map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="allCategories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category, categoryIndex) => {
                const Icon = getCategoryIcon(category);
                
                return (
                  <motion.div
                    key={category}
                    className="rounded-xl overflow-hidden shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + categoryIndex * 0.1 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-matcha-100 dark:bg-matcha-900/30 flex items-center justify-center mr-3">
                          <Icon className="text-matcha-600 dark:text-matcha-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {category}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {data.skills[category].slice(0, 4).map((skill, index) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                            className="flex items-center"
                          >
                            <div className="w-8 h-8 rounded-full bg-matcha-100 dark:bg-matcha-900/30 flex items-center justify-center mr-3">
                              <span className="font-jp text-matcha-600 dark:text-matcha-400 text-sm font-medium">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                                <span className="text-sm font-medium text-matcha-600 dark:text-matcha-400">{skill.percent}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div
                                  className="bg-matcha-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.percent}%` }}
                                  transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {data.skills[category].length > 4 && (
                          <motion.button
                            className="text-sm text-matcha-600 dark:text-matcha-400 font-medium mt-2 hover:text-matcha-700 dark:hover:text-matcha-300 transition-colors flex items-center"
                            onClick={() => setSelectedCategory(category)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View all {data.skills[category].length} skills
                            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const props = useSpring({
    from: { number: 0 },
    to: { number: skill.percent },
    delay: index * 100,
    config: { mass: 1, tension: 30, friction: 10 }
  });

  // Color gradient from light green to dark green based on matcha theme
  const calculateColor = (percent: number) => {
    if (percent < 33) {
      return '#bef264'; // matcha-300
    } else if (percent < 66) {
      return '#84cc16'; // matcha-500
    } else {
      return '#4d7c0f'; // matcha-700
    }
  };

  return (
    <motion.div
      className="bg-gray-50/80 dark:bg-gray-700/80 rounded-lg p-5 transform transition-all border border-gray-200 dark:border-gray-600"
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        borderColor: '#84cc16'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{skill.name}</h4>
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          skill.percent >= 80 
            ? 'bg-matcha-100 text-matcha-800 dark:bg-matcha-900/50 dark:text-matcha-300' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {skill.percent >= 80 ? 'Master' : 'Learning'}
        </span>
      </div>
      
      <div className="relative h-32 flex items-center justify-center">
        {/* Base circle */}
        <svg className="w-28 h-28" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            stroke="rgba(0,0,0,0.1)"
            className="dark:stroke-gray-600"
          />
          
          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={calculateColor(skill.percent)}
            strokeDasharray={`${skill.percent * 2.83} 283`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: "0 283" }}
            animate={{ strokeDasharray: `${skill.percent * 2.83} 283` }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />
        </svg>
        
        {/* Percentage display */}
        <animated.div 
          className="absolute text-2xl font-bold flex flex-col items-center"
        >
          <animated.span className="text-gray-900 dark:text-white">
            {props.number.to(n => `${Math.floor(n)}`)}
          </animated.span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">percent</span>
        </animated.div>
      </div>
      
      {/* Linear progress bar */}
      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Beginner</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Expert</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: calculateColor(skill.percent) }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.percent}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsPage;
