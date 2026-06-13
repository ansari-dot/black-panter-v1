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
    <div id="tab-partners" className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Partner Logos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage the trusted-by logo strip shown across the public site.</p>
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
