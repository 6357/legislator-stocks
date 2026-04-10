import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FINMIND_TOKEN = Deno.env.get("FINMIND_TOKEN") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface FinMindRow {
  date: string;
  stock_id: string;
  Trading_Volume: number;
  close: number;
  PEratio: number;
  PBratio: number;
  DividendYield: number;
}

async function fetchStockData(symbol: string): Promise<FinMindRow[]> {
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  const startDate = fiveYearsAgo.toISOString().split("T")[0];

  const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPER&data_id=${symbol}&start_date=${startDate}&token=${FINMIND_TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.data || [];
}

function calculatePercentile(current: number, history: number[]): number {
  const sorted = [...history].sort((a, b) => a - b);
  const below = sorted.filter((v) => v < current).length;
  return Math.round((below / sorted.length) * 100);
}

Deno.serve(async () => {
  // Get all stocks that have holdings
  const { data: stocks } = await supabase
    .from("stocks")
    .select("id, symbol")
    .in(
      "id",
      (await supabase.from("holdings").select("stock_id")).data?.map(
        (h: { stock_id: string }) => h.stock_id
      ) || []
    );

  if (!stocks || stocks.length === 0) {
    return new Response(JSON.stringify({ message: "No stocks to update" }));
  }

  let updated = 0;

  for (const stock of stocks) {
    const rows = await fetchStockData(stock.symbol);
    if (rows.length === 0) continue;

    const peHistory = rows.map((r) => r.PEratio).filter((v) => v > 0);
    const pbHistory = rows.map((r) => r.PBratio).filter((v) => v > 0);
    const dyHistory = rows.map((r) => r.DividendYield).filter((v) => v > 0);

    const latest = rows[rows.length - 1];
    if (!latest) continue;

    const pePercentile = latest.PEratio > 0 ? calculatePercentile(latest.PEratio, peHistory) : null;
    const pbPercentile = latest.PBratio > 0 ? calculatePercentile(latest.PBratio, pbHistory) : null;
    const yieldPercentile = latest.DividendYield > 0 ? calculatePercentile(latest.DividendYield, dyHistory) : null;

    const { error } = await supabase.from("stock_valuations").upsert(
      {
        stock_id: stock.id,
        date: latest.date,
        price: latest.close,
        pe_ratio: latest.PEratio || null,
        pb_ratio: latest.PBratio || null,
        dividend_yield: latest.DividendYield || null,
        pe_percentile: pePercentile,
        pb_percentile: pbPercentile,
        yield_percentile: yieldPercentile,
      },
      { onConflict: "stock_id,date" }
    );

    if (!error) updated++;
  }

  return new Response(
    JSON.stringify({ message: `Updated valuations for ${updated} stocks` }),
    { headers: { "Content-Type": "application/json" } }
  );
});
