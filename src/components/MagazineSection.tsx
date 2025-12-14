import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface MagazinePage {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  content: string | null;
  page_order: number;
}

const defaultPages: MagazinePage[] = [
  {
    id: '1',
    title: "The Legacy of Leather",
    subtitle: "Timeless Craftsmanship",
    image_url: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800&q=80",
    content: "Discover the ancient art of leather working and how tradition meets modern style.",
    page_order: 0
  },
  {
    id: '2',
    title: "Western Heritage",
    subtitle: "Born in the Saddle",
    image_url: "https://images.unsplash.com/photo-1528991435120-e73e05a58897?w=800&q=80",
    content: "From the rugged frontier to contemporary fashion, explore the evolution of cowboy style.",
    page_order: 1
  },
  {
    id: '3',
    title: "Artisan Stories",
    subtitle: "Master Craftsmen",
    image_url: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&q=80",
    content: "Meet the skilled artisans who pour their soul into every stitch and buckle.",
    page_order: 2
  },
  {
    id: '4',
    title: "Style Guide",
    subtitle: "Modern Western",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    content: "How to incorporate authentic western leather into your contemporary wardrobe.",
    page_order: 3
  }
];

export const MagazineSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [magazinePages, setMagazinePages] = useState<MagazinePage[]>(defaultPages);

  useEffect(() => {
    fetchMagazinePages();
  }, []);

  const fetchMagazinePages = async () => {
    try {
      const { data, error } = await supabase
        .from('magazine_pages')
        .select('*')
        .eq('is_active', true)
        .order('page_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setMagazinePages(data);
      }
    } catch (error) {
      console.error('Error fetching magazine pages:', error);
    }
  };

  const nextPage = () => {
    if (isFlipping) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % magazinePages.length);
      setIsFlipping(false);
    }, 600);
  };

  const prevPage = () => {
    if (isFlipping) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + magazinePages.length) % magazinePages.length);
      setIsFlipping(false);
    }, 600);
  };

  const goToPage = (idx: number) => {
    if (isFlipping || idx === currentPage) return;
    setFlipDirection(idx > currentPage ? 'next' : 'prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(idx);
      setIsFlipping(false);
    }, 600);
  };

  const page = magazinePages[currentPage];
  const nextPageData = magazinePages[(currentPage + 1) % magazinePages.length];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-accent" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The Leather Chronicle</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stories, heritage, and style from the world of premium leather craftsmanship
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 3D Book Container */}
          <div className="relative perspective-[2000px]" style={{ perspective: '2000px' }}>
            <div className="grid md:grid-cols-2 gap-0 bg-card rounded-2xl shadow-luxury overflow-hidden">
              {/* Left Page (Current) */}
              <div 
                className={`relative aspect-[3/4] overflow-hidden transition-all duration-600 ${
                  isFlipping && flipDirection === 'prev' 
                    ? 'opacity-0 scale-95' 
                    : 'opacity-100 scale-100'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src={page.image_url}
                  alt={page.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-sm font-semibold tracking-wider mb-2 text-accent">
                    {page.subtitle}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold">
                    {page.title}
                  </h3>
                </div>
              </div>

              {/* Right Page with 3D Flip Effect */}
              <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                {/* Static Content Page */}
                <div 
                  className={`p-8 md:p-12 h-full flex flex-col justify-between transition-all duration-600 ${
                    isFlipping ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <span className="font-semibold text-primary">Issue #{currentPage + 1}</span>
                      <span>•</span>
                      <span>2025 Edition</span>
                    </div>
                    <p className="text-lg leading-relaxed text-foreground/90">
                      {page.content}
                    </p>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevPage}
                      disabled={isFlipping}
                      className="rounded-full hover:scale-110 transition-transform"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex gap-2">
                      {magazinePages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToPage(idx)}
                          disabled={isFlipping}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentPage
                              ? 'bg-primary w-8'
                              : 'bg-border hover:bg-primary/50'
                          }`}
                          aria-label={`Go to page ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextPage}
                      disabled={isFlipping}
                      className="rounded-full hover:scale-110 transition-transform"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button className="w-full mt-8" size="lg">
                    Read Full Article
                  </Button>
                </div>

                {/* 3D Flipping Page Overlay */}
                {isFlipping && (
                  <div 
                    className={`absolute inset-0 bg-card shadow-2xl origin-left ${
                      flipDirection === 'next' ? 'animate-page-flip-forward' : 'animate-page-flip-backward'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Front of flipping page */}
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between bg-card">
                      <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <span className="font-semibold text-primary">Issue #{currentPage + 1}</span>
                          <span>•</span>
                          <span>2025 Edition</span>
                        </div>
                        <p className="text-lg leading-relaxed text-foreground/90">
                          {page.content}
                        </p>
                      </div>
                    </div>
                    
                    {/* Back of flipping page (next content preview) */}
                    <div 
                      className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between bg-card"
                      style={{ 
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <span className="font-semibold text-primary">
                            Issue #{flipDirection === 'next' ? (currentPage + 2) : currentPage}
                          </span>
                          <span>•</span>
                          <span>2025 Edition</span>
                        </div>
                        <p className="text-lg leading-relaxed text-foreground/90">
                          {nextPageData.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Spine Shadow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-gradient-to-r from-black/20 via-black/40 to-black/20 pointer-events-none rounded-sm hidden md:block" />
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes pageFlipForward {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-180deg);
          }
        }
        
        @keyframes pageFlipBackward {
          0% {
            transform: rotateY(-180deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        
        .animate-page-flip-forward {
          animation: pageFlipForward 0.6s ease-in-out forwards;
        }
        
        .animate-page-flip-backward {
          animation: pageFlipBackward 0.6s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
};
