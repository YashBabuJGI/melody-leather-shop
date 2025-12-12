import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

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

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Main image uploaded');
    }
    setUploadingMain(false);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingAdditional(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => {
        const existingImages = prev.images ? prev.images.split(',').map(s => s.trim()).filter(Boolean) : [];
        const newImages = [...existingImages, ...uploadedUrls];
        return { ...prev, images: newImages.join(', ') };
      });
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }
    setUploadingAdditional(false);
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = '';
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => {
      const images = prev.images.split(',').map(s => s.trim()).filter(Boolean);
      images.splice(index, 1);
      return { ...prev, images: images.join(', ') };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (mode === 'add') {
      setFormData(defaultFormData);
    }
  };

  const additionalImages = formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [];

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

      {/* Main Image Upload */}
      <div className="space-y-2">
        <Label>Main Image *</Label>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              required
              placeholder="Upload or paste URL"
            />
          </div>
          <input
            ref={mainImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => mainImageInputRef.current?.click()}
            disabled={uploadingMain}
          >
            {uploadingMain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
        </div>
        {formData.image_url && (
          <div className="mt-2 relative w-24 h-24 rounded-md overflow-hidden border border-border">
            <img src={formData.image_url} alt="Main" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Additional Images Upload */}
      <div className="space-y-2">
        <Label>Additional Images</Label>
        <div className="flex gap-3 items-center">
          <input
            ref={additionalImagesInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => additionalImagesInputRef.current?.click()}
            disabled={uploadingAdditional}
            className="w-full"
          >
            {uploadingAdditional ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Additional Images
              </>
            )}
          </Button>
        </div>
        {additionalImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {additionalImages.map((url, index) => (
              <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-border group">
                <img src={url} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAdditionalImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Textarea
          value={formData.images}
          onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
          placeholder="Or paste comma-separated URLs"
          rows={2}
          className="mt-2"
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
