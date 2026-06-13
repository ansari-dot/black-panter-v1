/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TService } from '../types';
import ServicesManager from '../components/ServicesManager';
import EquipmentManager from '../components/EquipmentManager';
import { TEquipmentItem } from '../types';

interface ServicesPageProps {
  services: TService[];
  onAddService: (service: {
    name: string;
    slug: string;
    description: string;
    category: string;
    status: 'Active' | 'Inactive';
    iconName: string;
    serviceTagline: string;
    heroDescription: string;
    imageUrl: string;
    ctaText: string;
    secondaryText: string;
    keyHighlights: string[];
    technicalProcedures: Array<{ title: string; description: string; icon: string }>;
    gallery: string[];
    displayOrder: number;
  }) => Promise<void> | void;
  onUpdateService: (id: string, service: any) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteService: (id: string) => Promise<void> | void;
  equipment: TEquipmentItem[];
  onAddEquipment: (item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onUpdateEquipment: (id: string, item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onDeleteEquipment: (id: string) => Promise<void>;
}

export default function ServicesPage({
  services,
  onAddService,
  onUpdateService,
  onUpdateStatus,
  onDeleteService,
  equipment,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment
}: ServicesPageProps) {
  return (
    <div id="tab-services" className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Services Matrix</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Add, modify status, and configure technical workflows.</p>
      </div>
      <ServicesManager
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
