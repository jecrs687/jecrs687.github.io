import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, Canvas } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

interface HeroBackgroundProps {
  theme: string;
}

const Scene = ({ theme }: { theme: string }) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Set up camera position
  useEffect(() => {
    camera.position.z = 15;
    
    // Add subtle camera movement
    const interval = setInterval(() => {
      camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
      camera.position.y = Math.cos(Date.now() * 0.0005) * 0.5;
      camera.lookAt(0, 0, 0);
    }, 16);

    return () => clearInterval(interval);
  }, [camera]);

  // Animation for our floating elements
  const { scale } = useSpring({
    from: { scale: 0.8 },
    to: { scale: 1 },
    config: {
      mass: 2,
      tension: 120,
      friction: 14
    },
    loop: { reverse: true },
    delay: 1000
  });

  return (
    <group ref={groupRef}>
      {/* Stars background for dark mode */}
      {theme === 'dark' && (
        <Stars 
          radius={50} 
          depth={50} 
          count={1000} 
          factor={4} 
          fade 
          speed={1} 
        />
      )}

      {/* Light mode background elements */}
      {theme !== 'dark' && (
        <>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
        </>
      )}
      
      {/* Dark mode lighting */}
      {theme === 'dark' && (
        <>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#9f7aea" />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="#0ea5e9" />
        </>
      )}

      {/* Floating geometric elements that represent coding/tech */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
        <animated.mesh position={[-4, 2, -5]} scale={scale.to(s => s * 1.5)}>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#ec4899' : '#be185d'} 
            wireframe 
          />
        </animated.mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <animated.mesh position={[5, -2, -10]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0ea5e9' : '#0284c7'} 
            wireframe
          />
        </animated.mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.4} floatIntensity={0.8}>
        <animated.mesh position={[0, -4, -3]} scale={scale.to(s => s * 0.8)}>
          <torusGeometry args={[1, 0.4, 16, 32]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#a855f7' : '#7e22ce'} 
          />
        </animated.mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2}>
        <animated.mesh position={[-6, -3, -8]} scale={scale.to(s => s * 0.9)}>
          <tetrahedronGeometry args={[1]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#84cc16' : '#65a30d'} 
          />
        </animated.mesh>
      </Float>

      {/* Stylistic plane for light mode */}
      {theme !== 'dark' && (
        <mesh position={[0, -5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#f8fafc" 
            transparent={true} 
            opacity={0.6} 
          />
        </mesh>
      )}
    </group>
  );
};

const HeroBackground = ({ theme }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas dpr={[1, 2]}>
        <Scene theme={theme} />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
