import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Image, GripVertical } from 'lucide-react';

interface MagazinePage {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  content: string | null;
  page_order: number;
  is_active: boolean;
}

interface FormData {
  title: string;
  subtitle: string;
  image_url: string;
  content: string;
  page_order: string;
  is_active: boolean;
}

const initialFormData: FormData = {
  title: '',
  subtitle: '',
  image_url: '',
  content: '',
  page_order: '0',
  is_active: true,
};

export const MagazineManager = () => {
  const [pages, setPages] = useState<MagazinePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingPage, setEditingPage] = useState<MagazinePage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('magazine_pages')
        .select('*')
        .order('page_order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching magazine pages:', error);
      toast.error('Failed to load magazine pages');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `magazine-${Date.now()}.${fileExt}`;
      const filePath = `magazine/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('Title and image are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const pageData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        image_url: formData.image_url,
        content: formData.content || null,
        page_order: parseInt(formData.page_order) || 0,
        is_active: formData.is_active,
      };

      if (editingPage) {
        const { error } = await supabase
          .from('magazine_pages')
          .update(pageData)
          .eq('id', editingPage.id);

        if (error) throw error;
        toast.success('Magazine page updated');
      } else {
        const { error } = await supabase
          .from('magazine_pages')
          .insert(pageData);

        if (error) throw error;
        toast.success('Magazine page added');
      }

      setFormData(initialFormData);
      setEditingPage(null);
      setIsDialogOpen(false);
      fetchPages();
    } catch (error: any) {
      console.error('Error saving magazine page:', error);
      toast.error(error.message || 'Failed to save magazine page');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (page: MagazinePage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      subtitle: page.subtitle || '',
      image_url: page.image_url,
      content: page.content || '',
      page_order: page.page_order.toString(),
      is_active: page.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('magazine_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Magazine page deleted');
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete page');
    }
  };

  const openAddDialog = () => {
    setEditingPage(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Magazine Pages ({pages.length})
        </CardTitle>
        <Button onClick={openAddDialog} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Page
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
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {page.page_order}
                    </TableCell>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        page.is_active 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {page.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(page)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(page.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No magazine pages yet. Add your first page!
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
              {editingPage ? 'Edit Magazine Page' : 'Add Magazine Page'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Image URL or upload"
                  className="flex-1"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Image className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page_order">Page Order</Label>
              <Input
                id="page_order"
                type="number"
                value={formData.page_order}
                onChange={(e) => setFormData({ ...formData, page_order: e.target.value })}
              />
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
              {editingPage ? 'Update Page' : 'Add Page'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
