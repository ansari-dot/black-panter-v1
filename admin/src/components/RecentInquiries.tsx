import { useState, FormEvent } from 'react';
import { Search, Trash2, Send, Eye, ChevronLeft, ChevronRight, Reply } from 'lucide-react';
import { TInquiry } from '../types';

interface Props {
  inquiries: TInquiry[];
  onReply: (id: string, replyText: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isCompact?: boolean;
}

const PAGE_SIZE = 15;

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  New:     { background: '#fff3ee', color: '#e84b10' },
  Read:    { background: '#f5f5f5', color: '#888' },
  Replied: { background: '#dcfce7', color: '#16a34a' },
};

const COL = '1.8fr 2fr 1fr 110px 160px';

export default function RecentInquiries({ inquiries, onReply, onMarkRead, onDelete, isCompact = false }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = inquiries.filter((inq) => {
    const matchFilter = activeFilter === 'All' || inq.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.subject.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const displayed = isCompact ? inquiries.slice(0, 5) : filtered;
  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));
  const paginated = isCompact ? displayed : displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  const handleSendReply = (e: FormEvent, inq: TInquiry) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onReply(inq.id, replyInput.trim());
    setReplyInput('');
    setOpenReplyId(null);
  };

  const openReply = (inq: TInquiry) => {
    onMarkRead(inq.id);
    setOpenReplyId(inq.id);
    setReplyInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Toolbar — hidden in compact mode */}
      {!isCompact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
            <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#aaa' }} />
            <input
              type="text"
              placeholder="Search inquiries…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '8px 10px', paddingLeft: 30, fontSize: 12, borderRadius: 6, border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box' }}
            />
          </div>

          {/* Status filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f5f5f5', borderRadius: 8, padding: '3px 4px', border: '1px solid #e8e8e8' }}>
            {(['All', 'New', 'Read', 'Replied'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: activeFilter === f ? '#fff' : 'transparent',
                  color: activeFilter === f ? '#1a1a1a' : '#888',
                  boxShadow: activeFilter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        {!isCompact && (
          <div style={{ display: 'grid', gridTemplateColumns: COL, background: '#fafafa', borderBottom: '1px solid #e8e8e8', padding: '0 16px' }}>
            {['Contact', 'Subject', 'Service', 'Date', 'Status / Actions'].map((col) => (
              <div key={col} style={{ padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>{col}</div>
            ))}
          </div>
        )}

        {paginated.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>No inquiries found.</div>
        ) : (
          paginated.map((inq) => {
            const isHovered = hoveredRow === inq.id;
            const isReplyOpen = openReplyId === inq.id;
            const ss = STATUS_STYLE[inq.status] || STATUS_STYLE.Read;
            const initial = inq.name.charAt(0).toUpperCase();

            return (
              <div key={inq.id}>
                {/* Row */}
                <div
                  onMouseEnter={() => setHoveredRow(inq.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid', gridTemplateColumns: COL,
                    padding: '0 16px', borderBottom: isReplyOpen ? 'none' : '1px solid #f0f0f0',
                    background: inq.status === 'New' ? '#fffaf8' : isHovered ? '#fafafa' : '#fff',
                    alignItems: 'center', transition: 'background 0.15s',
                  }}
                >
                  {/* Contact */}
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: inq.status === 'New' ? '#fff3ee' : '#f5f5f5',
                      color: inq.status === 'New' ? '#e84b10' : '#888',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, border: '1px solid #e8e8e8',
                    }}>
                      {initial}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: inq.status === 'New' ? 700 : 600, color: '#1a1a1a' }}>{inq.name}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{inq.email}</div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                    {inq.subject}
                  </div>

                  {/* Service */}
                  <div style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.service || <span style={{ color: '#ccc' }}>—</span>}
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: 12, color: '#aaa' }}>{inq.date}</div>

                  {/* Status + Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, ...ss }}>
                      {inq.status}
                    </span>
                    {/* Mark Read */}
                    {inq.status === 'New' && (
                      <button
                        title="Mark as read"
                        onClick={() => onMarkRead(inq.id)}
                        style={{ background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center', opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s' }}
                      >
                        <Eye style={{ width: 13, height: 13, color: '#555' }} />
                      </button>
                    )}
                    {/* Reply */}
                    <button
                      title="Reply"
                      onClick={() => isReplyOpen ? setOpenReplyId(null) : openReply(inq)}
                      style={{ background: isReplyOpen ? '#fff3ee' : 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center', opacity: isHovered || isReplyOpen ? 1 : 0, transition: 'opacity 0.15s' }}
                    >
                      <Reply style={{ width: 13, height: 13, color: isReplyOpen ? '#e84b10' : '#555' }} />
                    </button>
                    {/* Delete */}
                    <button
                      title="Delete"
                      onClick={() => { if (confirm(`Delete inquiry from ${inq.name}?`)) { onDelete(inq.id); if (openReplyId === inq.id) setOpenReplyId(null); } }}
                      style={{ background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center', opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s' }}
                    >
                      <Trash2 style={{ width: 13, height: 13, color: '#dc2626' }} />
                    </button>
                  </div>
                </div>

                {/* Inline reply panel */}
                {isReplyOpen && (
                  <div style={{ borderBottom: '1px solid #f0f0f0', background: '#fffaf8', padding: '12px 16px 16px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Reply to {inq.name} &lt;{inq.email}&gt;
                    </div>
                    {inq.replyText ? (
                      <div style={{ fontSize: 12, color: '#16a34a', background: '#dcfce7', padding: '10px 12px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                        Already replied: "{inq.replyText}"
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleSendReply(e, inq)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <textarea
                          required
                          rows={3}
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          placeholder="Type your reply…"
                          style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => setOpenReplyId(null)}
                            style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6, border: 'none', background: '#e84b10', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            <Send style={{ width: 12, height: 12 }} />
                            Send Reply
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Compact footer note */}
      {isCompact && inquiries.length > 5 && (
        <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: '#aaa', borderTop: '1px solid #f0f0f0' }}>
          Showing 5 of {inquiries.length}. Go to "Client Inquiries" tab to view all.
        </div>
      )}

      {/* Pagination */}
      {!isCompact && totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          <button onClick={() => goTo(page - 1)} disabled={page === 1}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
            <ChevronLeft style={{ width: 14, height: 14, color: '#888' }} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => goTo(p)}
              style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: 600, border: p === page ? 'none' : '1px solid #e8e8e8', background: p === page ? '#e84b10' : '#fff', color: p === page ? '#fff' : '#1a1a1a', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
          <button onClick={() => goTo(page + 1)} disabled={page === totalPages}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
            <ChevronRight style={{ width: 14, height: 14, color: '#888' }} />
          </button>
        </div>
      )}
    </div>
  );
}
