import { useRef, useState, FormEvent, ChangeEvent } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { TPartnerItem } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImage = (image = '') => {
  if (!image) return '';
  if (image.startsWith('/uploads/')) return `${API}${image}`;
  if (image.startsWith('uploads/')) return `${API}/${image}`;
  return image;
};

interface Props {
  partners: TPartnerItem[];
  onAddPartner: (item: Omit<TPartnerItem, 'id' | '_id'>) => Promise<void>;
  onUpdatePartner: (id: string, item: Omit<TPartnerItem, 'id' | '_id'>) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
}

export default function PartnerManager({ partners, onAddPartner, onUpdatePartner, onDeletePartner }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API}/api/upload`, { method: 'POST', credentials: 'include', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data.url as string;
  };

  const resetForm = () => {
    setEditingId('');
    setName('');
    setLogoUrl('');
    setWebsiteUrl('');
    setDisplayOrder(0);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    setLogoUrl(url);
    setPreview(resolveImage(url));
  };

  const startEdit = (partner: TPartnerItem) => {
    setEditingId(partner.id);
    setName(partner.name);
    setLogoUrl(partner.logoUrl);
    setWebsiteUrl(partner.websiteUrl || '');
    setDisplayOrder(partner.displayOrder || 0);
    setPreview(resolveImage(partner.logoUrl));
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { name, logoUrl, websiteUrl, displayOrder };
    if (editingId) await onUpdatePartner(editingId, payload);
    else await onAddPartner(payload);
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Partner Logos</h2>
          <p className="text-xs text-muted-foreground">Manage the trusted-by logo strip.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'Add Partner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background" />
          </div>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Order</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-border bg-background" />
          </div>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Website</label>
            <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background" />
          </div>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Logo</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 border border-dashed border-border rounded-lg inline-flex items-center gap-2 text-muted-foreground">
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg" className="hidden" onChange={handleFileChange} />
              {preview ? <img src={preview} alt="Preview" className="w-12 h-12 rounded object-contain border border-border bg-white" /> : null}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 rounded-lg border border-border text-muted-foreground">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold">Save Partner</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {partners.map((partner) => (
          <div key={partner.id} className="relative border border-border rounded-lg bg-white p-3 flex items-center justify-center min-h-[88px] group">
            <button onClick={() => onDeletePartner(partner.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={() => startEdit(partner)} className="w-full h-full flex items-center justify-center">
              <img src={resolveImage(partner.logoUrl)} alt={partner.name} className="max-h-12 max-w-[120px] object-contain grayscale" />
            </button>
          </div>
        ))}
        {partners.length === 0 && <div className="text-xs text-muted-foreground">No partner logos yet.</div>}
      </div>
    </div>
  );
}
