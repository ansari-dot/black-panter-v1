import { useEffect, useMemo, useState } from 'react';
import { API, normalizeServiceCatalog } from '../utils/serviceCatalog';

export function useServiceCatalog() {
  const [services, setServices] = useState(() => normalizeServiceCatalog([]));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API}/api/services/public`);
        const data = await response.json();
        if (!isMounted) return;
        const catalog = Array.isArray(data) ? normalizeServiceCatalog(data) : normalizeServiceCatalog([]);
        setServices(catalog);
        setIsError(false);
      } catch {
        if (!isMounted) return;
        setServices(normalizeServiceCatalog([]));
        setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeServices = useMemo(
    () => services.filter((service) => service.status !== 'Inactive'),
    [services]
  );

  return {
    services,
    activeServices,
    isLoading,
    isError,
  };
}
