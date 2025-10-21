import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div 
        className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          {isHovered ? (
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.material}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>
            <Button
              size="icon"
              variant="default"
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          
          {product.embossing && (
            <p className="text-xs text-accent mt-2">{product.embossing}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
