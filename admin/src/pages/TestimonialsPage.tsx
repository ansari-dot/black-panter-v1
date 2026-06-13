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
    <div className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Testimonials Hub</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage client testimonials — add, approve, reject or delete.</p>
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
