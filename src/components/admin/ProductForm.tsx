import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Save } from 'lucide-react';

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

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: 'add' | 'edit';
}

const defaultFormData: ProductFormData = {
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
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const ProductForm = ({ initialData, onSubmit, isSubmitting, mode }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData || defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: mode === 'add' ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (mode === 'add') {
      setFormData(defaultFormData);
    }
  };

  return (
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
            {mode === 'add' ? 'Adding...' : 'Saving...'}
          </>
        ) : (
          <>
            {mode === 'add' ? <Plus className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {mode === 'add' ? 'Add Product' : 'Save Changes'}
          </>
        )}
      </Button>
    </form>
  );
};

export default ProductForm;
