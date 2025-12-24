import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Menu, ChevronDown, ChevronRight, X } from 'lucide-react';

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
  icon: string | null;
  product_id: string | null;
  subcategories: SubCategory[];
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
  subcategories: SubCategory[];
}

const initialFormData: FormData = {
  name: '',
  url: '',
  item_order: '0',
  is_active: true,
  icon: '',
  product_id: '',
  subcategories: [],
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newSubcategory, setNewSubcategory] = useState({ name: '', url: '' });

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
      const mappedItems: NavItem[] = (data || []).map((item) => ({
        ...item,
        subcategories: (item.subcategories as unknown as SubCategory[]) || [],
      }));
      setNavItems(mappedItems);
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
        subcategories: formData.subcategories as unknown as Json,
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
      subcategories: item.subcategories || [],
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

  const addSubcategory = () => {
    if (!newSubcategory.name || !newSubcategory.url) {
      toast.error('Subcategory name and URL are required');
      return;
    }
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { ...newSubcategory }],
    });
    setNewSubcategory({ name: '', url: '' });
  };

  const removeSubcategory = (index: number) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index),
    });
  };

  const updateSubcategory = (index: number, field: 'name' | 'url', value: string) => {
    const updated = [...formData.subcategories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subcategories: updated });
  };

  const updateSubcategoriesDirectly = async (item: NavItem, newSubcategories: SubCategory[]) => {
    try {
      const { error } = await supabase
        .from('header_nav_items')
        .update({ subcategories: newSubcategories as unknown as Json })
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Subcategories updated');
      fetchNavItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update subcategories');
    }
  };

  const deleteSubcategoryFromItem = async (item: NavItem, subIndex: number) => {
    const newSubcategories = item.subcategories.filter((_, i) => i !== subIndex);
    await updateSubcategoriesDirectly(item, newSubcategories);
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
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {navItems.map((item) => (
                  <>
                    <TableRow key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          {item.item_order}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                        {item.url}
                      </TableCell>
                      <TableCell>
                        {item.subcategories.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(item.id)}
                            className="h-7 px-2"
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-4 w-4 mr-1" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-1" />
                            )}
                            {item.subcategories.length} items
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
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
                    {expandedItems.has(item.id) && item.subcategories.length > 0 && (
                      <TableRow key={`${item.id}-subcategories`}>
                        <TableCell colSpan={6} className="bg-muted/30 p-0">
                          <div className="p-4 space-y-2">
                            <div className="text-xs font-medium text-muted-foreground mb-2">
                              Dropdown Items for "{item.name}"
                            </div>
                            {item.subcategories.map((sub, subIndex) => (
                              <div
                                key={subIndex}
                                className="flex items-center gap-2 bg-background rounded-md p-2 border border-border"
                              >
                                <span className="text-sm font-medium flex-1">{sub.name}</span>
                                <span className="text-xs text-muted-foreground flex-1 truncate">
                                  {sub.url}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => deleteSubcategoryFromItem(item, subIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleEdit(item)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Subcategory
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {navItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No navigation items yet. Click "Add Item" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

            {/* Subcategories Section */}
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-semibold">Dropdown Subcategories</Label>
              
              {formData.subcategories.length > 0 && (
                <div className="space-y-2">
                  {formData.subcategories.map((sub, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Name"
                        value={sub.name}
                        onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="URL"
                        value={sub.url}
                        onChange={(e) => updateSubcategory(index, 'url', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive shrink-0"
                        onClick={() => removeSubcategory(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    placeholder="e.g., Men"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input
                    placeholder="e.g., /products?gender=men"
                    value={newSubcategory.url}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, url: e.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addSubcategory}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.subcategories.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Add subcategories to create a dropdown menu for this navigation item.
                </p>
              )}
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
