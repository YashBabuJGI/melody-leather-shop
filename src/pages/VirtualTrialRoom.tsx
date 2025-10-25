import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';

const CowboyCharacter = ({ jacket, belt }: { jacket: boolean; belt: boolean }) => {
  return (
    <group>
      {/* Head with cowboy hat */}
      <mesh position={[0, 5.5, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} />
      </mesh>
      
      {/* Cowboy Hat - Always visible */}
      <group position={[0, 6.3, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.4, 32]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.1, 32]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh position={[0, 4.8, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Torso - Western Shirt */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[1.2, 1.1, 3, 32]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-1.4, 3.5, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.28, 0.24, 2.5, 16]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </mesh>
      <mesh position={[1.4, 3.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.28, 0.24, 2.5, 16]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-1.7, 2.3, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      <mesh position={[1.7, 2.3, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Leather Jacket - Conditional */}
      {jacket && (
        <group>
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[1.35, 1.25, 3.2, 32]} />
            <meshStandardMaterial color="#2c1810" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Jacket Collar */}
          <mesh position={[0, 4.9, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
            <meshStandardMaterial color="#2c1810" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Sleeves */}
          <mesh position={[-1.4, 3.5, 0]} rotation={[0, 0, Math.PI / 8]}>
            <cylinderGeometry args={[0.32, 0.28, 2.5, 16]} />
            <meshStandardMaterial color="#2c1810" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[1.4, 3.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <cylinderGeometry args={[0.32, 0.28, 2.5, 16]} />
            <meshStandardMaterial color="#2c1810" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Zipper detail */}
          <mesh position={[0, 3.5, 1.35]}>
            <boxGeometry args={[0.08, 3, 0.05]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}
      
      {/* Legs - Jeans */}
      <mesh position={[-0.4, 0.8, 0]}>
        <cylinderGeometry args={[0.36, 0.32, 3.2, 16]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
      </mesh>
      <mesh position={[0.4, 0.8, 0]}>
        <cylinderGeometry args={[0.36, 0.32, 3.2, 16]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
      </mesh>
      
      {/* Belt - Conditional */}
      {belt && (
        <group>
          <mesh position={[0, 2.05, 0]}>
            <cylinderGeometry args={[1.12, 1.12, 0.15, 32]} />
            <meshStandardMaterial color="#3d2817" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Belt Buckle */}
          <mesh position={[0, 2.05, 1.12]}>
            <boxGeometry args={[0.35, 0.25, 0.06]} />
            <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>
      )}
      
      {/* Boots */}
      <mesh position={[-0.4, -0.6, 0.15]}>
        <boxGeometry args={[0.4, 0.5, 0.7]} />
        <meshStandardMaterial color="#3d2817" roughness={0.6} />
      </mesh>
      <mesh position={[0.4, -0.6, 0.15]}>
        <boxGeometry args={[0.4, 0.5, 0.7]} />
        <meshStandardMaterial color="#3d2817" roughness={0.6} />
      </mesh>
      
      {/* Platform */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
    </group>
  );
};

export default function VirtualTrialRoom() {
  const [selectedItems, setSelectedItems] = useState({
    jacket: false,
    belt: false,
  });

  const jackets = products.filter(p => p.category === 'jacket').slice(0, 3);
  const belts = products.filter(p => p.category === 'belt').slice(0, 3);

  const toggleItem = (item: 'jacket' | 'belt') => {
    setSelectedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
    toast.success(`${item.charAt(0).toUpperCase() + item.slice(1)} ${!selectedItems[item] ? 'added' : 'removed'}`);
  };

  const resetCowboy = () => {
    setSelectedItems({ jacket: false, belt: false });
    toast.info('Outfit reset to default');
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Virtual Trial Room</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click on items to dress up your cowboy. Drag to rotate the view and see every angle.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Cowboy Character */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-luxury overflow-hidden" style={{ height: '600px' }}>
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 4, 8]} />
                <OrbitControls 
                  enablePan={false}
                  minDistance={5}
                  maxDistance={12}
                  maxPolarAngle={Math.PI / 2}
                />
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
                <spotLight position={[-10, 10, -5]} angle={0.3} penumbra={1} intensity={0.6} castShadow />
                <Environment preset="sunset" />
                <CowboyCharacter 
                  jacket={selectedItems.jacket}
                  belt={selectedItems.belt}
                />
              </Canvas>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button onClick={resetCowboy} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Outfit
              </Button>
              <Button className="flex-1" variant="default">
                <Download className="mr-2 h-4 w-4" />
                Save Look
              </Button>
            </div>
          </div>

          {/* Item Selection Panel */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-xl font-bold mb-4">Leather Jackets</h3>
              <div className="space-y-3">
                {jackets.map(product => (
                  <button
                    key={product.id}
                    onClick={() => toggleItem('jacket')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedItems.jacket 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">${product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-xl font-bold mb-4">Premium Belts</h3>
              <div className="space-y-3">
                {belts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => toggleItem('belt')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedItems.belt 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">${product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
