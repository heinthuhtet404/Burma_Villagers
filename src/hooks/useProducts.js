import { useEffect, useState } from "react";
import { getProducts } from "../lib/products";

export default function useProducts(options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { onlyNew = false } = options;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const products = await getProducts({ onlyNew });
        if (!cancelled) setData(products);
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
  }, [onlyNew]);

  return { products: data, loading, error };
}