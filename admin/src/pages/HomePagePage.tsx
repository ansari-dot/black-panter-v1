import { TProduct, TService, TProject } from '../types';
import HomePageManager from '../components/HomePageManager';

interface Props {
  products: TProduct[];
  services: TService[];
  projects: TProject[];
  onToggleProductFeatured: (id: string, featured: boolean) => Promise<void>;
  onToggleServiceFeatured: (id: string, featured: boolean) => Promise<void>;
  onToggleProjectFeatured: (id: string, featured: boolean) => Promise<void>;
}

export default function HomePagePage({ products, services, projects, onToggleProductFeatured, onToggleServiceFeatured, onToggleProjectFeatured }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Home Page Manager</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 }}>Control which products, services, and projects are featured on the public home page.</p>
      </div>
      <HomePageManager
        products={products}
        services={services}
        projects={projects}
        onToggleProductFeatured={onToggleProductFeatured}
        onToggleServiceFeatured={onToggleServiceFeatured}
        onToggleProjectFeatured={onToggleProjectFeatured}
      />
    </div>
  );
}
