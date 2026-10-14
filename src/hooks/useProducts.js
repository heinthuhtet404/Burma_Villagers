import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, getProductsPaginated } from "../lib/products";

export default function useProducts({
  onlyNew = false,
  paginate = false,
  pageSize = 8,
} = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const offsetRef = useRef(0);
  const fetchingRef = useRef(false);

  /* ============================================================
     Initial load
     ============================================================ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      offsetRef.current = 0;

      try {
        if (paginate) {
          const res = await getProductsPaginated({
            limit: pageSize,
            offset: 0,
            onlyNew,
          });
          if (cancelled) return;
          setProducts(res.products);
          setTotal(res.total);
          setHasMore(res.hasMore);
          offsetRef.current = res.products.length;
        } else {
          const data = await getProducts({ onlyNew });
          if (cancelled) return;
          setProducts(data);
          setTotal(data.length);
          setHasMore(false);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [onlyNew, paginate, pageSize]);

  /* ============================================================
     Load more
     ============================================================ */
  const loadMore = useCallback(async () => {
    if (!paginate || !hasMore || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const res = await getProductsPaginated({
        limit: pageSize,
        offset: offsetRef.current,
        onlyNew,
      });

      setProducts((prev) => {
        const existing = new Set(prev.map((p) => p.id));
        const fresh = res.products.filter((p) => !existing.has(p.id));
        return [...prev, ...fresh];
      });

      setTotal(res.total);
      setHasMore(res.hasMore);
      offsetRef.current += res.products.length;
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, [paginate, hasMore, pageSize, onlyNew]);

  /* ============================================================
     Reset
     ============================================================ */
  const reset = useCallback(() => {
    offsetRef.current = 0;
    setProducts([]);
    setHasMore(true);
  }, []);

  return {
    products,
    loading,
    loadingMore,
    error,
    total,
    hasMore,
    loadMore,
    reset,
  };
}