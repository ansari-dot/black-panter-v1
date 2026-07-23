import { TTestimonial } from '../types';
import TestimonialsManager from '../components/TestimonialsManager';

interface Props {
  testimonials: TTestimonial[];
  onAddTestimonial: (formData: FormData) => Promise<void>;
  onUpdateStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
}

export default function TestimonialsPage({ testimonials, onAddTestimonial, onUpdateStatus, onDeleteTestimonial }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Testimonials Hub</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 0 }}>Manage client testimonials — add, approve, reject, or delete.</p>
      </div>
      <TestimonialsManager
        testimonials={testimonials}
        onAddTestimonial={onAddTestimonial}
        onUpdateStatus={onUpdateStatus}
        onDeleteTestimonial={onDeleteTestimonial}
      />
    </div>
  );
}
