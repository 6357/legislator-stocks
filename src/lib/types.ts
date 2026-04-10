export interface Legislator {
  id: string;
  name: string;
  party: string;
  constituency: string;
  term: number;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
}

export interface StockWithHolderCount extends Stock {
  holder_count: number;
  total_shares: number;
}

export interface Holding {
  id: string;
  legislator_id: string;
  stock_id: string;
  shares: number;
  report_date: string;
  source: string;
}

export interface HoldingWithLegislator extends Holding {
  legislator: Legislator;
}

export interface StockValuation {
  id: string;
  stock_id: string;
  date: string;
  price: number;
  pe_ratio: number | null;
  pb_ratio: number | null;
  dividend_yield: number | null;
  pe_percentile: number | null;
  pb_percentile: number | null;
  yield_percentile: number | null;
}

export type ValuationRating = "low" | "fair" | "high";

export function getValuationRating(valuation: StockValuation): ValuationRating | null {
  const values = [
    valuation.pe_percentile,
    valuation.pb_percentile,
    valuation.yield_percentile,
  ].filter((v): v is number => v !== null);

  if (values.length === 0) return null;

  values.sort((a, b) => a - b);
  const median = values[Math.floor(values.length / 2)];

  if (median < 20) return "low";
  if (median > 80) return "high";
  return "fair";
}

export const VALUATION_LABELS: Record<ValuationRating, string> = {
  low: "偏低估值",
  fair: "合理估值",
  high: "偏高估值",
};
