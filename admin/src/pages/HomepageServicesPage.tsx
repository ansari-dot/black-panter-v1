import { useState } from 'react';
import { Search, Star, EyeOff, Loader2 } from 'lucide-react';
import { TService } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const resolveImg = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API}/${url.replace(/^\//, '')}`;
};

interface Props {
  services: TService[];
  onToggleServiceFeatured: (id: string, featured: boolean) => Promise<void>;
}

const PAGE_SIZE = 15;

export default function HomepageServicesPage({ services, onToggleServiceFeatured }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = services.filter(s => {
    const match = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(search.toLowerCase());
    return filter === 'featured' ? !!s.featuredOnHome && match : match;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featuredCount = services.filter(s => s.featuredOnHome).length;

  const toggle = async (id: string, current: boolean) => {
    setLoading(id);
    try { await onToggleServiceFeatured(id, !current); }
    catch { alert('Failed to update'); }
    finally { setLoading(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Home Page — Services</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Choose which services are featured on the public home page.
          <span style={{ marginLeft: 8, padding: '2px 10px', borderRadius: 20, backgroundColor: '#fff3ee', color: '#e84b10', fontSize: 12, fontWeight: 600 }}>
            {featuredCount} featured
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 260, backgroundColor: '#fff' }}>
          <Search size={14} color="#888" strokeWidth={2.5} />
          <input type="text" placeholder="Search services..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', background: 'transparent', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'featured'] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: filter === f ? 'none' : '1px solid #e8e8e8', backgroundColor: filter === f ? '#e84b10' : '#fff', color: filter === f ? '#fff' : '#1a1a1a' }}>
              {f === 'all' ? `All (${services.length})` : `Featured (${featuredCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 120px', padding: '10px 16px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fafafa' }}>
          {['SERVICE', 'CATEGORY', 'STATUS', 'FEATURED'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {paginated.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>No services found.</div>
        ) : paginated.map(s => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 120px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#fff3ee' }}>
                {s.imageUrl ? <img src={resolveImg(s.imageUrl)} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#e84b10' }}>{s.name.charAt(0)}</div>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 1, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</div>
              </div>
            </div>
            <div>{s.category ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: '#fff3ee', color: '#e84b10', fontWeight: 600 }}>{s.category}</span> : <span style={{ color: '#ccc', fontSize: 11 }}>—</span>}</div>
            <div><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 600, backgroundColor: s.status === 'Active' ? '#dcfce7' : '#f5f5f5', color: s.status === 'Active' ? '#16a34a' : '#888' }}>{s.status}</span></div>
            <div>
              <button onClick={() => toggle(s.id, !!s.featuredOnHome)} disabled={loading === s.id}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, border: 'none', cursor: loading === s.id ? 'default' : 'pointer', fontSize: 12, fontWeight: 600, backgroundColor: s.featuredOnHome ? '#dcfce7' : '#f5f5f5', color: s.featuredOnHome ? '#16a34a' : '#888' }}>
                {loading === s.id ? <Loader2 size={13} className="animate-spin" /> : s.featuredOnHome ? <><Star size={12} fill="currentColor" /> Featured</> : <><EyeOff size={12} /> Hidden</>}
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
