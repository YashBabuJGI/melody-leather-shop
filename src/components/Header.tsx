import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Settings, Package, Receipt, LogOut, LogIn, Shield, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SubCategory {
  name: string;
  url: string;
}

interface NavItem {
  id: string;
  name: string;
  url: string;
  item_order: number;
  is_active: boolean;
  subcategories?: SubCategory[];
}

const defaultNavItems: NavItem[] = [
  { id: '1', name: 'BELTS', url: '/products?category=belt', item_order: 0, is_active: true, subcategories: [
    { name: 'Men', url: '/products?category=belt&gender=men' },
    { name: 'Boys', url: '/products?category=belt&gender=boys' },
    { name: 'Women', url: '/products?category=belt&gender=women' },
    { name: 'Girls', url: '/products?category=belt&gender=girls' },
  ]},
  { id: '2', name: 'BUCKLES', url: '/products?category=buckle', item_order: 1, is_active: true },
  { id: '3', name: 'BILLETS', url: '/products?category=billet', item_order: 2, is_active: true },
  { id: '4', name: 'CONCHOS', url: '/products?category=concho', item_order: 3, is_active: true },
  { id: '5', name: 'STRAPS', url: '/products?category=strap', item_order: 4, is_active: true, subcategories: [
    { name: 'Watch Strap', url: '/products?category=strap&type=watch' },
    { name: 'Belt Strap', url: '/products?category=strap&type=belt' },
    { name: 'Guitar Strap', url: '/products?category=strap&type=guitar' },
  ]},
  { id: '6', name: 'APPARELS', url: '/products?category=apparel', item_order: 5, is_active: true, subcategories: [
    { name: 'Men', url: '/products?category=apparel&gender=men' },
    { name: 'Boys', url: '/products?category=apparel&gender=boys' },
    { name: 'Women', url: '/products?category=apparel&gender=women' },
    { name: 'Girls', url: '/products?category=apparel&gender=girls' },
  ]},
  { id: '7', name: 'SOUVENIRS & BAGS', url: '/products?category=souvenirs', item_order: 6, is_active: true },
  { id: '8', name: 'LEATHER CARE', url: '/products?category=leather-care', item_order: 7, is_active: true },
];

export const Header = () => {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const { data, error } = await supabase
        .from('header_nav_items')
        .select('*')
        .eq('is_active', true)
        .order('item_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        const mappedItems: NavItem[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          url: item.url,
          item_order: item.item_order,
          is_active: item.is_active,
          subcategories: (item.subcategories as unknown as SubCategory[]) || [],
        }));
        setNavItems(mappedItems);
      }
    } catch (error) {
      console.error('Error fetching nav items:', error);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top Row: Gender Toggle | Logo | Icons */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu + Gender Toggle */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold text-gradient-leather">
                      WYOMING SPUR
                    </SheetTitle>
                  </div>
                </SheetHeader>
                
                {/* Gender Toggle in Mobile */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center bg-muted rounded-full p-1 relative">
                    <div 
                      className={`absolute h-8 w-1/2 bg-primary rounded-full transition-transform duration-300 ease-out ${
                        gender === 'women' ? 'translate-x-full' : 'translate-x-0'
                      }`}
                    />
                    <button
                      onClick={() => setGender('men')}
                      className={`relative z-10 flex-1 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                        gender === 'men' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      Men
                    </button>
                    <button
                      onClick={() => setGender('women')}
                      className={`relative z-10 flex-1 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                        gender === 'women' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      Women
                    </button>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-2">
                  {navItems.map((item) => (
                    <div key={item.id} className="border-b border-border/50">
                      {item.subcategories && item.subcategories.length > 0 ? (
                        <Collapsible
                          open={expandedItems.has(item.id)}
                          onOpenChange={() => toggleExpanded(item.id)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors">
                            <span>{item.name}</span>
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="bg-muted/30 py-1">
                              <SheetClose asChild>
                                <Link
                                  to={item.url}
                                  className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                  onClick={closeMobileMenu}
                                >
                                  View All {item.name}
                                </Link>
                              </SheetClose>
                              {item.subcategories.map((sub) => (
                                <SheetClose asChild key={sub.name}>
                                  <Link
                                    to={sub.url}
                                    className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    onClick={closeMobileMenu}
                                  >
                                    {sub.name}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            to={item.url}
                            className="block px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Footer Links */}
                <div className="border-t border-border p-4 space-y-2">
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </SheetClose>
                      {isAdmin && (
                        <SheetClose asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <Shield className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          closeMobileMenu();
                        }}
                        className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-muted rounded-md transition-colors w-full text-left text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Gender Toggle - Desktop */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setGender('men')}
                className={`px-4 py-1 text-sm font-medium tracking-wider transition-colors border-b-2 ${
                  gender === 'men' 
                    ? 'text-foreground border-foreground' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                MEN
              </button>
              <button
                onClick={() => setGender('women')}
                className={`px-4 py-1 text-sm font-medium tracking-wider transition-colors border-b-2 ${
                  gender === 'women' 
                    ? 'text-foreground border-foreground' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                WOMEN
              </button>
            </div>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient-leather whitespace-nowrap">
              WYOMING SPUR
            </h1>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
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

      {/* Bottom Row: Navigation - Desktop Only */}
      <div className="hidden lg:block border-t border-border/50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center space-x-8 h-12">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  to={item.url}
                  className="text-xs font-medium tracking-wider hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
                {item.subcategories && item.subcategories.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-background border border-border rounded-md shadow-lg py-2 min-w-[140px]">
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.url}
                          className="block px-4 py-2 text-xs hover:bg-muted transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
