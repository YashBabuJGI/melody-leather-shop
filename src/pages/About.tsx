import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

const leatherTypes = [
  { id: 'full-grain', name: 'Full-Grain Cowhide', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=200&q=80' },
  { id: 'bison', name: 'Exotic Bison', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&q=80' },
  { id: 'goat', name: 'Soft Goat Suede', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&q=80' },
  { id: 'calfskin', name: 'Fine Calfskin', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&q=80' },
];

const textures = [
  { id: 'smooth', name: 'Smooth', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=200&q=80' },
  { id: 'pebbled', name: 'Pebbled', image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200&q=80' },
  { id: 'distressed', name: 'Distressed', image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=200&q=80' },
  { id: 'embossed', name: 'Embossed', image: 'https://images.unsplash.com/photo-1557682233-43e671455dfa?w=200&q=80' },
];

const colorOptions = [
  { id: 'black', name: 'Midnight Black', hex: '#1a1a1a' },
  { id: 'brown', name: 'Rich Brown', hex: '#5c3317' },
  { id: 'cognac', name: 'Cognac', hex: '#9f5b3a' },
  { id: 'tan', name: 'Natural Tan', hex: '#c19a6b' },
  { id: 'burgundy', name: 'Burgundy', hex: '#6b2737' },
];

export default function About() {
  const [selectedLeather, setSelectedLeather] = useState<string>('');
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    productType: '',
    additionalNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeather || !selectedTexture || !selectedColor) {
      toast.error('Please select leather type, texture, and color');
      return;
    }
    if (!formData.name || !formData.email || !formData.productType) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Custom request submitted! We\'ll contact you within 24 hours.');
    // Reset form
    setSelectedLeather('');
    setSelectedTexture('');
    setSelectedColor('');
    setFormData({ name: '', email: '', productType: '', additionalNotes: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold mb-8 text-center animate-fade-in">Our Craftsmanship</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="aspect-video rounded-lg overflow-hidden mb-12 shadow-luxury">
            <img
              src="https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=1200&q=80"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-card p-8 rounded-lg shadow-card mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Meticulous Process</h2>
            <p className="text-lg leading-relaxed mb-4">
              We handpick superior skins which undergo many steps before the final product is achieved, 
              including bonding the lining, cutting, sanding, painting and stitching the edges.
            </p>
            <p className="text-lg leading-relaxed">
              Most of that is done by hand. During this process of meticulous craftsmanship, only the 
              utmost quality is ensured down to the smallest detail.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-fade-in">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Premium Materials</h3>
              <ul className="space-y-2">
                <li>• Full-grain cowhide</li>
                <li>• Exotic bison leather</li>
                <li>• Soft goat suede</li>
                <li>• Fine calfskin</li>
                <li>• Sterling silver hardware</li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Handcrafted Details</h3>
              <ul className="space-y-2">
                <li>• Hand-tooled patterns</li>
                <li>• Custom embossing</li>
                <li>• Edge painting</li>
                <li>• Precision stitching</li>
                <li>• Quality hardware</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12 rounded-2xl mb-12 animate-scale-in">
            <h2 className="text-4xl font-bold mb-4 text-center">Custom Crafted Just for You</h2>
            <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Select your preferred materials, textures, and colors to create a truly unique piece. 
              Our master craftsmen will bring your vision to life.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Leather Type Selection */}
              <div>
                <Label className="text-xl font-semibold mb-4 block">Select Leather Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {leatherTypes.map((leather) => (
                    <button
                      key={leather.id}
                      type="button"
                      onClick={() => setSelectedLeather(leather.id)}
                      className={`relative group overflow-hidden rounded-lg border-4 transition-all hover:scale-105 ${
                        selectedLeather === leather.id
                          ? 'border-primary shadow-luxury'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={leather.image}
                        alt={leather.name}
                        className="w-full aspect-square object-cover"
                      />
                      {selectedLeather === leather.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white text-sm font-semibold">{leather.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texture Selection */}
              <div>
                <Label className="text-xl font-semibold mb-4 block">Select Texture</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {textures.map((texture) => (
                    <button
                      key={texture.id}
                      type="button"
                      onClick={() => setSelectedTexture(texture.id)}
                      className={`relative group overflow-hidden rounded-lg border-4 transition-all hover:scale-105 ${
                        selectedTexture === texture.id
                          ? 'border-primary shadow-luxury'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={texture.image}
                        alt={texture.name}
                        className="w-full aspect-square object-cover"
                      />
                      {selectedTexture === texture.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white text-sm font-semibold">{texture.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <Label className="text-xl font-semibold mb-4 block">Select Color</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative group rounded-lg border-4 p-4 transition-all hover:scale-105 ${
                        selectedColor === color.id
                          ? 'border-primary shadow-luxury'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div
                        className="w-full aspect-square rounded-full mb-2 shadow-card"
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColor === color.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <p className="text-sm font-semibold text-center">{color.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card p-6 rounded-lg space-y-4">
                <h3 className="text-2xl font-bold mb-4">Your Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productType">Product Type *</Label>
                  <Input
                    id="productType"
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    placeholder="e.g., Leather Jacket, Belt, Boots"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Any specific requirements, measurements, or design preferences..."
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Custom Request
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-r from-leather-dark to-leather-medium text-white p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Built to Last Generations</h2>
            <p className="text-lg">
              Every piece is crafted with the intention of becoming a cherished heirloom, 
              improving with age and developing unique character over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
