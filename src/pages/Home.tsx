import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SpotifyPlayer } from '@/components/SpotifyPlayer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { ArrowRight } from 'lucide-react';

const videoSources = [
  'https://assets.mixkit.co/videos/preview/mixkit-leather-jacket-detail-49906-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-craftsman-working-with-leather-49903-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-leather-material-49907-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-person-wearing-leather-jacket-49905-large.mp4',
];

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const featuredProducts = products.slice(0, 8);

  const handleSongChange = (songIndex: number) => {
    setCurrentVideoIndex(songIndex % videoSources.length);
  };

  return (
    <div className="min-h-screen">
      <SpotifyPlayer onSongChange={handleSongChange} />
      
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          key={currentVideoIndex}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSources[currentVideoIndex]} type="video/mp4" />
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
              <h2 className="text-4xl font-bold mb-6">Meticulous Craftsmanship</h2>
              <p className="text-lg mb-4 leading-relaxed">
                We handpick superior skins which undergo many steps before the final product is achieved, 
                including bonding the lining, cutting, sanding, painting and stitching the edges.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                Most of that is done by hand. During this process of meticulous craftsmanship, only the 
                utmost quality is ensured down to the smallest detail.
              </p>
              <Link to="/about">
                <Button size="lg">
                  Learn More About Our Process
                </Button>
              </Link>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-luxury">
              <img
                src="/placeholder.svg"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Shop By Category</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Leather Jackets', category: 'jacket', image: '/placeholder.svg' },
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
