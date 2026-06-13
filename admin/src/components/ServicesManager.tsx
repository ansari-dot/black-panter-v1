/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent } from 'react';
import { MessageSquarePlus, Search, Trash2, CheckCircle2, Zap, X, ToggleLeft, ToggleRight, Sparkles, ChevronRight } from 'lucide-react';
import { TService } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImageUrl = (value = '') => {
  if (!value) return '';
  if (value.startsWith('/uploads/')) return `${API}${value}`;
  if (value.startsWith('uploads/')) return `${API}/${value}`;
  return value;
};

interface ServicesManagerProps {
  services: TService[];
  onAddService: (service: {
    name: string;
    slug: string;
    description: string;
    category: string;
    status: 'Active' | 'Inactive';
    iconName: string;
    serviceTagline: string;
    heroDescription: string;
    imageUrl: string;
    detailImageUrl: string;
    ctaText: string;
    secondaryText: string;
    keyHighlights: string[];
    technicalProcedures: Array<{ title: string; description: string; icon: string }>;
    gallery: string[];
    displayOrder: number;
  }) => Promise<void> | void;
  onUpdateService?: (id: string, serviceData: Partial<TService>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteService: (id: string) => Promise<void> | void;
  isCompact?: boolean;
}

export default function ServicesManager({
  services,
  onAddService,
  onUpdateService,
  onUpdateStatus,
  onDeleteService,
  isCompact = false,
}: ServicesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastError, setToastError] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [iconName, setIconName] = useState('');
  const [serviceTagline, setServiceTagline] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [detailImageUrl, setDetailImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [highlightsText, setHighlightsText] = useState('');
  const [proceduresText, setProceduresText] = useState('');
  const [galleryText, setGalleryText] = useState('');

  const showToast = (message: string, isError = false) => {
    if (isError) {
      setToastError(message);
      setTimeout(() => setToastError(''), 4000);
    } else {
      setToastMsg(message);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setCategory('');
    setStatus('Active');
    setIconName('');
    setServiceTagline('');
    setHeroDescription('');
    setImageUrl('');
    setImageFileName('');
    setImagePreview('');
    setIsUploadingImage(false);
    setDetailImageUrl('');
    setCtaText('');
    setSecondaryText('');
    setDisplayOrder(0);
    setHighlightsText('');
    setProceduresText('');
    setGalleryText('');
    setEditingServiceId(null);
  };

  const handleEdit = (service: TService) => {
    setEditingServiceId(service.id);
    setName(service.title || service.name || '');
    setSlug(service.slug || '');
    setDescription(service.description || '');
    setCategory(service.category || '');
    setStatus(service.status || 'Active');
    setIconName(service.iconName || '');
    setServiceTagline(service.serviceTagline || '');
    setHeroDescription(service.heroDescription || '');
    setImageUrl(service.imageUrl || '');
    setImagePreview(resolveImageUrl(service.imageUrl || ''));
    setDetailImageUrl(service.detailImageUrl || '');
    setCtaText(service.ctaText || '');
    setSecondaryText(service.secondaryText || '');
    setDisplayOrder(service.displayOrder || 0);
    setHighlightsText(service.keyHighlights?.join('\n') || '');
    setGalleryText(service.gallery?.join('\n') || '');
    setProceduresText(
      service.technicalProcedures?.map((p) => `${p.title} | ${p.description} | ${p.icon}`).join('\n') || ''
    );
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImageFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Image upload failed');
    return data.url || '';
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setToastError('');
    setIsUploadingImage(true);
    setImageFileName(file.name);
    setImagePreview(URL.createObjectURL(file));

    try {
      const uploadedUrl = await uploadImageFile(file);
      setImageUrl(uploadedUrl);
      setImagePreview(resolveImageUrl(uploadedUrl));
      showToast('Image uploaded successfully.');
    } catch (error: any) {
      setImageUrl('');
      setImagePreview('');
      setImageFileName('');
      showToast(error?.message || 'Failed to upload image.', true);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setToastError('');
    setIsUploadingGallery(true);

    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageFile(files[i]);
        if (url) urls.push(url);
      }
      
      if (urls.length > 0) {
        setGalleryText((prev) => {
          const current = prev.trim();
          const appended = urls.join('\n');
          return current ? `${current}\n${appended}` : appended;
        });
        showToast('Gallery images uploaded successfully.');
      }
    } catch (error: any) {
      showToast(error?.message || 'Failed to upload some gallery images.', true);
    } finally {
      setIsUploadingGallery(false);
      // Reset input so same files can be selected again if needed
      event.target.value = '';
    }
  };

  const buildHighlights = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const buildProcedures = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title = '', procedureDescription = '', procedureIcon = 'battery'] = line.split('|').map((part) => part.trim());
        return { title, description: procedureDescription, icon: procedureIcon };
      })
      .filter((item) => item.title && item.description);

  const buildGallery = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !description.trim()) return;
    if (isUploadingImage) {
      showToast('Please wait for the image upload to finish.', true);
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        category: category.trim(),
        status,
        iconName: iconName.trim() || 'battery',
        serviceTagline: serviceTagline.trim(),
        heroDescription: heroDescription.trim(),
        imageUrl: imageUrl.trim(),
        detailImageUrl: detailImageUrl.trim(),
        ctaText: ctaText.trim(),
        secondaryText: secondaryText.trim(),
        keyHighlights: buildHighlights(highlightsText),
        technicalProcedures: buildProcedures(proceduresText),
        gallery: buildGallery(galleryText),
        displayOrder,
      };

      if (editingServiceId && onUpdateService) {
        await onUpdateService(editingServiceId, serviceData);
        showToast('Service updated successfully!');
      } else {
        await onAddService(serviceData);
        showToast('Service added successfully!');
      }
      resetForm();
      setShowAddForm(false);
    } catch (error: any) {
      showToast(error?.message || 'Failed to save service', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, serviceName: string) => {
    if (!confirm(`Delete ${serviceName}?`)) return;
    try {
      await onDeleteService(id);
      showToast('Service deleted.');
    } catch {
      showToast('Failed to delete service.', true);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: 'Active' | 'Inactive') => {
    try {
      await onUpdateStatus(id, currentStatus === 'Active' ? 'Inactive' : 'Active');
    } catch {
      showToast('Failed to update status.', true);
    }
  };

  const filteredServices = services.filter((service) => {
    const label = (service.title || service.name).toLowerCase();
    const query = searchTerm.toLowerCase();
    const statusMatch = filterStatus === 'All' || service.status === filterStatus;
    return (
      statusMatch &&
      (label.includes(query) ||
        service.slug.toLowerCase().includes(query) ||
        (service.description || '').toLowerCase().includes(query))
    );
  });
  const visibleServices = isCompact ? filteredServices.slice(0, 4) : filteredServices;

  return (
    <div className="flex flex-col gap-5 text-xs">
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm) resetForm();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Service'}</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-lg font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          {toastMsg}
        </div>
      )}
      {toastError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold">
          {toastError}
        </div>
      )}

      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">{editingServiceId ? 'Edit Service' : 'Add Service'}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Fill the same fields stored in the service schema.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Service Title *</label>
                <input required type="text" value={name} onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  setSlug(value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
                }} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Slug *</label>
                <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Display Order</label>
                <input type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Description *</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Service Tagline</label>
                <input type="text" value={serviceTagline} onChange={(e) => setServiceTagline(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Icon Name</label>
                <input type="text" value={iconName} onChange={(e) => setIconName(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Hero Description</label>
              <textarea rows={2} value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(resolveImageUrl(e.target.value));
                }} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
                <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Upload Main Image File
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:opacity-90"
                  />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {isUploadingImage ? 'Uploading image...' : imageFileName ? `Selected: ${imageFileName}` : 'Upload a file or paste an image URL.'}
                  </p>
                  {imagePreview ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
                      <img src={imagePreview} alt="Service preview" className="h-40 w-full object-cover" />
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">CTA Text</label>
                <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Detail Image URL (Optional)</label>
              <input type="text" value={detailImageUrl} onChange={(e) => setDetailImageUrl(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Secondary Text</label>
              <input type="text" value={secondaryText} onChange={(e) => setSecondaryText(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Highlights</label>
                <textarea rows={4} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Procedures (Format: Title | Description | FaIcon)</label>
                <textarea rows={4} value={proceduresText} onChange={(e) => setProceduresText(e.target.value)} placeholder="E.g. System Audit | Complete analysis | FaSearch" className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed font-mono" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">Gallery Image URLs (one per line)</label>
                <div className="flex items-center gap-2">
                  {isUploadingGallery && <span className="text-[10px] text-primary">Uploading...</span>}
                  <label className="cursor-pointer bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded text-[10px] font-semibold transition-colors">
                    Upload Images
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleGalleryUpload}
                      className="hidden"
                      disabled={isUploadingGallery}
                    />
                  </label>
                </div>
              </div>
              <textarea rows={3} value={galleryText} onChange={(e) => setGalleryText(e.target.value)} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed font-mono" />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 text-[10px]">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-foreground">
                  <input type="radio" name="serviceStatus" checked={status === 'Active'} onChange={() => setStatus('Active')} className="text-primary focus:ring-primary" />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-foreground">
                  <input type="radio" name="serviceStatus" checked={status === 'Inactive'} onChange={() => setStatus('Inactive')} className="text-primary focus:ring-primary" />
                  <span>Inactive</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
              <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="px-4 py-2 hover:bg-muted text-muted-foreground font-semibold rounded-lg cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-60">
                {loading ? 'Saving...' : (editingServiceId ? 'Update Service' : 'Save Service')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleServices.map((service) => {
          const serviceLabel = service.title || service.name;
          return (
            <div key={service.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-all relative group">
              {!isCompact && (
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, serviceLabel)}
                    className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-base font-bold text-primary">
                  {(serviceLabel[0] || 'S').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground truncate">{serviceLabel}</h3>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{service.slug}</span>
                    {service.category ? <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary">{service.category}</span> : null}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              {service.serviceTagline ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>{service.serviceTagline}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${service.status === 'Active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {service.status}
                </span>
                <button
                  onClick={() => handleStatusChange(service.id, service.status)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Toggle
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleStatusChange(service.id, service.status)}
                  className="text-muted-foreground hover:text-foreground p-1 transition-all cursor-pointer"
                  title={service.status === 'Active' ? 'Mark as Inactive' : 'Mark as Active'}
                >
                  {service.status === 'Active' ? (
                    <ToggleRight className="w-7 h-7 text-success shrink-0" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-muted-foreground shrink-0" />
                  )}
                </button>
                {!isCompact && (
                  <button
                    onClick={() => handleDelete(service.id, serviceLabel)}
                    className="ml-auto p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {visibleServices.length === 0 && (
          <div className="col-span-full py-12 text-center bg-card border border-dashed border-border rounded-xl flex flex-col items-center gap-2">
            <Zap className="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
            <p className="text-xs text-muted-foreground">No services found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
