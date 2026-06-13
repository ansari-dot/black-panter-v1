/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TInquiry } from '../types';
import RecentInquiries from '../components/RecentInquiries';

interface InquiriesPageProps {
  inquiries: TInquiry[];
  onReply: (id: string, replyText: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InquiriesPage({
  inquiries,
  onReply,
  onMarkRead,
  onDelete
}: InquiriesPageProps) {
  return (
    <div id="tab-inquiries" className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Client Inquiries Gateway</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Audit contact messages, view user requests, and draft formal replies.</p>
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
