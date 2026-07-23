import { useState } from 'react';
import { Search, Star, EyeOff, Loader2 } from 'lucide-react';
import { TProject } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const resolveImg = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API}/${url.replace(/^\//, '')}`;
};

interface Props {
  projects: TProject[];
  onToggleProjectFeatured: (id: string, featured: boolean) => Promise<void>;
}

const PAGE_SIZE = 15;

export default function HomepageProjectsPage({ projects, onToggleProjectFeatured }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    const match = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName || '').toLowerCase().includes(search.toLowerCase());
    return filter === 'featured' ? !!p.featuredOnHome && match : match;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featuredCount = projects.filter(p => p.featuredOnHome).length;

  const toggle = async (id: string, current: boolean) => {
    setLoading(id);
    try { await onToggleProjectFeatured(id, !current); }
    catch { alert('Failed to update'); }
    finally { setLoading(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Home Page — Projects</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Choose which projects are featured on the public home page.
          <span style={{ marginLeft: 8, padding: '2px 10px', borderRadius: 20, backgroundColor: '#fff3ee', color: '#e84b10', fontSize: 12, fontWeight: 600 }}>
            {featuredCount} featured
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 260, backgroundColor: '#fff' }}>
          <Search size={14} color="#888" strokeWidth={2.5} />
          <input type="text" placeholder="Search projects..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', background: 'transparent', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'featured'] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: filter === f ? 'none' : '1px solid #e8e8e8', backgroundColor: filter === f ? '#e84b10' : '#fff', color: filter === f ? '#fff' : '#1a1a1a' }}>
              {f === 'all' ? `All (${projects.length})` : `Featured (${featuredCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 120px', padding: '10px 16px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fafafa' }}>
          {['PROJECT', 'CATEGORY', 'CLIENT', 'FEATURED'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {paginated.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>No projects found.</div>
        ) : paginated.map(p => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 120px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#fff3ee' }}>
                {p.imageUrl ? <img src={resolveImg(p.imageUrl)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#e84b10' }}>{p.title.charAt(0)}</div>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{p.title}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 1, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
              </div>
            </div>
            <div>{p.category ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: '#fff3ee', color: '#e84b10', fontWeight: 600 }}>{p.category}</span> : <span style={{ color: '#ccc', fontSize: 11 }}>—</span>}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{p.clientName || '—'}</div>
            <div>
              <button onClick={() => toggle(p.id, !!p.featuredOnHome)} disabled={loading === p.id}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, border: 'none', cursor: loading === p.id ? 'default' : 'pointer', fontSize: 12, fontWeight: 600, backgroundColor: p.featuredOnHome ? '#dcfce7' : '#f5f5f5', color: p.featuredOnHome ? '#16a34a' : '#888' }}>
                {loading === p.id ? <Loader2 size={13} className="animate-spin" /> : p.featuredOnHome ? <><Star size={12} fill="currentColor" /> Featured</> : <><EyeOff size={12} /> Hidden</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: '#888' }}>Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ width:28,height:28,border:'1px solid #e8e8e8',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center' }}>‹</button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPage(n)} style={{ width:28,height:28,border:'none',borderRadius:6,cursor:'pointer',fontSize:13,fontWeight:n===page?600:400,backgroundColor:n===page?'#e84b10':'transparent',color:n===page?'#fff':'#1a1a1a' }}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:28,height:28,border:'1px solid #e8e8e8',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center' }}>›</button>
          </div>
          <div style={{ fontSize: 11, color: '#888' }}>{PAGE_SIZE} per page</div>
        </div>
      )}
    </div>
  );
}
