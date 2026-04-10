import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StockWithHolderCount } from "../lib/types";

export function useStocks(search: string, sector: string | null) {
  const [stocks, setStocks] = useState<StockWithHolderCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      let query = supabase
        .from("stocks_with_holder_count")
        .select("*");

      if (search.trim()) {
        const term = search.trim();
        query = query.or(`name.ilike.%${term}%,symbol.ilike.%${term}%`);
      }
      if (sector) {
        query = query.eq("sector", sector);
      }

      const { data, error: err } = await query.order("holder_count", { ascending: false });

      if (!cancelled) {
        if (err) {
          setError(err.message);
        } else {
          setStocks(data as StockWithHolderCount[]);
          setError(null);
        }
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [search, sector]);

  return { stocks, loading, error };
}
