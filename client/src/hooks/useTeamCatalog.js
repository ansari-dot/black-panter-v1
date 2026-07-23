import { useEffect, useMemo, useState } from 'react';
import { normalizeTeamCatalog } from '../utils/teamCatalog';
import { teamApi } from '../utils/api';

export function useTeamCatalog() {
  const [members, setMembers] = useState(() => normalizeTeamCatalog([]));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await teamApi.getAll();
        if (!isMounted) return;
        setMembers(normalizeTeamCatalog(Array.isArray(data) ? data : []));
        setIsError(false);
      } catch {
        if (!isMounted) return;
        setMembers(normalizeTeamCatalog([]));
        setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  const activeMembers = useMemo(
    () => members.filter((m) => m.status !== 'Inactive'),
    [members]
  );

  return { members, activeMembers, isLoading, isError };
}
