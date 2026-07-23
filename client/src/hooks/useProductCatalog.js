import { useEffect, useMemo, useState } from 'react';
import { normalizeProductCatalog } from '../utils/productCatalog';
import { productsApi } from '../utils/api';

export function useProductCatalog({ page = 1, limit = 12, category } = {}) {
  const [products, setProducts] = useState(() => normalizeProductCatalog([]));
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const res = await productsApi.getAll({
          status: 'Active',
          page,
          limit,
          category: category || undefined,
        });
        if (!isMounted) return;
        const records = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        setProducts(normalizeProductCatalog(records));
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || records.length);
        setIsError(false);
      } catch {
        if (!isMounted) return;
        setProducts(normalizeProductCatalog([]));
        setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => { isMounted = false; };
  }, [page, limit, category]);

  const activeProducts = useMemo(
    () => products.filter((p) => p.status !== 'Inactive'),
    [products]
  );

  return { products, activeProducts, totalPages, total, isLoading, isError };
}
