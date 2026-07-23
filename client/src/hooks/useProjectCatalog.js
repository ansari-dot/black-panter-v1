import { useEffect, useMemo, useState } from 'react';
import { normalizeProjectCatalog, normalizeProject } from '../utils/projectCatalog';
import { projectsApi } from '../utils/api';

export function useProjectCatalog({ featuredOnHome = false } = {}) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const url = featuredOnHome
          ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects/public?featuredOnHome=true`
          : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects/public`;
        const res = await fetch(url);
        const data = await res.json();
        if (!isMounted) return;
        setProjects(normalizeProjectCatalog(Array.isArray(data) ? data : []));
        setIsError(false);
      } catch {
        if (!isMounted) return;
        setProjects([]);
        setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [featuredOnHome]);

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status !== 'Inactive'),
    [projects]
  );

  return { projects, activeProjects, isLoading, isError };
}

export async function fetchProjectBySlug(slug) {
  const data = await projectsApi.getBySlug(slug);
  return normalizeProject(data);
}
