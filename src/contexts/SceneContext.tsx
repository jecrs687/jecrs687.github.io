import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type SceneType = 'home' | 'cyber' | 'dojo' | 'library' | 'studio';

interface SceneContextType {
  currentScene: SceneType;
  setCurrentScene: (scene: SceneType) => void;
  sceneTransition: boolean;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export const SceneProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState<SceneType>('home');
  const [sceneTransition, setSceneTransition] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start transition
    setSceneTransition(true);

    // Determine scene based on path
    const path = location.pathname;
    let newScene: SceneType = 'home';

    if (path === '/') {
      newScene = 'home';
    } else if (path === '/repositories') {
      newScene = 'cyber';
    } else if (path === '/skills') {
      newScene = 'dojo';
    } else if (path === '/articles') {
      newScene = 'library';
    } else if (path === '/projects') {
      newScene = 'studio';
    }

    // Apply scene change after short delay for transition
    const timer = setTimeout(() => {
      setCurrentScene(newScene);
      setSceneTransition(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <SceneContext.Provider value={{ currentScene, setCurrentScene, sceneTransition }}>
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = (): SceneContextType => {
  const context = useContext(SceneContext);
  
  if (context === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  
  return context;
};