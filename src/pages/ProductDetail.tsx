import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 animate-fade-in">
      <div className="container mx-auto">
        <Link to="/products">
          <Button variant="ghost" className="mb-6 transition-all hover:scale-105">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images with Video Hover */}
          <div className="space-y-4">
            <div 
              className="aspect-[3/4] rounded-lg overflow-hidden shadow-luxury bg-muted relative group cursor-pointer"
              onMouseEnter={() => setIsVideoPlaying(true)}
              onMouseLeave={() => setIsVideoPlaying(false)}
            >
              {isVideoPlaying ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/product_cards.mp4" type="video/mp4" />
                </video>
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category.toUpperCase()}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4 pb-6 border-b border-border">
              <div>
                <h3 className="font-semibold mb-2">Material</h3>
                <p className="text-muted-foreground">{product.material}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Finish</h3>
                <p className="text-muted-foreground">{product.finish}</p>
              </div>

              {product.embossing && (
                <div>
                  <h3 className="font-semibold mb-2">Embossing</h3>
                  <p className="text-muted-foreground">{product.embossing}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion.map((occ) => (
                    <Badge key={occ} variant="secondary">
                      {occ}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {product.sizes && (
              <div>
                <h3 className="font-semibold mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[60px]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <Link to="/trial-room">
              <Button
                size="lg"
                variant="outline"
                className="w-full transition-all hover:scale-105"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Try in Virtual Room
              </Button>
            </Link>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-accent" />
                <span>Handcrafted with meticulous attention to detail</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-accent" />
                <span>Superior quality materials</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-accent" />
                <span>Made to last generations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
