import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Shield, Plus, Package, Loader2, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image_url: string;
  images: string[];
  description: string | null;
  material: string | null;
  occasions: string[] | null;
  finish: string | null;
  embossing: string | null;
  pattern: string | null;
  sizes: string[] | null;
  in_stock: boolean | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'belt',
    price: '',
    image_url: '',
    images: '',
    description: '',
    material: '',
    occasions: '',
    finish: '',
    embossing: '',
    pattern: '',
    sizes: '',
    in_stock: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
        description: formData.description || null,
        material: formData.material || null,
        occasions: formData.occasions ? formData.occasions.split(',').map(s => s.trim()).filter(Boolean) : null,
        finish: formData.finish || null,
        embossing: formData.embossing || null,
        pattern: formData.pattern || null,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : null,
        in_stock: formData.in_stock,
      };

      const { error } = await supabase.from('products').insert(productData);

      if (error) throw error;

      toast.success('Product added successfully!');
      setFormData({
        name: '',
        slug: '',
        category: 'belt',
        price: '',
        image_url: '',
        images: '',
        description: '',
        material: '',
        occasions: '',
        finish: '',
        embossing: '',
        pattern: '',
        sizes: '',
        in_stock: true,
      });
      fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      placeholder="Classic Leather Belt"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                      placeholder="classic-leather-belt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="belt">Belt</SelectItem>
                        <SelectItem value="buckle">Buckle</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="hat">Hat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      placeholder="2999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Main Image URL *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Additional Images (comma-separated URLs)</Label>
                  <Textarea
                    id="images"
                    value={formData.images}
                    onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A premium leather belt crafted with..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                      placeholder="Full Grain Leather"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finish">Finish</Label>
                    <Input
                      id="finish"
                      value={formData.finish}
                      onChange={(e) => setFormData(prev => ({ ...prev, finish: e.target.value }))}
                      placeholder="Polished"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="embossing">Embossing</Label>
                    <Input
                      id="embossing"
                      value={formData.embossing}
                      onChange={(e) => setFormData(prev => ({ ...prev, embossing: e.target.value }))}
                      placeholder="Western Pattern"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pattern">Pattern</Label>
                    <Input
                      id="pattern"
                      value={formData.pattern}
                      onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))}
                      placeholder="Braided"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occasions">Occasions (comma-separated)</Label>
                  <Input
                    id="occasions"
                    value={formData.occasions}
                    onChange={(e) => setFormData(prev => ({ ...prev, occasions: e.target.value }))}
                    placeholder="Casual, Formal, Western"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                  <Input
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                    placeholder="30, 32, 34, 36, 38, 40"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="in_stock"
                    checked={formData.in_stock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
                  />
                  <Label htmlFor="in_stock">In Stock</Label>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell>₹{product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
