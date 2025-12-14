import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Menu } from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  url: string;
  item_order: number;
  is_active: boolean;
  icon: string | null;
  product_id: string | null;
}

interface Product {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  url: string;
  item_order: string;
  is_active: boolean;
  icon: string;
  product_id: string;
}

const initialFormData: FormData = {
  name: '',
  url: '',
  item_order: '0',
  is_active: true,
  icon: '',
  product_id: '',
};

const iconOptions = [
  { value: '', label: 'None' },
  { value: 'belt', label: 'Belt' },
  { value: 'buckle', label: 'Buckle' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'hat', label: 'Hat' },
  { value: 'star', label: 'Star' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'crown', label: 'Crown' },
];

export const NavManager = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchNavItems();
    fetchProducts();
  }, []);

  const fetchNavItems = async () => {
    try {
      const { data, error } = await supabase
        .from('header_nav_items')
        .select('*')
        .order('item_order', { ascending: true });

      if (error) throw error;
      setNavItems(data || []);
    } catch (error) {
      console.error('Error fetching nav items:', error);
      toast.error('Failed to load navigation items');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) {
      toast.error('Name and URL are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemData = {
        name: formData.name,
        url: formData.url,
        item_order: parseInt(formData.item_order) || 0,
        is_active: formData.is_active,
        icon: formData.icon || null,
        product_id: formData.product_id || null,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('header_nav_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Navigation item updated');
      } else {
        const { error } = await supabase
          .from('header_nav_items')
          .insert(itemData);

        if (error) throw error;
        toast.success('Navigation item added');
      }

      setFormData(initialFormData);
      setEditingItem(null);
      setIsDialogOpen(false);
      fetchNavItems();
    } catch (error: any) {
      console.error('Error saving nav item:', error);
      toast.error(error.message || 'Failed to save navigation item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      url: item.url,
      item_order: item.item_order.toString(),
      is_active: item.is_active,
      icon: item.icon || '',
      product_id: item.product_id || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;

    try {
      const { error } = await supabase
        .from('header_nav_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Navigation item deleted');
      fetchNavItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const toggleActive = async (item: NavItem) => {
    try {
      const { error } = await supabase
        .from('header_nav_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      toast.success(`Navigation item ${!item.is_active ? 'enabled' : 'disabled'}`);
      fetchNavItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update item');
    }
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Header Navigation ({navItems.length})
        </CardTitle>
        <Button onClick={openAddDialog} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {navItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        {item.item_order}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.url}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => toggleActive(item)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {navItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No navigation items yet. Using default navigation.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Belts"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="e.g., /products?category=belt"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item_order">Order</Label>
              <Input
                id="item_order"
                type="number"
                value={formData.item_order}
                onChange={(e) => setFormData({ ...formData, item_order: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_id">Link to Product (optional)</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
