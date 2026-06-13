import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { MessageSquarePlus, Search, Trash2, CheckCircle2, Zap, X, ToggleLeft, ToggleRight, Sparkles, ChevronRight } from 'lucide-react';
import { TProject } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImageUrl = (value = '') => {
  if (!value) return '';
  if (value.startsWith('/uploads/')) return `${API}${value}`;
  if (value.startsWith('uploads/')) return `${API}/${value}`;
  return value;
};

interface ProjectsManagerProps {
  projects: TProject[];
  onAddProject: (project: Partial<TProject>) => Promise<void> | void;
  onUpdateProject?: (id: string, projectData: Partial<TProject>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteProject: (id: string) => Promise<void> | void;
  isCompact?: boolean;
}

export default function ProjectsManager({
  projects,
  onAddProject,
  onUpdateProject,
  onUpdateStatus,
  onDeleteProject,
  isCompact = false,
}: ProjectsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastError, setToastError] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [heroTag, setHeroTag] = useState('Project Detail');
  const [heroTitleLine1White, setHeroTitleLine1White] = useState('');
  const [heroTitleLine1Orange, setHeroTitleLine1Orange] = useState('');
  const [heroTitleLine2White, setHeroTitleLine2White] = useState('');
  const [heroTitleLine2Orange, setHeroTitleLine2Orange] = useState('');
  const [galleryText, setGalleryText] = useState('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [highlightsText, setHighlightsText] = useState('');
  const [metricsText, setMetricsText] = useState('');
  const [processText, setProcessText] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [sector, setSector] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [timeline, setTimeline] = useState('');
  const [unitsInstalled, setUnitsInstalled] = useState('');
  const [uptime, setUptime] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

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
    setTitle('');
    setSlug('');
    setSubtitle('');
    setDescription('');
    setCategory('');
    setStatus('Active');
    setImageUrl('');
    setImagePreview('');
    setIsUploadingImage(false);
    setHeroTag('Project Detail');
    setHeroTitleLine1White('');
    setHeroTitleLine1Orange('');
    setHeroTitleLine2White('');
    setHeroTitleLine2Orange('');
    setGalleryText('');
    setHighlightsText('');
    setMetricsText('');
    setProcessText('');
    setClientName('');
    setLocation('');
    setSector('');
    setCompletedDate('');
    setTimeline('');
    setUnitsInstalled('');
    setUptime('');
    setDisplayOrder(0);
    setEditingProjectId(null);
  };

  const handleEdit = (project: TProject) => {
    setEditingProjectId(project.id);
    setTitle(project.title || '');
    setSlug(project.slug || '');
    setSubtitle(project.subtitle || '');
    setDescription(project.description || '');
    setCategory(project.category || '');
    setStatus(project.status || 'Active');
    setImageUrl(project.imageUrl || '');
    setImagePreview(resolveImageUrl(project.imageUrl || ''));
    setHeroTag(project.heroTag || 'Project Detail');
    setHeroTitleLine1White(project.heroTitleLine1White || '');
    setHeroTitleLine1Orange(project.heroTitleLine1Orange || '');
    setHeroTitleLine2White(project.heroTitleLine2White || '');
    setHeroTitleLine2Orange(project.heroTitleLine2Orange || '');
    setGalleryText(project.gallery?.join('\n') || '');
    setHighlightsText(project.highlights?.join('\n') || '');
    setMetricsText(project.metrics?.map(m => `${m.label}|${m.value}`).join('\n') || '');
    setProcessText(project.process?.join('\n') || '');
    setClientName(project.clientName || '');
    setLocation(project.location || '');
    setSector(project.sector || '');
    setCompletedDate(project.completedDate || '');
    setTimeline(project.timeline || '');
    setUnitsInstalled(project.unitsInstalled || '');
    setUptime(project.uptime || '');
    setDisplayOrder(project.displayOrder || 0);
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
    setImagePreview(URL.createObjectURL(file));
    try {
      const uploadedUrl = await uploadImageFile(file);
      setImageUrl(uploadedUrl);
      setImagePreview(resolveImageUrl(uploadedUrl));
      showToast('Image uploaded successfully.');
    } catch (error: any) {
      setImageUrl('');
      setImagePreview('');
      showToast(error?.message || 'Failed to upload image.', true);
    } finally {
      setIsUploadingImage(false);
    }
  };

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
        showToast(`${urls.length} gallery image(s) uploaded successfully.`);
      }
    } catch (error: any) {
      showToast(error?.message || 'Failed to upload some gallery images.', true);
    } finally {
      setIsUploadingGallery(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !description.trim()) return;
    if (isUploadingImage) {
      showToast('Please wait for the image upload to finish.', true);
      return;
    }

    setLoading(true);
    try {
      const projectData: Partial<TProject> = {
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        category: category.trim(),
        status,
        imageUrl: imageUrl.trim(),
        heroTag: heroTag.trim(),
        heroTitleLine1White: heroTitleLine1White.trim(),
        heroTitleLine1Orange: heroTitleLine1Orange.trim(),
        heroTitleLine2White: heroTitleLine2White.trim(),
        heroTitleLine2Orange: heroTitleLine2Orange.trim(),
        gallery: galleryText.split('\n').map(l => l.trim()).filter(Boolean),
        highlights: highlightsText.split('\n').map(l => l.trim()).filter(Boolean),
        metrics: metricsText.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
          const [label, value] = line.split('|').map(p => p.trim());
          return { label: label || '', value: value || '' };
        }),
        process: processText.split('\n').map(l => l.trim()).filter(Boolean),
        clientName: clientName.trim(),
        location: location.trim(),
        sector: sector.trim(),
        completedDate: completedDate.trim(),
        timeline: timeline.trim(),
        unitsInstalled: unitsInstalled.trim(),
        uptime: uptime.trim(),
        displayOrder,
      };

      if (editingProjectId && onUpdateProject) {
        await onUpdateProject(editingProjectId, projectData);
        showToast('Project updated successfully!');
      } else {
        await onAddProject(projectData);
        showToast('Project added successfully!');
      }
      resetForm();
      setShowAddForm(false);
    } catch (error: any) {
      showToast(error?.message || 'Failed to save project', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!confirm(`Delete ${projectTitle}?`)) return;
    try {
      await onDeleteProject(id);
      showToast('Project deleted.');
    } catch {
      showToast('Failed to delete project.', true);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const query = searchTerm.toLowerCase();
    const statusMatch = filterStatus === 'All' || project.status === filterStatus;
    return statusMatch && (
      project.title.toLowerCase().includes(query) ||
      project.slug.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  });
  const visibleProjects = isCompact ? filteredProjects.slice(0, 4) : filteredProjects;

  return (
    <div className="flex flex-col gap-5 text-xs">
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
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
            <span>{showAddForm ? 'Cancel' : 'Add Project'}</span>
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
              <h3 className="text-sm font-bold text-foreground">{editingProjectId ? 'Edit Project' : 'Add Project'}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Fill project details below.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Title *</label>
                <input required type="text" value={title} onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  setSlug(value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
                }} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Slug *</label>
                <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Description *</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(resolveImageUrl(e.target.value));
                }} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
                <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Upload Image</label>
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageUpload} className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:opacity-90" />
                  {isUploadingImage && <p className="mt-2 text-[11px] text-muted-foreground">Uploading image...</p>}
                  {imagePreview && <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background"><img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" /></div>}
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Display Order</label>
                <input type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Hero Line 1 (White / Orange)</label>
                <div className="flex gap-2">
                  <input type="text" value={heroTitleLine1White} onChange={(e) => setHeroTitleLine1White(e.target.value)} placeholder="White text" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
                  <input type="text" value={heroTitleLine1Orange} onChange={(e) => setHeroTitleLine1Orange(e.target.value)} placeholder="Orange text" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Hero Line 2 (White / Orange)</label>
                <div className="flex gap-2">
                  <input type="text" value={heroTitleLine2White} onChange={(e) => setHeroTitleLine2White(e.target.value)} placeholder="White text" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
                  <input type="text" value={heroTitleLine2Orange} onChange={(e) => setHeroTitleLine2Orange(e.target.value)} placeholder="Orange text" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Highlights (one per line)</label>
                <textarea rows={4} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Metrics (label|value per line)</label>
                <textarea rows={4} value={metricsText} onChange={(e) => setMetricsText(e.target.value)} placeholder="Downtime|0 min&#10;Reliability|+38%" className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Process Steps (one per line)</label>
                <textarea rows={4} value={processText} onChange={(e) => setProcessText(e.target.value)} className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">Gallery Images</label>
                  <label className="cursor-pointer bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded text-[10px] font-semibold transition-colors">
                    {isUploadingGallery ? 'Uploading...' : 'Upload Images'}
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
                <textarea rows={4} value={galleryText} onChange={(e) => setGalleryText(e.target.value)} placeholder="Upload images or paste URLs (one per line)" className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Client Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Sector</label>
                <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Completed Date</label>
                <input type="text" value={completedDate} onChange={(e) => setCompletedDate(e.target.value)} placeholder="March 2025" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Timeline</label>
                <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="6 wks" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Units Installed</label>
                <input type="text" value={unitsInstalled} onChange={(e) => setUnitsInstalled(e.target.value)} placeholder="48 units" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Uptime</label>
                <input type="text" value={uptime} onChange={(e) => setUptime(e.target.value)} placeholder="99.7%" className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 text-[10px]">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-foreground">
                  <input type="radio" name="projectStatus" checked={status === 'Active'} onChange={() => setStatus('Active')} className="text-primary focus:ring-primary" />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-foreground">
                  <input type="radio" name="projectStatus" checked={status === 'Inactive'} onChange={() => setStatus('Inactive')} className="text-primary focus:ring-primary" />
                  <span>Inactive</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
              <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="px-4 py-2 hover:bg-muted text-muted-foreground font-semibold rounded-lg cursor-pointer">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-60">{loading ? 'Saving...' : (editingProjectId ? 'Update Project' : 'Save Project')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleProjects.map((project) => (
          <div key={project.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-all relative group">
            {!isCompact && (
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEdit(project)} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"><MessageSquarePlus className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(project.id, project.title)} className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-base font-bold text-primary">{(project.title[0] || 'P').toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground truncate">{project.title}</h3>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{project.slug}</span>
                  {project.category && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary">{project.category}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${project.status === 'Active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>{project.status}</span>
              <button onClick={() => onUpdateStatus(project.id, project.status === 'Active' ? 'Inactive' : 'Active')} className="text-muted-foreground hover:text-foreground p-1 transition-all cursor-pointer" title={project.status === 'Active' ? 'Mark as Inactive' : 'Mark as Active'}>
                {project.status === 'Active' ? <ToggleRight className="w-7 h-7 text-success shrink-0" /> : <ToggleLeft className="w-7 h-7 text-muted-foreground shrink-0" />}
              </button>
            </div>
          </div>
        ))}
        {visibleProjects.length === 0 && (
          <div className="col-span-full py-12 text-center bg-card border border-dashed border-border rounded-xl flex flex-col items-center gap-2">
            <Zap className="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
            <p className="text-xs text-muted-foreground">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
