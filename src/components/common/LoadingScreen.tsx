import { motion } from 'framer-motion';
import { useScene } from '../../contexts/SceneContext';

const LoadingScreen = () => {
  const { currentScene } = useScene();
  
  const sceneMessages = {
    home: "Welcome to my digital world...",
    cyber: "Accessing repository database...",
    dojo: "Training skills visualization...",
    library: "Loading knowledge archives...",
    studio: "Initializing project showcase..."
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="text-center">
        <div className="mb-6">
          <motion.div 
            className="w-20 h-20 mx-auto relative"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {/* Anime-inspired loading icon */}
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-sakura-500"></div>
            <div className="absolute inset-0 rounded-full border-r-4 border-l-4 border-cyber-400" style={{ transform: "rotate(45deg)" }}></div>
          </motion.div>
        </div>
        
        <motion.h2 
          className="text-xl text-gray-800 dark:text-gray-200 font-anime mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {sceneMessages[currentScene]}
        </motion.h2>
        
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-sakura-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;