import { useState } from 'react';
import { Monitor, Search, Star, EyeOff, Eye, Image, Battery, Zap, FolderKanban } from 'lucide-react';
import { TProduct, TService, TProject } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImg = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API}/${url.replace(/^\//, '')}`;
};

interface Props {
  products: TProduct[];
  services: TService[];
  projects: TProject[];
  onToggleProductFeatured: (id: string, featured: boolean) => Promise<void>;
  onToggleServiceFeatured: (id: string, featured: boolean) => Promise<void>;
  onToggleProjectFeatured: (id: string, featured: boolean) => Promise<void>;
}

type Section = 'products' | 'services' | 'projects';

export default function HomePageManager({ products, services, projects, onToggleProductFeatured, onToggleServiceFeatured, onToggleProjectFeatured }: Props) {
  const [section, setSection] = useState<Section>('products');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'featured' | 'all'>('featured');
  const [loading, setLoading] = useState<string | null>(null);

  const featuredProducts = products.filter(p => p.featuredOnHome && p.status === 'Active');
  const featuredServices = services.filter(s => s.featuredOnHome && s.status === 'Active');
  const featuredProjects = projects.filter(p => p.featuredOnHome && p.status === 'Active');

  const filteredProducts = products.filter(p => {
    const match = p.name.toLowerCase().includes(search.toLowerCase());
    return view === 'featured' ? p.featuredOnHome && match : match;
  });
  const filteredServices = services.filter(s => {
    const match = (s.name || s.title || '').toLowerCase().includes(search.toLowerCase());
    return view === 'featured' ? s.featuredOnHome && match : match;
  });
  const filteredProjects = projects.filter(p => {
    const match = p.title.toLowerCase().includes(search.toLowerCase());
    return view === 'featured' ? p.featuredOnHome && match : match;
  });

  const toggle = async (id: string, current: boolean, type: Section) => {
    setLoading(id);
    try {
      if (type === 'products') await onToggleProductFeatured(id, !current);
      else if (type === 'services') await onToggleServiceFeatured(id, !current);
      else await onToggleProjectFeatured(id, !current);
    } catch { alert('Failed to update'); }
    finally { setLoading(null); }
  };

  const currentFeatured = section === 'products' ? featuredProducts : section === 'services' ? featuredServices : featuredProjects;
  const currentTotal    = section === 'products' ? products.length : section === 'services' ? services.length : projects.length;
  const currentFiltered = section === 'products' ? filteredProducts : section === 'services' ? filteredServices : filteredProjects;
  const sectionLabel    = section === 'products' ? 'product' : section === 'services' ? 'service' : 'project';

  const SECTIONS: { id: Section; label: string; icon: typeof Battery }[] = [
    { id: 'products', label: 'Products Section', icon: Battery },
    { id: 'services', label: 'Services Section', icon: Zap },
    { id: 'projects', label: 'Projects Section', icon: FolderKanban },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Home Page</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Control which items appear in each section on the client home page.</p>
      </div>

      {/* Section switcher */}
      <div className="flex gap-3 flex-wrap">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setSection(id); setSearch(''); setView('featured'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${section === id ? 'bg-slate-800 text-white border-slate-800' : 'bg-background text-muted-foreground border-border hover:text-foreground'}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Preview banner */}
      <div className="bg-slate-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
          <Monitor className="w-5 h-5 text-orange-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white capitalize">{section} Section Preview</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Currently showing <span className="text-orange-400 font-bold">{currentFeatured.length}</span> {sectionLabel}{currentFeatured.length !== 1 ? 's' : ''} on the home page.
            {currentFeatured.length === 0 && <span className="text-yellow-400 ml-1">⚠ No items selected — section will be empty.</span>}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {currentFeatured.slice(0, 4).map(item => {
            const imgUrl = resolveImg((item as TProduct).imageUrl || (item as TProject).imageUrl || (item as TService).imageUrl);
            const name   = (item as TProduct).name || (item as TProject).title || (item as TService).name || '';
            return (
              <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-orange-500/40 bg-slate-700">
                {imgUrl
                  ? <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Image className="w-4 h-4 text-slate-500" /></div>}
              </div>
            );
          })}
          {currentFeatured.length > 4 && (
            <div className="w-10 h-10 rounded-lg bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
              +{currentFeatured.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${section}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground"
          />
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setView('featured')}
            className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${view === 'featured' ? 'bg-slate-800 text-white' : 'bg-background text-muted-foreground hover:text-foreground'}`}
          >
            <Star className="w-3.5 h-3.5" /> Featured ({currentFeatured.length})
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border-l border-border ${view === 'all' ? 'bg-slate-800 text-white' : 'bg-background text-muted-foreground hover:text-foreground'}`}
          >
            <Eye className="w-3.5 h-3.5" /> All ({currentTotal})
          </button>
        </div>
      </div>

      {/* Grid */}
      {currentFiltered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-xl">
          <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {view === 'featured'
              ? `No featured ${section} yet. Switch to "All" and click the star to feature some.`
              : `No ${section} found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {section === 'products' && filteredProducts.map(p => (
            <ItemCard key={p.id} id={p.id} name={p.name} sub={p.category} price={`$${p.price?.toFixed(2)}`}
              imageUrl={resolveImg(p.imageUrl)} featured={!!p.featuredOnHome} inactive={p.status === 'Inactive'}
              isLoading={loading === p.id} onToggle={() => toggle(p.id, !!p.featuredOnHome, 'products')} />
          ))}
          {section === 'services' && filteredServices.map(s => (
            <ItemCard key={s.id} id={s.id} name={s.name || s.title || ''} sub={s.category || ''}
              imageUrl={resolveImg(s.imageUrl)} featured={!!s.featuredOnHome} inactive={s.status === 'Inactive'}
              isLoading={loading === s.id} onToggle={() => toggle(s.id, !!s.featuredOnHome, 'services')} />
          ))}
          {section === 'projects' && filteredProjects.map(p => (
            <ItemCard key={p.id} id={p.id} name={p.title} sub={p.category || ''}
              imageUrl={resolveImg(p.imageUrl)} featured={!!p.featuredOnHome} inactive={p.status === 'Inactive'}
              isLoading={loading === p.id} onToggle={() => toggle(p.id, !!p.featuredOnHome, 'projects')} />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemCard({ name, sub, price, imageUrl, featured, inactive, isLoading, onToggle }: {
  id: string; name: string; sub: string; price?: string;
  imageUrl?: string; featured: boolean; inactive: boolean;
  isLoading: boolean; onToggle: () => void;
}) {
  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 transition-all ${featured ? 'border-orange-400 shadow-lg shadow-orange-100' : 'border-border'}`}>
      <div className="relative h-44 bg-slate-100">
        {imageUrl
          ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Image className="w-8 h-8 text-slate-300" /></div>}
        {featured && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-white" /> Featured
          </div>
        )}
        {inactive && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Inactive</div>
        )}
      </div>
      <div className="p-3">
        {sub && <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{sub}</p>}
        <h4 className="text-sm font-bold text-foreground leading-tight truncate">{name}</h4>
        {price && <p className="text-sm font-bold text-orange-500 mt-1">{price}</p>}
        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
            featured
              ? 'bg-orange-50 text-orange-600 hover:bg-red-50 hover:text-red-600 border border-orange-200'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {isLoading
            ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : featured
              ? <><EyeOff className="w-3.5 h-3.5" /> Remove from Home</>
              : <><Star className="w-3.5 h-3.5" /> Show on Home</>
          }
        </button>
      </div>
    </div>
  );
}
