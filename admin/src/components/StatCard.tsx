import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  idPrefix: string;
  title: string;
  value: string | number;
  trendText: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  bgType?: 'accent' | 'default';
  onClickInfo?: () => void;
}

export default function StatCard({ idPrefix, title, value, trendText, trendType = 'positive', icon: Icon, onClickInfo }: StatCardProps) {
  const iconBg = trendType === 'negative' ? '#fee2e2' : trendType === 'neutral' ? '#ffedd5' : '#dcfce7';
  const iconColor = trendType === 'negative' ? '#ef4444' : trendType === 'neutral' ? '#f97316' : '#22c55e';

  return (
    <div
      id={`${idPrefix}-card`}
      onClick={onClickInfo}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e2e2',
        borderRadius: 8,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: onClickInfo ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginTop: 4, lineHeight: 1 }}>{value}</div>
        </div>
        <div style={{ borderRadius: '50%', padding: 10, backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} strokeWidth={2.4} />
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#8a8a8a' }}>{trendText}</div>
    </div>
  );
}
