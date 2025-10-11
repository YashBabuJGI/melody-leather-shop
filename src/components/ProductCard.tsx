import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-1">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
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
