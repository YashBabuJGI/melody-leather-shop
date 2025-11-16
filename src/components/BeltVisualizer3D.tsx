import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

interface BeltVisualizer3DProps {
  strapImage: string;
  buckleImage: string;
  gender: 'male' | 'female';
}

function BeltModel({ strapImage, buckleImage }: { strapImage: string; buckleImage: string }) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Belt Strap - positioned at waist */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 0.15, 0.05]} />
        <meshStandardMaterial 
          color="#4a3728"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Belt Buckle */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.25, 0.2, 0.05]} />
        <meshStandardMaterial 
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function PersonModel({ gender }: { gender: 'male' | 'female' }) {
  const bodyColor = gender === 'male' ? '#8b7355' : '#d4a574';
  
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={gender === 'male' ? [0.8, 1.2, 0.4] : [0.7, 1.2, 0.35]} />
        <meshStandardMaterial color={gender === 'male' ? '#2c3e50' : '#e8b4b8'} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.18, -0.7, 0]}>
        <cylinderGeometry args={[0.15, 0.13, 1, 16]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      <mesh position={[0.18, -0.7, 0]}>
        <cylinderGeometry args={[0.15, 0.13, 1, 16]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.09, 0.9, 16]} />
        <meshStandardMaterial color={gender === 'male' ? '#2c3e50' : '#e8b4b8'} />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.09, 0.9, 16]} />
        <meshStandardMaterial color={gender === 'male' ? '#2c3e50' : '#e8b4b8'} />
      </mesh>
    </group>
  );
}

function Scene({ strapImage, buckleImage, gender }: BeltVisualizer3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 4]} />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={6}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[0, 3, 2]} intensity={0.5} />
      
      {/* Person Model */}
      <PersonModel gender={gender} />
      
      {/* Belt Model positioned at waist */}
      <BeltModel strapImage={strapImage} buckleImage={buckleImage} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#95a5a6" opacity={0.3} transparent />
      </mesh>
    </>
  );
}

export default function BeltVisualizer3D({ strapImage, buckleImage, gender }: BeltVisualizer3DProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-muted to-background">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene strapImage={strapImage} buckleImage={buckleImage} gender={gender} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
