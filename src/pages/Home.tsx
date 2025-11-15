import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MagazineSection } from '@/components/MagazineSection';
import { supabase } from '@/integrations/supabase/client';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .limit(8);

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category as 'belt' | 'buckle' | 'jewelry' | 'hat',
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
        sizes: p.sizes || undefined,
      }));

      setFeaturedProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Crafted for Legends
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
            Premium leather goods with meticulous attention to detail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8"
              >
                Our Craftsmanship
              </Button>
            </Link>
            <Link to="/trial-room">
              <Button 
                size="lg" 
                className="bg-accent text-white hover:bg-accent/90 text-lg px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Virtual Trial Room
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked superior skins undergoing many steps before the final product is achieved
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Leather Belt Craftsmanship</h2>
              <p className="text-lg mb-4 leading-relaxed">
                Every leather belt is meticulously handcrafted from premium full-grain leather. Each piece 
                undergoes careful selection, cutting, edge finishing, and hand-stitching to ensure exceptional 
                durability and timeless style.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                Our artisan buckles are individually cast and finished, featuring intricate silver detailing 
                that pairs perfectly with our hand-tooled leather straps. Each belt represents hours of skilled 
                craftsmanship and attention to the finest details.
              </p>
              <Link to="/about">
                <Button size="lg">
                  Learn More About Our Process
                </Button>
              </Link>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1611312449412-6cefac5dc219?w=800&q=80"
                alt="Handcrafted Leather Belts and Silver Buckles"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Magazine Section */}
      <MagazineSection />

      {/* Categories Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Shop By Category</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Premium Belts', category: 'belt', image: '/placeholder.svg' },
              { name: 'Silver Buckles', category: 'buckle', image: '/placeholder.svg' },
            ].map((cat) => (
              <Link key={cat.category} to={`/products?category=${cat.category}`}>
                <div className="group relative aspect-[4/5] rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
