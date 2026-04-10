import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StockWithHolderCount } from "../lib/types";

export type RankingSort = "holder_count" | "total_shares";

export function useRankings(sortBy: RankingSort) {
  const [rankings, setRankings] = useState<StockWithHolderCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);

      const { data, error } = await supabase
        .from("stocks_with_holder_count")
        .select("*")
        .order(sortBy, { ascending: false })
        .limit(50);

      if (!cancelled) {
        setRankings((data as StockWithHolderCount[]) || []);
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [sortBy]);

  return { rankings, loading };
}
