import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

interface BeltVisualizer3DProps {
  strapImage: string;
  buckleImage: string;
  gender: 'male' | 'female';
}

function BeltModel({ strapImage, buckleImage }: { strapImage: string; buckleImage: string }) {
  // Load textures from the image URLs
  const strapTexture = useLoader(THREE.TextureLoader, strapImage);
  const buckleTexture = useLoader(THREE.TextureLoader, buckleImage);

  // Configure textures for better appearance
  useMemo(() => {
    if (strapTexture) {
      strapTexture.wrapS = THREE.RepeatWrapping;
      strapTexture.wrapT = THREE.ClampToEdgeWrapping;
      strapTexture.repeat.set(3, 1);
    }
    if (buckleTexture) {
      buckleTexture.wrapS = THREE.ClampToEdgeWrapping;
      buckleTexture.wrapT = THREE.ClampToEdgeWrapping;
    }
  }, [strapTexture, buckleTexture]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* Belt Strap - positioned at waist with leather texture */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.15, 0.05]} />
        <meshStandardMaterial 
          map={strapTexture}
          metalness={0.1}
          roughness={0.8}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>
      
      {/* Belt Buckle with actual buckle texture */}
      <mesh position={[0, 0, 0.03]} castShadow>
        <boxGeometry args={[0.25, 0.2, 0.05]} />
        <meshStandardMaterial 
          map={buckleTexture}
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Belt holes for realism */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.026]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function PersonModel({ gender }: { gender: 'male' | 'female' }) {
  const bodyColor = gender === 'male' ? '#c9a68a' : '#e8c5a8';
  const shirtColor = gender === 'male' ? '#2c3e50' : '#f5d0d4';
  
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={gender === 'male' ? [0.8, 1.2, 0.4] : [0.7, 1.2, 0.35]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.18, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 1, 16]} />
        <meshStandardMaterial color="#34495e" roughness={0.7} />
      </mesh>
      <mesh position={[0.18, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 1, 16]} />
        <meshStandardMaterial color="#34495e" roughness={0.7} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.9, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.9, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Scene({ strapImage, buckleImage, gender }: BeltVisualizer3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={2.5}
        maxDistance={7}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 5}
      />
      
      {/* Enhanced Lighting for texture visibility */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />
      <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.6} penumbra={0.5} />
      <pointLight position={[2, 2, 2]} intensity={0.4} />
      
      {/* Person Model */}
      <PersonModel gender={gender} />
      
      {/* Belt Model positioned at waist */}
      <Suspense fallback={null}>
        <BeltModel strapImage={strapImage} buckleImage={buckleImage} />
      </Suspense>
      
      {/* Ground with shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          color="#bdc3c7" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </>
  );
}

export default function BeltVisualizer3D({ strapImage, buckleImage, gender }: BeltVisualizer3DProps) {
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-muted via-background to-muted/50">
      <Canvas 
        shadows 
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        <Suspense fallback={null}>
          <Scene strapImage={strapImage} buckleImage={buckleImage} gender={gender} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 shadow-lg">
        🖱️ Drag to rotate • 🔍 Scroll to zoom
      </div>
      <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50">
        Real Textures
      </div>
    </div>
  );
}
