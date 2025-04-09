import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CubeProps {
  color: string;
  wireframe?: boolean;
  opacity?: number;
  speed?: number;
}

const RotatingCube = ({ color = '#38bff8', wireframe = false, opacity = 1, speed = 1 }: CubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  return (
    <Box ref={meshRef} args={[3, 3, 3]}>
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe} 
        transparent={opacity < 1}
        opacity={opacity} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </Box>
  );
};

const Cube = (props: CubeProps) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <RotatingCube {...props} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default Cube;
