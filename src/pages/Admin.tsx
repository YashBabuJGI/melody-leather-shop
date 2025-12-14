import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Plus, Package, Loader2, Trash2, Pencil, BookOpen, Menu } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProductForm from '@/components/admin/ProductForm';
import { MagazineManager } from '@/components/admin/MagazineManager';
import { NavManager } from '@/components/admin/NavManager';

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

interface ProductFormData {
  name: string;
  slug: string;
  category: string;
  price: string;
  image_url: string;
  images: string;
  description: string;
  material: string;
  occasions: string;
  finish: string;
  embossing: string;
  pattern: string;
  sizes: string;
  in_stock: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const handleAddProduct = async (formData: ProductFormData) => {
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
      fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (formData: ProductFormData) => {
    if (!editingProduct) return;
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

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success('Product updated successfully!');
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
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

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const getEditFormData = (product: Product): ProductFormData => ({
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price.toString(),
    image_url: product.image_url,
    images: product.images.join(', '),
    description: product.description || '',
    material: product.material || '',
    occasions: product.occasions?.join(', ') || '',
    finish: product.finish || '',
    embossing: product.embossing || '',
    pattern: product.pattern || '',
    sizes: product.sizes?.join(', ') || '',
    in_stock: product.in_stock ?? true,
  });

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
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="magazine" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Magazine
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Navigation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
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
                  <ProductForm
                    onSubmit={handleAddProduct}
                    isSubmitting={isSubmitting}
                    mode="add"
                  />
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
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell className="capitalize">{product.category}</TableCell>
                              <TableCell>₹{product.price.toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(product)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(product.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
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
          </TabsContent>

          <TabsContent value="magazine">
            <MagazineManager />
          </TabsContent>

          <TabsContent value="navigation">
            <NavManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Product
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={getEditFormData(editingProduct)}
              onSubmit={handleEditProduct}
              isSubmitting={isSubmitting}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
