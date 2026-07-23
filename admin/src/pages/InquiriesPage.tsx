import { TInquiry } from '../types';
import RecentInquiries from '../components/RecentInquiries';

interface InquiriesPageProps {
  inquiries: TInquiry[];
  onReply: (id: string, replyText: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InquiriesPage({ inquiries, onReply, onMarkRead, onDelete }: InquiriesPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Client Inquiries</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 0 }}>Audit contact messages, view user requests, and draft formal replies.</p>
      </div>
      <RecentInquiries
        inquiries={inquiries}
        onReply={onReply}
        onMarkRead={onMarkRead}
        onDelete={onDelete}
        isCompact={false}
      />
    </div>
  );
}
