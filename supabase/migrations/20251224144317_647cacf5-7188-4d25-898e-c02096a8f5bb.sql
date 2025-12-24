-- Drop the restrictive SELECT policy that only shows active items
DROP POLICY IF EXISTS "Anyone can view active nav items" ON public.header_nav_items;

-- Create a new policy that allows admins to see ALL items (active and inactive)
CREATE POLICY "Admins can view all nav items" 
ON public.header_nav_items 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public to view only active items
CREATE POLICY "Public can view active nav items" 
ON public.header_nav_items 
FOR SELECT 
USING (is_active = true);