import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeftRight } from 'lucide-react';
import { Product } from '@/types/product';
import BeltVisualizer3D from './BeltVisualizer3D';

interface BeltStrap {
  id: string;
  name: string;
  material: string;
  color: string;
  price: number;
  width: string;
  image: string;
}

interface BeltCompareProps {
  straps: BeltStrap[];
  buckles: Product[];
  onClose: () => void;
}

interface ComboSelection {
  strap: BeltStrap;
  buckle: Product | null;
  gender: 'male' | 'female';
}

export default function BeltCompareMode({ straps, buckles, onClose }: BeltCompareProps) {
  const [leftCombo, setLeftCombo] = useState<ComboSelection>({
    strap: straps[0],
    buckle: buckles[0] || null,
    gender: 'male',
  });

  const [rightCombo, setRightCombo] = useState<ComboSelection>({
    strap: straps[1] || straps[0],
    buckle: buckles[1] || buckles[0] || null,
    gender: 'male',
  });

  const swapCombos = () => {
    const temp = leftCombo;
    setLeftCombo(rightCombo);
    setRightCombo(temp);
  };

  const calculatePrice = (combo: ComboSelection) => 
    combo.strap.price + (combo.buckle?.price || 0);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="container mx-auto py-8 px-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Compare Belt Combinations</h2>
            <p className="text-muted-foreground">View two configurations side-by-side</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <Button variant="outline" onClick={swapCombos} className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Swap Combinations
          </Button>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Combo */}
          <ComboPanel
            title="Option A"
            combo={leftCombo}
            straps={straps}
            buckles={buckles}
            price={calculatePrice(leftCombo)}
            onStrapChange={(strap) => setLeftCombo({ ...leftCombo, strap })}
            onBuckleChange={(buckle) => setLeftCombo({ ...leftCombo, buckle })}
            onGenderChange={(gender) => setLeftCombo({ ...leftCombo, gender })}
          />

          {/* Right Combo */}
          <ComboPanel
            title="Option B"
            combo={rightCombo}
            straps={straps}
            buckles={buckles}
            price={calculatePrice(rightCombo)}
            onStrapChange={(strap) => setRightCombo({ ...rightCombo, strap })}
            onBuckleChange={(buckle) => setRightCombo({ ...rightCombo, buckle })}
            onGenderChange={(gender) => setRightCombo({ ...rightCombo, gender })}
          />
        </div>

        {/* Price Comparison Summary */}
        <Card className="mt-6 p-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Option A Total</p>
              <p className="text-2xl font-bold">₹{calculatePrice(leftCombo)}</p>
            </div>
            <div className="flex items-center justify-center">
              <Badge variant={calculatePrice(leftCombo) <= calculatePrice(rightCombo) ? "default" : "secondary"} className="text-sm">
                {calculatePrice(leftCombo) === calculatePrice(rightCombo) 
                  ? "Same Price" 
                  : calculatePrice(leftCombo) < calculatePrice(rightCombo)
                    ? `Option A saves ₹${calculatePrice(rightCombo) - calculatePrice(leftCombo)}`
                    : `Option B saves ₹${calculatePrice(leftCombo) - calculatePrice(rightCombo)}`
                }
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Option B Total</p>
              <p className="text-2xl font-bold">₹{calculatePrice(rightCombo)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface ComboPanelProps {
  title: string;
  combo: ComboSelection;
  straps: BeltStrap[];
  buckles: Product[];
  price: number;
  onStrapChange: (strap: BeltStrap) => void;
  onBuckleChange: (buckle: Product) => void;
  onGenderChange: (gender: 'male' | 'female') => void;
}

function ComboPanel({ 
  title, 
  combo, 
  straps, 
  buckles, 
  price,
  onStrapChange, 
  onBuckleChange,
  onGenderChange 
}: ComboPanelProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <Badge variant="outline" className="text-lg">₹{price}</Badge>
      </div>

      {/* Gender Toggle */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant={combo.gender === 'male' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onGenderChange('male')}
        >
          Male
        </Button>
        <Button
          variant={combo.gender === 'female' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onGenderChange('female')}
        >
          Female
        </Button>
      </div>

      {/* 3D Preview */}
      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-muted min-h-[200px]">
        {combo.buckle ? (
          <BeltVisualizer3D
            strapImage={combo.strap.image}
            buckleImage={combo.buckle.image}
            gender={combo.gender}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Select a buckle
          </div>
        )}
      </div>

      {/* Strap Selector */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Strap</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {straps.map((strap) => (
            <button
              key={strap.id}
              onClick={() => onStrapChange(strap)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                combo.strap.id === strap.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img 
                src={strap.image} 
                alt={strap.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{combo.strap.name} • ₹{combo.strap.price}</p>
      </div>

      {/* Buckle Selector */}
      <div>
        <p className="text-sm font-medium mb-2">Buckle</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {buckles.map((buckle) => (
            <button
              key={buckle.id}
              onClick={() => onBuckleChange(buckle)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                combo.buckle?.id === buckle.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img 
                src={buckle.image} 
                alt={buckle.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {combo.buckle?.name || 'Select a buckle'} • ₹{combo.buckle?.price || 0}
        </p>
      </div>
    </Card>
  );
}
