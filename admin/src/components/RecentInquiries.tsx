/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Mail, Search, Trash2, Reply, Send, CheckCircle2, ChevronRight, X, Clock } from 'lucide-react';
import { TInquiry } from '../types';

interface RecentInquiriesProps {
  inquiries: TInquiry[];
  onReply: (id: string, replyText: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isCompact?: boolean;
}

export default function RecentInquiries({
  inquiries,
  onReply,
  onMarkRead,
  onDelete,
  isCompact = false
}: RecentInquiriesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<TInquiry | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Filter & Search logic
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = activeFilter === 'All' || inq.status === activeFilter;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Limit items shown in compact layout
  const displayedInquiries = isCompact ? inquiries.slice(0, 5) : filteredInquiries;

  const handleOpenInquiry = (inq: TInquiry) => {
    setSelectedInquiry(inq);
    onMarkRead(inq.id);
    setReplyInput('');
    setShowReplyForm(false);
  };

  const handleSendReplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedInquiry) return;
    onReply(selectedInquiry.id, replyInput);
    
    // update current look to reflected replied status
    setSelectedInquiry({
      ...selectedInquiry,
      status: 'Replied',
      replyText: replyInput,
      replyDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setReplyInput('');
    setShowReplyForm(false);
  };

  return (
    <div id="recent-inquiries-container" className="bg-card border border-border rounded-lg flex flex-col h-full overflow-hidden">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-border gap-3">
        <div>
          <h2 className="text-base font-semibold font-headings text-foreground">Client Inquiries</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isCompact ? 'Latest messages from clients' : `${filteredInquiries.length} inquiries`}
          </p>
        </div>

        {/* Filters and search ONLY on full tab or long view */}
        {!isCompact && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input bar */}
            <div className="relative min-w-44">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-muted/30 focus:outline-none focus:border-primary focus:bg-background text-foreground"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center rounded-md bg-muted p-0.5 border border-border shrink-0">
              {(['All', 'New', 'Read', 'Replied'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2 py-1 text-[11px] font-sans font-medium rounded cursor-pointer transition-colors ${
                    activeFilter === filter
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry rows */}
      <div className="divide-y divide-border overflow-y-auto max-h-[500px]">
        {displayedInquiries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground font-sans italic">No inquiries matched your criteria.</p>
            {!isCompact && (
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="mt-3 text-xs text-primary font-semibold underline hover:text-opacity-80 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          displayedInquiries.map((inq) => {
            const avatarChar = inq.name.charAt(0).toUpperCase();
            
            return (
              <div
                key={inq.id}
                onClick={() => handleOpenInquiry(inq)}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer group last:border-b-0 ${
                  inq.status === 'New' ? 'bg-primary/5 font-medium' : ''
                }`}
              >
                {/* Avatar Initials */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  inq.status === 'New' 
                    ? 'bg-primary/20 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {avatarChar}
                </div>

                {/* Profile Meta info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold font-sans text-foreground truncate">{inq.name}</span>
                    {inq.status === 'New' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" title="Unread"></span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{inq.email}</div>
                </div>

                {/* Subject Preview Column */}
                <div className="hidden md:block flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{inq.subject}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1 font-sans mt-0.5">{inq.message}</div>
                </div>

                {/* Date Display */}
                <div className="text-xs text-muted-foreground w-22 text-right shrink-0">
                  {inq.date}
                </div>

                {/* Badge Status */}
                <div className="shrink-0 w-20 text-right">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    inq.status === 'New'
                      ? 'bg-primary/20 text-primary-foreground'
                      : inq.status === 'Replied'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                {/* Quick Arrow / Action indicator */}
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
            );
          })
        )}
      </div>

      {isCompact && inquiries.length > 5 && (
        <div className="bg-muted/30 p-2.5 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">Some older messages are deferred. Navigate to "Client Inquiries" tab to read all.</p>
        </div>
      )}

      {/* Inquiry Detail Interactive Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  selectedInquiry.status === 'New'
                    ? 'bg-primary/20 text-primary-foreground'
                    : selectedInquiry.status === 'Replied'
                    ? 'bg-success/15 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {selectedInquiry.status}
                </span>
                <span className="text-xs text-muted-foreground">{selectedInquiry.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { onDelete(selectedInquiry.id); setSelectedInquiry(null); }}
                  className="p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                  title="Discard inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              {/* Sender Details */}
              <div className="flex items-start gap-3 bg-muted/40 p-4 rounded-md">
                <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0">
                  {selectedInquiry.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{selectedInquiry.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedInquiry.email}</p>
                  <div className="text-xs text-foreground font-semibold mt-2">Subject: {selectedInquiry.subject}</div>
                </div>
              </div>

              {/* Message content */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Message:</span>
                <div className="mt-1 text-sm text-foreground bg-muted/10 border border-border p-4 rounded-md whitespace-pre-wrap leading-relaxed font-sans">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Previous Reply details if exist */}
              {selectedInquiry.replyText && (
                <div className="bg-success/5 border border-success/10 p-4 rounded-md">
                  <div className="flex items-center justify-between text-xs text-success font-semibold font-sans mb-1.5">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      Reply Sent
                    </span>
                    <span className="font-mono text-[10px] text-success/80">{selectedInquiry.replyDate}</span>
                  </div>
                  <p className="text-xs text-foreground italic whitespace-pre-wrap leading-relaxed">
                    "{selectedInquiry.replyText}"
                  </p>
                </div>
              )}

              {/* Reply Form Trigger */}
              {!selectedInquiry.replyText && !showReplyForm && (
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-dashed border-primary/50 text-xs font-semibold text-primary hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reply</span>
                </button>
              )}

              {/* Reply inputs */}
              {showReplyForm && (
                <form onSubmit={handleSendReplySubmit} className="flex flex-col gap-3 animate-slide-up">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">To: {selectedInquiry.name} &lt;{selectedInquiry.email}&gt;</label>
                    <textarea
                      required
                      rows={4}
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full text-xs p-3 rounded-md border border-border focus:outline-none focus:border-primary font-sans text-foreground bg-background leading-relaxed"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-2 text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setShowReplyForm(false)}
                      className="px-3 py-1.5 rounded hover:bg-muted text-muted-foreground transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-primary text-primary-foreground font-bold flex items-center gap-1.5 hover:bg-opacity-90 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-primary-foreground" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-1.5 text-xs font-bold font-sans rounded bg-card border border-border text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
