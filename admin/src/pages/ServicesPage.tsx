import { TService, TEquipmentItem } from '../types';
import ServicesManagerNew from '../components/ServicesManagerNew';
import EquipmentManager from '../components/EquipmentManager';

interface ServicesPageProps {
  services: TService[];
  onAddService: (service: {
    name: string; slug: string; description: string; category: string;
    status: 'Active' | 'Inactive'; iconName: string; serviceTagline: string;
    heroDescription: string; imageUrl: string; ctaText: string; secondaryText: string;
    keyHighlights: string[]; technicalProcedures: Array<{ title: string; description: string; icon: string }>;
    gallery: string[]; displayOrder: number;
  }) => Promise<void> | void;
  onUpdateService: (id: string, service: any) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteService: (id: string) => Promise<void> | void;
  equipment: TEquipmentItem[];
  onAddEquipment: (item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onUpdateEquipment: (id: string, item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onDeleteEquipment: (id: string) => Promise<void>;
}

export default function ServicesPage({ services, onAddService, onUpdateService, onUpdateStatus, onDeleteService, equipment, onAddEquipment, onUpdateEquipment, onDeleteEquipment }: ServicesPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Services Matrix</div>
        <div style={{ fontSize: 13, color: '#888888', marginTop: 4 }}>Add, modify status, and configure technical workflows.</div>
      </div>
      <ServicesManagerNew
        services={services}
        onAddService={onAddService}
        onUpdateService={onUpdateService}
        onUpdateStatus={onUpdateStatus}
        onDeleteService={onDeleteService}
        isCompact={false}
      />
      <EquipmentManager
        equipment={equipment}
        onAddEquipment={onAddEquipment}
        onUpdateEquipment={onUpdateEquipment}
        onDeleteEquipment={onDeleteEquipment}
      />
    </div>
  );
}
