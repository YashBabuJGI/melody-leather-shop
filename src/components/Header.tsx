import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-gradient-leather">
              WYOMING SPUR
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/products?category=jacket" className="text-sm font-medium hover:text-primary transition-colors">
              Jackets
            </Link>
            <Link to="/products?category=belt" className="text-sm font-medium hover:text-primary transition-colors">
              Belts
            </Link>
            <Link to="/products?category=buckle" className="text-sm font-medium hover:text-primary transition-colors">
              Buckles
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Craftsmanship
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
