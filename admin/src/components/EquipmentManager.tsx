import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { Upload, Plus, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { TEquipmentItem } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImage = (image = '') => {
  if (!image) return '';
  if (image.startsWith('/uploads/')) return `${API}${image}`;
  if (image.startsWith('uploads/')) return `${API}/${image}`;
  return image;
};

interface Props {
  equipment: TEquipmentItem[];
  onAddEquipment: (item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onUpdateEquipment: (id: string, item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onDeleteEquipment: (id: string) => Promise<void>;
}

export default function EquipmentManager({ equipment, onAddEquipment, onUpdateEquipment, onDeleteEquipment }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Image upload failed');
    return data.url as string;
  };

  const resetForm = () => {
    setEditingId('');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImagePreview('');
    setImageFileName('');
    setDisplayOrder(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name);
    setImagePreview(URL.createObjectURL(file));
    const uploaded = await uploadImage(file);
    setImageUrl(uploaded);
    setImagePreview(resolveImage(uploaded));
  };

  const startEdit = (item: TEquipmentItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setImageUrl(item.imageUrl || '');
    setImagePreview(resolveImage(item.imageUrl || ''));
    setDisplayOrder(item.displayOrder || 0);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title, description, imageUrl, displayOrder };
      if (editingId) await onUpdateEquipment(editingId, payload);
      else await onAddEquipment(payload);
      resetForm();
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Our Equipments & Capabilities</h3>
          <p className="text-[11px] text-muted-foreground">Manage the cards shown on the service page.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'Add Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background" />
          </div>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Order</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-border bg-background" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Image</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 border border-dashed border-border rounded-lg inline-flex items-center gap-2 text-muted-foreground">
                <Upload className="w-4 h-4" /> Upload Image
              </button>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleImageChange} />
              {imagePreview ? <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-border" /> : <ImageIcon className="w-5 h-5 text-muted-foreground" />}
              {imageFileName ? <span className="text-muted-foreground">{imageFileName}</span> : null}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 rounded-lg border border-border text-muted-foreground">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold">{loading ? 'Saving...' : 'Save Item'}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item) => (
          <div key={item.id} className="border border-border rounded-xl overflow-hidden bg-background">
            {item.imageUrl ? <img src={resolveImage(item.imageUrl)} alt={item.title} className="h-40 w-full object-cover" /> : <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">No image</div>}
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                <button onClick={() => onDeleteEquipment(item.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="flex justify-end">
                <button onClick={() => startEdit(item)} className="text-xs font-semibold text-primary">Edit</button>
              </div>
            </div>
          </div>
        ))}
        {equipment.length === 0 && <div className="text-xs text-muted-foreground">No equipment items yet.</div>}
      </div>
    </div>
  );
}
