import { useState, FormEvent, useRef } from 'react';
import { UserPlus, Trash2, Search, Upload, ChevronLeft, ChevronRight, X, Pencil, Facebook, Linkedin, Instagram, Twitter } from 'lucide-react';
import { TTeamMember } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BRAND = '#f15a22';

const resolveImg = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `${API}${url}`;
  return `${API}/${url.replace(/^\//, '')}`;
};

interface TeamManagerProps {
  team: TTeamMember[];
  onAddMember: (data: { name: string; role: string; email: string; status: 'Active' | 'On Leave'; image?: string; linkedin?: string; facebook?: string; instagram?: string; twitter?: string }) => Promise<void> | void;
  onUpdateMember?: (id: string, data: Partial<TTeamMember>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'On Leave') => Promise<void> | void;
  onDeleteMember: (id: string) => Promise<void> | void;
}

const PAGE_SIZE = 15;

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: '#888', marginBottom: 4,
};
const inp: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6,
  border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a',
  boxSizing: 'border-box',
};

const COL_TEMPLATE = '2fr 1.4fr 1fr 100px 160px';

// ── Social link icon helper ────────────────────────────────────────────────
const socialMeta = {
  linkedin:  { Icon: Linkedin,  color: '#0077B5' },
  facebook:  { Icon: Facebook,  color: '#1877F2' },
  instagram: { Icon: Instagram, color: '#E4405F' },
  twitter:   { Icon: Twitter,   color: '#000000' },
} as const;

type SocialPlatform = keyof typeof socialMeta;

function SocialBtn({ platform, url }: { platform: SocialPlatform; url?: string }) {
  const [hovered, setHovered] = useState(false);
  if (!url) return null;
  const { Icon, color } = socialMeta[platform];
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28, height: 28,
        borderRadius: '50%',
        backgroundColor: hovered ? color : BRAND,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        transform: hovered ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      <Icon style={{ width: 13, height: 13, color: '#fff' }} />
    </a>
  );
}

export default function TeamManager({ team, onAddMember, onUpdateMember, onUpdateStatus, onDeleteMember }: TeamManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TTeamMember | null>(null);
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave'>('Active');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  // Social
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API}/api/upload`, { method: 'POST', credentials: 'include', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Image upload failed');
    return data.url as string;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setImageFileName(file.name);
    setImagePreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      setImagePreview(url.startsWith('/uploads/') ? `${API}${url}` : url);
    } catch {
      setImageUrl(''); setImagePreview(''); setImageFileName('');
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setName(''); setRole(''); setEmail(''); setStatus('Active');
    setImageUrl(''); setImagePreview(''); setImageFileName('');
    setLinkedin(''); setFacebook(''); setInstagram(''); setTwitter('');
    if (fileRef.current) fileRef.current.value = '';
    setEditingMember(null);
  };

  const openAdd = () => { resetForm(); setShowModal(true); };

  const openEdit = (member: TTeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setEmail(member.email);
    setStatus(member.status);
    setImageUrl(member.image || '');
    setImagePreview(member.image ? resolveImg(member.image) : '');
    setImageFileName('');
    setLinkedin((member as any).linkedin || '');
    setFacebook((member as any).facebook || '');
    setInstagram((member as any).instagram || '');
    setTwitter((member as any).twitter || '');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); resetForm(); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) return;
    if (uploadingImage) return;

    const socialData = {
      linkedin: linkedin.trim() || undefined,
      facebook: facebook.trim() || undefined,
      instagram: instagram.trim() || undefined,
      twitter: twitter.trim() || undefined,
    };

    if (editingMember && onUpdateMember) {
      await onUpdateMember(editingMember.id, {
        name: name.trim(), role: role.trim(), email: email.trim(), status,
        image: imageUrl || undefined, ...socialData,
      });
    } else {
      await onAddMember({
        name: name.trim(), role: role.trim(), email: email.trim(), status,
        image: imageUrl || undefined, ...socialData,
      });
    }
    resetForm();
    setShowModal(false);
  };

  const filteredTeam = team.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredTeam.length / PAGE_SIZE));
  const paginated = filteredTeam.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 300 }}>
          <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#aaa' }} />
          <input
            type="text" placeholder="Search members…"
            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            style={{ ...inp, paddingLeft: 30 }}
          />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: BRAND, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <UserPlus style={{ width: 14, height: 14 }} /> Add Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, background: '#fafafa', borderBottom: '1px solid #e8e8e8', padding: '0 16px' }}>
          {['Member', 'Role', 'Joined', 'Status', 'Actions'].map((col) => (
            <div key={col} style={{ padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>{col}</div>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>No team members found.</div>
        ) : (
          paginated.map((member) => {
            const initial = member.name.charAt(0).toUpperCase();
            const imgSrc = member.image ? resolveImg(member.image) : '';
            const isHovered = hoveredRow === member.id;
            return (
              <div key={member.id}
                onMouseEnter={() => setHoveredRow(member.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, padding: '0 16px', borderBottom: '1px solid #f0f0f0', background: isHovered ? '#fafafa' : '#fff', alignItems: 'center', transition: 'background 0.15s' }}
              >
                {/* Member */}
                <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {imgSrc
                    ? <img src={imgSrc} alt={member.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e8e8e8', flexShrink: 0 }} />
                    : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff3ee', color: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, border: '1px solid #ffe0d3' }}>{initial}</div>
                  }
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{member.name}</div>
                      {/* Social icons — slide up on row hover */}
                      <div style={{
                        display: 'flex', gap: 5, alignItems: 'center',
                        overflow: 'hidden',
                        maxHeight: isHovered ? 32 : 0,
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'max-height 0.25s ease, opacity 0.25s ease, transform 0.25s ease',
                      }}>
                        <SocialBtn platform="linkedin"  url={(member as any).linkedin} />
                        <SocialBtn platform="facebook"  url={(member as any).facebook} />
                        <SocialBtn platform="instagram" url={(member as any).instagram} />
                        <SocialBtn platform="twitter"   url={(member as any).twitter} />
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{member.email}</div>
                  </div>
                </div>

                {/* Role */}
                <div style={{ fontSize: 12, color: '#555' }}>{member.role}</div>

                {/* Joined */}
                <div style={{ fontSize: 12, color: '#aaa' }}>{member.joinedDate}</div>

                {/* Status */}
                <div>
                  <button
                    onClick={() => onUpdateStatus(member.id, member.status === 'Active' ? 'On Leave' : 'Active')}
                    title="Click to toggle status"
                    style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: member.status === 'Active' ? '#dcfce7' : '#fef3c7', color: member.status === 'Active' ? '#16a34a' : '#d97706' }}
                  >
                    {member.status}
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s' }}>
                  <button
                    title="Edit member"
                    onClick={() => openEdit(member)}
                    style={{ background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center' }}
                  >
                    <Pencil style={{ width: 13, height: 13, color: BRAND }} />
                  </button>
                  <button
                    title="Delete member"
                    onClick={() => { if (confirm(`Remove "${member.name}" from the team?`)) onDeleteMember(member.id); }}
                    style={{ background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 style={{ width: 13, height: 13, color: '#dc2626' }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          <button onClick={() => goTo(page - 1)} disabled={page === 1} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
            <ChevronLeft style={{ width: 14, height: 14, color: '#888' }} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => goTo(p)} style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: 600, border: p === page ? 'none' : '1px solid #e8e8e8', background: p === page ? BRAND : '#fff', color: p === page ? '#fff' : '#1a1a1a', cursor: 'pointer' }}>{p}</button>
          ))}
          <button onClick={() => goTo(page + 1)} disabled={page === totalPages} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
            <ChevronRight style={{ width: 14, height: 14, color: '#888' }} />
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e8e8e8' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
                <X style={{ width: 18, height: 18, color: '#888' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Member Info */}
                <div style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member Info</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Full Name</label>
                    <input required type="text" placeholder="e.g. Sarah Johnson" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Role</label>
                    <input required type="text" placeholder="e.g. Battery Engineer" value={role} onChange={(e) => setRole(e.target.value)} style={inp} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Email</label>
                    <input required type="email" placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'On Leave')} style={{ ...inp, cursor: 'pointer' }}>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo */}
                <div style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Profile Photo</div>
                <div>
                  <label style={lbl}>Photo (jpg, jpeg, png, webp)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px dashed #e8e8e8', borderRadius: 6, background: '#fafafa', color: '#888', fontSize: 12, cursor: 'pointer' }}>
                      <Upload style={{ width: 13, height: 13 }} />
                      {uploadingImage ? 'Uploading…' : 'Upload Image'}
                    </button>
                    <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e8e8e8' }} />}
                    {imageFileName && <span style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{imageFileName}</span>}
                  </div>
                </div>

                {/* Social Links */}
                <div style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Social Media Links</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Linkedin style={{ width: 11, height: 11 }} /> LinkedIn</span></label>
                    <input type="url" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Facebook style={{ width: 11, height: 11 }} /> Facebook</span></label>
                    <input type="url" placeholder="https://facebook.com/..." value={facebook} onChange={(e) => setFacebook(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Instagram style={{ width: 11, height: 11 }} /> Instagram</span></label>
                    <input type="url" placeholder="https://instagram.com/..." value={instagram} onChange={(e) => setInstagram(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Twitter style={{ width: 11, height: 11 }} /> X / Twitter</span></label>
                    <input type="url" placeholder="https://x.com/..." value={twitter} onChange={(e) => setTwitter(e.target.value)} style={inp} />
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid #e8e8e8' }}>
                <button type="button" onClick={closeModal} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={uploadingImage}
                  style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: BRAND, color: '#fff', fontSize: 12, fontWeight: 700, cursor: uploadingImage ? 'not-allowed' : 'pointer', opacity: uploadingImage ? 0.6 : 1 }}>
                  {editingMember ? 'Save Changes' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
