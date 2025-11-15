import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check, ShoppingCart, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

interface BeltStrap {
  id: string;
  name: string;
  material: string;
  color: string;
  price: number;
  width: string;
  image: string;
}

const beltStraps: BeltStrap[] = [
  {
    id: 'strap-1',
    name: 'Classic Black Leather',
    material: 'Full-Grain Cowhide',
    color: 'Black',
    price: 1200,
    width: '1.5"',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=400&q=80',
  },
  {
    id: 'strap-2',
    name: 'Rustic Brown Leather',
    material: 'Full-Grain Cowhide',
    color: 'Brown',
    price: 1200,
    width: '1.5"',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  },
  {
    id: 'strap-3',
    name: 'Tooled Western',
    material: 'Vegetable-Tanned',
    color: 'Tan',
    price: 1800,
    width: '1.75"',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&q=80',
  },
  {
    id: 'strap-4',
    name: 'Exotic Alligator',
    material: 'Genuine Alligator',
    color: 'Black',
    price: 3500,
    width: '1.5"',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=400&q=80&sat=20',
  },
  {
    id: 'strap-5',
    name: 'Distressed Vintage',
    material: 'Pull-Up Leather',
    color: 'Brown',
    price: 1500,
    width: '1.5"',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&brightness=90',
  },
  {
    id: 'strap-6',
    name: 'Smooth Burgundy',
    material: 'Calfskin',
    color: 'Burgundy',
    price: 1400,
    width: '1.25"',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&hue=340',
  },
];

const sizes = ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"', '46"'];

export default function BeltBuilder() {
  const [buckles, setBuckles] = useState<Product[]>([]);
  const [selectedStrap, setSelectedStrap] = useState<BeltStrap>(beltStraps[0]);
  const [selectedBuckle, setSelectedBuckle] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('34"');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchBuckles();
  }, []);

  const fetchBuckles = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'buckle')
        .eq('in_stock', true)
        .limit(12);

      if (error) throw error;

      const mappedBuckles: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category as 'buckle',
        price: Number(p.price),
        image: p.image_url,
        images: p.images || [],
        description: p.description || '',
        material: p.material || '',
        occasion: p.occasions || [],
        finish: p.finish || '',
        embossing: p.embossing,
        pattern: p.pattern,
        inStock: p.in_stock,
      }));

      setBuckles(mappedBuckles);
      if (mappedBuckles.length > 0) {
        setSelectedBuckle(mappedBuckles[0]);
      }
    } catch (error) {
      console.error('Error fetching buckles:', error);
      toast.error('Failed to load buckles');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedStrap.price + (selectedBuckle?.price || 0);

  const handleAddToCart = () => {
    if (!selectedBuckle) {
      toast.error('Please select a buckle');
      return;
    }

    // Create a custom product combining strap and buckle
    const customBelt: Product = {
      id: `custom-${selectedStrap.id}-${selectedBuckle.id}`,
      name: `Custom Belt: ${selectedStrap.name} with ${selectedBuckle.name}`,
      category: 'belt',
      price: totalPrice,
      image: selectedStrap.image,
      images: [selectedStrap.image, selectedBuckle.image],
      description: `Handcrafted custom belt featuring ${selectedStrap.material} strap in ${selectedStrap.color} paired with ${selectedBuckle.name}. Width: ${selectedStrap.width}`,
      material: selectedStrap.material,
      occasion: ['Everyday', 'Western', 'Formal'],
      finish: 'Custom',
      inStock: true,
    };

    addToCart(customBelt, selectedSize);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading belt builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background animate-fade-in">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Custom Belt Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design your perfect belt by selecting a premium leather strap, matching buckle, and size. 
            Each combination is handcrafted to order.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Your Custom Belt</h3>
              
              {/* Strap Preview */}
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">Belt Strap</p>
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-2">
                  <img 
                    src={selectedStrap.image} 
                    alt={selectedStrap.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-semibold">{selectedStrap.name}</p>
                <p className="text-sm text-muted-foreground">{selectedStrap.material} • {selectedStrap.width}</p>
              </div>

              {/* Buckle Preview */}
              {selectedBuckle && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Buckle</p>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                    <img 
                      src={selectedBuckle.image} 
                      alt={selectedBuckle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-semibold">{selectedBuckle.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedBuckle.material}</p>
                </div>
              )}

              {/* Size */}
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">Selected Size</p>
                <Badge variant="secondary" className="text-lg px-4 py-2">{selectedSize}</Badge>
              </div>

              {/* Price */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Belt Strap</span>
                  <span>₹{selectedStrap.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Buckle</span>
                  <span>₹{selectedBuckle?.price || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              {/* Add to Cart */}
              <Button 
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <div className="mt-4 p-3 bg-muted rounded-lg flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Custom belts are handcrafted to order and typically ship within 5-7 business days.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column - Selection Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Select Strap */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold">Choose Your Leather Strap</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {beltStraps.map((strap) => (
                  <button
                    key={strap.id}
                    onClick={() => setSelectedStrap(strap)}
                    className={`relative group text-left transition-all rounded-lg overflow-hidden border-2 ${
                      selectedStrap.id === strap.id
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-muted">
                      <img 
                        src={strap.image} 
                        alt={strap.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {selectedStrap.id === strap.id && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-semibold mb-1">{strap.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{strap.material}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{strap.width}</Badge>
                        <p className="font-bold">₹{strap.price}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Buckle */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold">Choose Your Buckle</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {buckles.map((buckle) => (
                  <button
                    key={buckle.id}
                    onClick={() => setSelectedBuckle(buckle)}
                    className={`relative group text-left transition-all rounded-lg overflow-hidden border-2 ${
                      selectedBuckle?.id === buckle.id
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square bg-muted">
                      <img 
                        src={buckle.image} 
                        alt={buckle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {selectedBuckle?.id === buckle.id && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-semibold text-sm mb-1 truncate">{buckle.name}</p>
                      <p className="font-bold">₹{buckle.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Size */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Choose Your Size</h2>
                  <p className="text-sm text-muted-foreground">Select your waist size in inches</p>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`aspect-square rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground scale-110'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Sizing Guide</p>
                <p className="text-sm text-muted-foreground">
                  Choose your pant size or measure around your waist where you'll wear the belt. 
                  For the perfect fit, select one size larger than your actual waist measurement.
                </p>
              </div>
            </div>

            {/* CTA for Mobile */}
            <div className="lg:hidden">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold">₹{totalPrice}</span>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-bold mb-2">Handcrafted Quality</h3>
            <p className="text-sm text-muted-foreground">
              Every custom belt is meticulously crafted by skilled artisans using traditional techniques.
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-bold mb-2">Premium Materials</h3>
            <p className="text-sm text-muted-foreground">
              We use only the finest full-grain leather and solid metal buckles that age beautifully.
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="font-bold mb-2">Gift Ready</h3>
            <p className="text-sm text-muted-foreground">
              Custom belts come in elegant packaging, perfect for gifts or keeping for yourself.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
