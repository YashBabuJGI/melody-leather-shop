import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const magazinePages = [
  {
    id: 1,
    title: "The Legacy of Leather",
    subtitle: "Timeless Craftsmanship",
    image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800&q=80",
    content: "Discover the ancient art of leather working and how tradition meets modern style."
  },
  {
    id: 2,
    title: "Western Heritage",
    subtitle: "Born in the Saddle",
    image: "https://images.unsplash.com/photo-1528991435120-e73e05a58897?w=800&q=80",
    content: "From the rugged frontier to contemporary fashion, explore the evolution of cowboy style."
  },
  {
    id: 3,
    title: "Artisan Stories",
    subtitle: "Master Craftsmen",
    image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&q=80",
    content: "Meet the skilled artisans who pour their soul into every stitch and buckle."
  },
  {
    id: 4,
    title: "Style Guide",
    subtitle: "Modern Western",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    content: "How to incorporate authentic western leather into your contemporary wardrobe."
  }
];

export const MagazineSection = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % magazinePages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + magazinePages.length) % magazinePages.length);
  };

  const page = magazinePages[currentPage];

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
          <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl shadow-luxury overflow-hidden animate-scale-in">
            {/* Magazine Image */}
            <div className="relative aspect-[3/4] overflow-hidden group">
              <img
                src={page.image}
                alt={page.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

            {/* Magazine Content */}
            <div className="p-8 md:p-12">
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
                  className="rounded-full hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex gap-2">
                  {magazinePages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
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
                  className="rounded-full hover:scale-110 transition-transform"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <Button className="w-full mt-8" size="lg">
                Read Full Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
