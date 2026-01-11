import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Sparkles, Mail } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  message?: string;
}

export default function ComingSoon({ 
  title = 'Coming Soon', 
  message = 'We are curating products for you. Premium leather goods, meticulously designed for those who appreciate exceptional craftsmanship.' 
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Thank you! We\'ll notify you when we launch.');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          <span>Something Amazing is Coming</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in">
          {title}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-in">
          {message}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-in">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12">
            {isSubmitting ? 'Subscribing...' : 'Notify Me'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 animate-fade-in">
          Be the first to know when we launch. No spam, we promise.
        </p>
      </div>
    </div>
  );
}