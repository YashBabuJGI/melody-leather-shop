import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Settings, Package, Receipt, LogOut, LogIn, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [gender, setGender] = useState<'men' | 'women'>('men');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight text-gradient-leather">
                WYOMING SPUR
              </h1>
            </Link>

            {/* Gender Toggle */}
            <div className="hidden md:flex items-center bg-muted rounded-full p-1 relative">
              <div 
                className={`absolute h-8 w-16 bg-primary rounded-full transition-transform duration-300 ease-out ${
                  gender === 'women' ? 'translate-x-16' : 'translate-x-0'
                }`}
              />
              <button
                onClick={() => setGender('men')}
                className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                  gender === 'men' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                Men
              </button>
              <button
                onClick={() => setGender('women')}
                className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                  gender === 'women' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                Women
              </button>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/belt-builder" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <span>Belt Builder</span>
              <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full whitespace-nowrap">NEW</span>
            </Link>
            <Link to="/products?category=belt" className="text-sm font-medium hover:text-primary transition-colors">
              Belts
            </Link>
            <Link to="/products?category=buckle" className="text-sm font-medium hover:text-primary transition-colors">
              Buckles
            </Link>
            <Link to="/products?category=jewelry" className="text-sm font-medium hover:text-primary transition-colors">
              Jewelry
            </Link>
            <Link to="/products?category=hat" className="text-sm font-medium hover:text-primary transition-colors">
              Hats
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Craftsmanship
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user ? user.email : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/billing" className="flex items-center cursor-pointer">
                        <Receipt className="mr-2 h-4 w-4" />
                        Billing History
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="flex items-center cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
