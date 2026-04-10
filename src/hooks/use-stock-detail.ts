import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  StockWithHolderCount,
  HoldingWithLegislator,
  StockValuation,
} from "../lib/types";

export function useStockDetail(stockId: string) {
  const [stock, setStock] = useState<StockWithHolderCount | null>(null);
  const [holders, setHolders] = useState<HoldingWithLegislator[]>([]);
  const [valuation, setValuation] = useState<StockValuation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);

      const [stockRes, holdersRes, valuationRes] = await Promise.all([
        supabase
          .from("stocks_with_holder_count")
          .select("*")
          .eq("id", stockId)
          .single(),
        supabase
          .from("holdings")
          .select("*, legislator:legislators(*)")
          .eq("stock_id", stockId)
          .order("shares", { ascending: false }),
        supabase
          .from("stock_valuations")
          .select("*")
          .eq("stock_id", stockId)
          .order("date", { ascending: false })
          .limit(1)
          .single(),
      ]);

      if (!cancelled) {
        setStock(stockRes.data as StockWithHolderCount | null);
        setHolders((holdersRes.data as HoldingWithLegislator[]) || []);
        setValuation(valuationRes.data as StockValuation | null);
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [stockId]);

  return { stock, holders, valuation, loading };
}
