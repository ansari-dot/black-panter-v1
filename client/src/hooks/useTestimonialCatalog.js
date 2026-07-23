import { useEffect, useState } from 'react';
import { normalizeTestimonialCatalog } from '../utils/testimonialCatalog';
import { testimonialsApi } from '../utils/api';

export function useTestimonialCatalog() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await testimonialsApi.getAll();
        if (!isMounted) return;
        setTestimonials(normalizeTestimonialCatalog(Array.isArray(data) ? data : []));
        setIsError(false);
      } catch {
        if (!isMounted) return;
        setTestimonials([]);
        setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  return { testimonials, isLoading, isError };
}
