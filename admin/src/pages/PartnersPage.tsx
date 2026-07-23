import { TPartnerItem } from '../types';
import PartnerManager from '../components/PartnerManager';

interface PartnersPageProps {
  partners: TPartnerItem[];
  onAddPartner: (item: Omit<TPartnerItem, 'id' | '_id'>) => Promise<void>;
  onUpdatePartner: (id: string, item: Omit<TPartnerItem, 'id' | '_id'>) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
}

export default function PartnersPage({ partners, onAddPartner, onUpdatePartner, onDeletePartner }: PartnersPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Partner Logos</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 0 }}>Manage the trusted-by logo strip shown across the public site.</p>
      </div>
      <PartnerManager
        partners={partners}
        onAddPartner={onAddPartner}
        onUpdatePartner={onUpdatePartner}
        onDeletePartner={onDeletePartner}
      />
    </div>
  );
}
