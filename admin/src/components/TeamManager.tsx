/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useRef } from 'react';
import { Users, Mail, UserPlus, Trash2, Calendar, Search, UserCheck, Upload } from 'lucide-react';
import { TTeamMember } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface TeamManagerProps {
  team: TTeamMember[];
  onAddMember: (name: string, role: string, email: string, status: 'Active' | 'On Leave', image?: string) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'On Leave') => Promise<void> | void;
  onDeleteMember: (id: string) => Promise<void> | void;
}

export default function TeamManager({ team, onAddMember, onUpdateStatus, onDeleteMember }: TeamManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave'>('Active');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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
      setImageUrl('');
      setImagePreview('');
      setImageFileName('');
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setEmail('');
    setStatus('Active');
    setImageUrl('');
    setImagePreview('');
    setImageFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) return;
    if (uploadingImage) return;
    await onAddMember(name.trim(), role.trim(), email.trim(), status, imageUrl || undefined);
    resetForm();
    setShowAddForm(false);
    setSuccessMsg('Team member added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredTeam = team.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="team-manager-container" className="flex flex-col gap-5">

      {/* Search & action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add Member'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-success/10 border border-success/20 text-success text-xs rounded-lg font-semibold flex items-center gap-2 animate-fade-in">
          <UserCheck className="w-4 h-4" />{successMsg}
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-5 animate-slide-up">
          <h3 className="text-sm font-bold text-foreground font-headings mb-4">Add Team Member</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Full Name</label>
              <input required type="text" placeholder="e.g. Sarah Johnson" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Role</label>
              <input required type="text" placeholder="e.g. Battery Engineer" value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Email</label>
              <input required type="email" placeholder="sarah@blackpanther.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
            </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'On Leave')}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Team Photo</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleImageChange} />
                  {imagePreview ? <img src={imagePreview} alt="Team preview" className="w-10 h-10 rounded-full object-cover border border-border" /> : null}
                  {imageFileName ? <span className="text-muted-foreground truncate max-w-[180px]">{imageFileName}</span> : null}
                  {uploadingImage ? <span className="text-primary">Uploading...</span> : null}
                </div>
              </div>
            <div className="md:col-span-4 flex justify-end gap-2.5 pt-2 border-t border-border">
              <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground font-semibold cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 cursor-pointer">Add Member</button>
            </div>
          </form>
        </div>
      )}

      {/* Team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTeam.map((member) => {
          const initials = member.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <div key={member.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative group">
              <button
                onClick={() => { if (confirm(`Remove "${member.name}" from the team?`)) onDeleteMember(member.id); }}
                className="absolute right-3 top-3 p-1 rounded text-muted-foreground hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-semibold text-xs shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 pr-4">
                  <h4 className="font-semibold text-foreground text-sm truncate">{member.name}</h4>
                  <p className="text-muted-foreground text-xs truncate mt-0.5">{member.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{member.email}</span></div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" /><span>Joined {member.joinedDate}</span></div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
                <button
                  onClick={() => onUpdateStatus(member.id, member.status === 'Active' ? 'On Leave' : 'Active')}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                    member.status === 'Active' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
                  }`}
                >
                  {member.status}
                </button>
              </div>
            </div>
          );
        })}

        {filteredTeam.length === 0 && (
          <div className="col-span-full py-12 text-center bg-card border border-dashed border-border rounded-xl flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
            <p className="text-xs text-muted-foreground">No team members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
