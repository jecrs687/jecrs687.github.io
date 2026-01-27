import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { FaMedal, FaLeaf, FaCode, FaServer, FaDatabase, FaTools } from 'react-icons/fa';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Animation';
import type { IconType } from 'react-icons';

interface Skill {
  name: string;
  percent: number;
}

interface SkillsData {
  skills: {
    [key: string]: Skill[];
  };
}

interface SkillsPageProps {
  data: SkillsData;
}

const CATEGORY_ICONS: Record<string, IconType> = {
  Frontend: FaCode,
  Backend: FaServer,
  Database: FaDatabase,
  DevOps: FaTools,
};

const MATCHA_COLORS = ['#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#a3e635', '#bef264'];

const getCategoryIcon = (category: string): IconType => CATEGORY_ICONS[category] ?? FaLeaf;

const getSkillColor = (percent: number): string => {
  if (percent < 33) return '#bef264';
  if (percent < 66) return '#84cc16';
  return '#4d7c0f';
};

const calculateRadarData = (skills: SkillsData['skills'], categories: string[]) =>
  categories.map((category) => {
    const categorySkills = skills[category];
    const avgPercent = categorySkills.reduce((sum, skill) => sum + skill.percent, 0) / categorySkills.length;
    return { subject: category, A: avgPercent, fullMark: 100 };
  });

const calculateTotalSkills = (skills: SkillsData['skills']): number =>
  Object.values(skills).reduce((acc, categorySkills) => acc + categorySkills.length, 0);

const PageHeader: React.FC = () => (
  <div className="text-center mb-16">
    <motion.div
      className="inline-block mb-4"
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-matcha-400 to-matcha-600 flex items-center justify-center text-white shadow-lg">
        <FaMedal className="text-3xl" />
      </div>
    </motion.div>

    <FadeIn delay={0.2}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-matcha-600 to-matcha-400 bg-clip-text text-transparent font-heading">
        Skill Dōjō
      </h1>
    </FadeIn>

    <FadeIn delay={0.3}>
      <div className="flex items-center justify-center mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-matcha-500/50 to-transparent w-24 sm:w-48" />
        <FaLeaf className="mx-4 text-matcha-500" />
        <div className="h-px bg-gradient-to-r from-transparent via-matcha-500/50 to-transparent w-24 sm:w-48" />
      </div>
    </FadeIn>

    <FadeIn delay={0.4}>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        <span className="text-matcha-600 dark:text-matcha-400">修行</span> - A journey of continuous
        learning and improvement
      </p>
    </FadeIn>
  </div>
);

interface CategoryButtonProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isSelected, onClick, index }) => {
  const Icon = getCategoryIcon(category);

  return (
    <motion.button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${isSelected
          ? 'bg-matcha-500 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-matcha-100 dark:hover:bg-matcha-900/30 hover:text-matcha-700 dark:hover:text-matcha-400'
        }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
    >
      <Icon className="mr-2 text-xs" />
      {category}
    </motion.button>
  );
};

interface RadarChartSectionProps {
  data: ReturnType<typeof calculateRadarData>;
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
  isAnimating: boolean;
}

const RadarChartSection: React.FC<RadarChartSectionProps> = ({
  data,
  categories,
  selectedCategory,
  onCategorySelect,
  isAnimating,
}) => (
  <FadeIn delay={0.5}>
    <Card className="lg:col-span-2" variant="glass">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="inline-block w-1 h-6 bg-matcha-500 mr-3" />
          Skill Proficiency Map
        </h2>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category, index) => (
            <CategoryButton
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onClick={() => onCategorySelect(category)}
              index={index}
            />
          ))}
        </div>

        <div className="h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" data={data}>
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
                isAnimationActive={isAnimating}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </FadeIn>
);

interface PieChartSectionProps {
  categories: string[];
  skills: SkillsData['skills'];
  isAnimating: boolean;
}

const PieChartSection: React.FC<PieChartSectionProps> = ({ categories, skills, isAnimating }) => {
  const pieData = useMemo(
    () => categories.map((category) => ({ name: category, value: skills[category].length })),
    [categories, skills]
  );

  return (
    <FadeIn delay={0.7}>
      <Card variant="glass">
        <CardContent className="p-6 h-full">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="inline-block w-1 h-6 bg-matcha-500 mr-3" />
            Skill Distribution
          </h2>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name }) => name}
                  isAnimationActive={isAnimating}
                  animationBegin={300}
                  animationDuration={1500}
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={MATCHA_COLORS[index % MATCHA_COLORS.length]} strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total:{' '}
              <span className="font-medium text-matcha-600 dark:text-matcha-400">
                {calculateTotalSkills(skills)}
              </span>{' '}
              skills across{' '}
              <span className="font-medium text-matcha-600 dark:text-matcha-400">{categories.length}</span>{' '}
              categories
            </p>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const props = useSpring({
    from: { number: 0 },
    to: { number: skill.percent },
    delay: index * 100,
    config: { mass: 1, tension: 30, friction: 10 },
  });

  const color = getSkillColor(skill.percent);

  return (
    <motion.div
      className="bg-gray-50/80 dark:bg-gray-700/80 rounded-lg p-5 transform transition-all border border-gray-200 dark:border-gray-600"
      whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', borderColor: '#84cc16' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{skill.name}</h4>
        <Badge variant={skill.percent >= 80 ? 'default' : 'secondary'}>
          {skill.percent >= 80 ? 'Master' : 'Learning'}
        </Badge>
      </div>

      <div className="relative h-32 flex items-center justify-center">
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
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={`${skill.percent * 2.83} 283`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: '0 283' }}
            animate={{ strokeDasharray: `${skill.percent * 2.83} 283` }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />
        </svg>

        <animated.div className="absolute text-2xl font-bold flex flex-col items-center">
          <animated.span className="text-gray-900 dark:text-white">
            {props.number.to((n) => `${Math.floor(n)}`)}
          </animated.span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">percent</span>
        </animated.div>
      </div>

      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Beginner</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Expert</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.percent}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface CategoryCardProps {
  category: string;
  skills: Skill[];
  index: number;
  onViewAll: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, skills, index, onViewAll }) => {
  const Icon = getCategoryIcon(category);

  return (
    <StaggerItem index={index}>
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-matcha-100 dark:bg-matcha-900/30 flex items-center justify-center mr-3">
              <Icon className="text-matcha-600 dark:text-matcha-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category}</h3>
          </div>

          <div className="space-y-4">
            {skills.slice(0, 4).map((skill, skillIndex) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1 + skillIndex * 0.1 }}
                className="flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-matcha-100 dark:bg-matcha-900/30 flex items-center justify-center mr-3">
                  <span className="font-jp text-matcha-600 dark:text-matcha-400 text-sm font-medium">
                    {skillIndex + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {skill.name}
                    </span>
                    <span className="text-sm font-medium text-matcha-600 dark:text-matcha-400">
                      {skill.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-matcha-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percent}%` }}
                      transition={{ duration: 1, delay: 1.2 + skillIndex * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {skills.length > 4 && (
              <motion.button
                className="text-sm text-matcha-600 dark:text-matcha-400 font-medium mt-2 hover:text-matcha-700 dark:hover:text-matcha-300 transition-colors flex items-center"
                onClick={onViewAll}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                View all {skills.length} skills
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            )}
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  );
};

interface SelectedCategoryViewProps {
  category: string;
  skills: Skill[];
  onClose: () => void;
}

const SelectedCategoryView: React.FC<SelectedCategoryViewProps> = ({ category, skills, onClose }) => (
  <motion.div
    key="selectedSkills"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="mb-12" variant="glass">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="inline-block w-1.5 h-8 bg-matcha-500 mr-4" />
            {category} Skills
          </h2>
          <Button variant="ghost" onClick={onClose}>
            View All Categories
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const SkillsPage: React.FC<SkillsPageProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const categories = useMemo(() => Object.keys(data.skills), [data.skills]);
  const radarData = useMemo(() => calculateRadarData(data.skills, categories), [data.skills, categories]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleCloseSelection = useCallback(() => setSelectedCategory(null), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-matcha-50/30 to-gray-100 dark:from-gray-900 dark:via-matcha-900/10 dark:to-gray-800 pt-8 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2384cc16' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm20 0l2.83-2.83 1.41 1.41L21.41 4.24h-1.41V3.07zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM20 7.93l2.83-2.83 1.41 1.41-2.83 2.83H20V7.93zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <PageHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <RadarChartSection
            data={radarData}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            isAnimating={isAnimating}
          />
          <PieChartSection categories={categories} skills={data.skills} isAnimating={isAnimating} />
        </div>

        <AnimatePresence mode="wait">
          {selectedCategory ? (
            <SelectedCategoryView
              key={selectedCategory}
              category={selectedCategory}
              skills={data.skills[selectedCategory]}
              onClose={handleCloseSelection}
            />
          ) : (
            <StaggerContainer key="allCategories" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category}
                  category={category}
                  skills={data.skills[category]}
                  index={index}
                  onViewAll={() => handleCategorySelect(category)}
                />
              ))}
            </StaggerContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillsPage;
