-- Add subcategories column to header_nav_items
ALTER TABLE public.header_nav_items ADD COLUMN IF NOT EXISTS subcategories jsonb DEFAULT '[]'::jsonb;

-- Delete existing nav items
DELETE FROM public.header_nav_items;

-- Insert new navigation items with subcategories
INSERT INTO public.header_nav_items (name, url, item_order, is_active, subcategories) VALUES
('BELTS', '/products?category=belt', 0, true, '[{"name": "Men", "url": "/products?category=belt&gender=men"}, {"name": "Boys", "url": "/products?category=belt&gender=boys"}, {"name": "Women", "url": "/products?category=belt&gender=women"}, {"name": "Girls", "url": "/products?category=belt&gender=girls"}]'::jsonb),
('BUCKLES', '/products?category=buckle', 1, true, '[]'::jsonb),
('BILLETS', '/products?category=billet', 2, true, '[]'::jsonb),
('CONCHOS', '/products?category=concho', 3, true, '[]'::jsonb),
('STRAPS', '/products?category=strap', 4, true, '[{"name": "Watch Strap", "url": "/products?category=strap&type=watch"}, {"name": "Belt Strap", "url": "/products?category=strap&type=belt"}, {"name": "Guitar Strap", "url": "/products?category=strap&type=guitar"}]'::jsonb),
('APPARELS', '/products?category=apparel', 5, true, '[{"name": "Men", "url": "/products?category=apparel&gender=men"}, {"name": "Boys", "url": "/products?category=apparel&gender=boys"}, {"name": "Women", "url": "/products?category=apparel&gender=women"}, {"name": "Girls", "url": "/products?category=apparel&gender=girls"}]'::jsonb),
('SOUVENIRS & BAGS', '/products?category=souvenirs', 6, true, '[]'::jsonb),
('LEATHER CARE', '/products?category=leather-care', 7, true, '[]'::jsonb);