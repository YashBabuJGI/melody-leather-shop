import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { MagazineSection } from '@/components/MagazineSection';
import { supabase } from '@/integrations/supabase/client';
import ComingSoon from './ComingSoon';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isComingSoon, setIsComingSoon] = useState<boolean | null>(null);
  const [comingSoonTitle, setComingSoonTitle] = useState('Coming Soon');
  const [comingSoonMessage, setComingSoonMessage] = useState('We are curating products for you. Premium leather goods, meticulously designed for those who appreciate exceptional craftsmanship.');

  useEffect(() => {
    fetchComingSoonSetting();
    fetchFeaturedProducts();
  }, []);

  const fetchComingSoonSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('value')
        .eq('key', 'coming_soon')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const value = (data as any).value as { 
          enabled?: boolean; 
          title?: string; 
          message?: string; 
        };
        setIsComingSoon(value.enabled ?? false);
        setComingSoonTitle(value.title ?? 'Coming Soon');
        setComingSoonMessage(value.message ?? 'We are curating products for you. Premium leather goods, meticulously designed for those who appreciate exceptional craftsmanship.');
      } else {
        setIsComingSoon(false);
      }
    } catch (error) {
      console.error('Error fetching coming soon setting:', error);
      setIsComingSoon(false);
    }
  };

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

  // Show loading while checking coming soon status
  if (isComingSoon === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show Coming Soon page if enabled
  if (isComingSoon) {
    return <ComingSoon title={comingSoonTitle} message={comingSoonMessage} />;
  }

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
            <Link to="/belt-builder">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Build Your Belt
                  <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">NEW</span>
                </span>
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8">
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

      {/* Belt Builder CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>New Feature</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Design Your Perfect Belt</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create a one-of-a-kind belt by combining your favorite leather strap with the perfect 
              buckle. Each custom piece is handcrafted to order with premium materials.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-card p-6 rounded-lg shadow-card">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold mb-2">Choose Your Strap</h3>
                <p className="text-sm text-muted-foreground">Select from premium leather types, colors, and widths</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-card">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="font-semibold mb-2">Pick Your Buckle</h3>
                <p className="text-sm text-muted-foreground">Match with hand-cast silver buckles in various designs</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-card">
                <div className="text-3xl mb-3">📏</div>
                <h3 className="font-semibold mb-2">Select Your Size</h3>
                <p className="text-sm text-muted-foreground">Get the perfect fit with our comprehensive size range</p>
              </div>
            </div>
            <Link to="/belt-builder">
              <Button size="lg" className="text-lg px-10 py-6 h-auto">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building Your Belt
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
