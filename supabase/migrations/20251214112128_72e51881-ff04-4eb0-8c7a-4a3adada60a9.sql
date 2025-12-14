-- Create magazine_pages table
CREATE TABLE public.magazine_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  content TEXT,
  page_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.magazine_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can view active magazine pages
CREATE POLICY "Anyone can view active magazine pages"
ON public.magazine_pages
FOR SELECT
USING (is_active = true);

-- Admins can manage magazine pages
CREATE POLICY "Admins can insert magazine pages"
ON public.magazine_pages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update magazine pages"
ON public.magazine_pages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete magazine pages"
ON public.magazine_pages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create header_nav_items table
CREATE TABLE public.header_nav_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  item_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  icon TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.header_nav_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view active nav items
CREATE POLICY "Anyone can view active nav items"
ON public.header_nav_items
FOR SELECT
USING (is_active = true);

-- Admins can manage nav items
CREATE POLICY "Admins can insert nav items"
ON public.header_nav_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update nav items"
ON public.header_nav_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete nav items"
ON public.header_nav_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_magazine_pages_updated_at
BEFORE UPDATE ON public.magazine_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_header_nav_items_updated_at
BEFORE UPDATE ON public.header_nav_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();