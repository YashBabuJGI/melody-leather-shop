import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';

const Mannequin = ({ jacket, belt, hat }: { jacket: boolean; belt: boolean; hat: boolean }) => {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 5.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Hat */}
      {hat && (
        <mesh position={[0, 6.2, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
      )}
      
      {/* Torso */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[1.2, 1, 3, 32]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Jacket */}
      {jacket && (
        <>
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[1.3, 1.1, 3.2, 32]} />
            <meshStandardMaterial color="#4a3728" roughness={0.6} metalness={0.3} />
          </mesh>
          {/* Sleeves */}
          <mesh position={[-1.5, 3.5, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.3, 0.25, 2.5, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[1.5, 3.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.3, 0.25, 2.5, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.6} metalness={0.3} />
          </mesh>
        </>
      )}
      
      {/* Legs */}
      <mesh position={[-0.4, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 3.2, 16]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      <mesh position={[0.4, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 3.2, 16]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      
      {/* Belt */}
      {belt && (
        <>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.15, 32]} />
            <meshStandardMaterial color="#3d2817" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Belt Buckle */}
          <mesh position={[0, 2, 1.05]}>
            <boxGeometry args={[0.3, 0.2, 0.05]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}
      
      {/* Platform */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
    </group>
  );
};

export default function VirtualTrialRoom() {
  const [selectedItems, setSelectedItems] = useState({
    jacket: false,
    belt: false,
    hat: false,
  });

  const jackets = products.filter(p => p.category === 'jacket').slice(0, 2);
  const belts = products.filter(p => p.category === 'belt').slice(0, 2);

  const toggleItem = (item: 'jacket' | 'belt' | 'hat') => {
    setSelectedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
    toast.success(`${item.charAt(0).toUpperCase() + item.slice(1)} ${!selectedItems[item] ? 'added' : 'removed'}`);
  };

  const resetMannequin = () => {
    setSelectedItems({ jacket: false, belt: false, hat: false });
    toast.info('Mannequin reset');
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Virtual Trial Room</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click on items below to see how they look together. Drag to rotate the view.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Mannequin */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-luxury overflow-hidden" style={{ height: '600px' }}>
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 4, 10]} />
                <OrbitControls 
                  enablePan={false}
                  minDistance={5}
                  maxDistance={15}
                  maxPolarAngle={Math.PI / 2}
                />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <spotLight position={[-10, 10, -5]} angle={0.3} penumbra={1} intensity={0.5} castShadow />
                <Environment preset="warehouse" />
                <Mannequin 
                  jacket={selectedItems.jacket}
                  belt={selectedItems.belt}
                  hat={selectedItems.hat}
                />
              </Canvas>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button onClick={resetMannequin} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
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
              <h3 className="text-xl font-bold mb-4">Belts</h3>
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

            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-xl font-bold mb-4">Accessories</h3>
              <button
                onClick={() => toggleItem('hat')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedItems.hat 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-2xl">
                  🤠
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm">Leather Cowboy Hat</p>
                  <p className="text-xs text-muted-foreground">$149</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
