/**
 * Import legislator holdings from g0v CSV data.
 *
 * Usage:
 *   npx tsx supabase/seed/import-holdings.ts <path-to-csv>
 *
 * Expected CSV columns (from kiang/sunshine.cy.gov.tw):
 *   name, party, constituency, stock_symbol, stock_name, shares, report_date
 *
 * This script:
 * 1. Reads the CSV file
 * 2. Upserts legislators by name + term
 * 3. Upserts stocks by symbol
 * 4. Inserts holdings records
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CURRENT_TERM = 11;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface CsvRow {
  name: string;
  party: string;
  constituency: string;
  stock_symbol: string;
  stock_name: string;
  sector: string;
  shares: string;
  report_date: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row as unknown as CsvRow;
  });
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx import-holdings.ts <path-to-csv>");
    process.exit(1);
  }

  const content = readFileSync(csvPath, "utf-8");
  const rows = parseCsv(content);
  console.log(`Parsed ${rows.length} rows from CSV`);

  const legislatorMap = new Map<string, CsvRow>();
  const stockMap = new Map<string, CsvRow>();

  for (const row of rows) {
    legislatorMap.set(row.name, row);
    stockMap.set(row.stock_symbol, row);
  }

  const legislatorUpserts = Array.from(legislatorMap.values()).map((row) => ({
    name: row.name,
    party: row.party,
    constituency: row.constituency,
    term: CURRENT_TERM,
  }));

  const { error: legError } = await supabase
    .from("legislators")
    .upsert(legislatorUpserts, { onConflict: "name,term", ignoreDuplicates: true });

  if (legError) {
    console.error("Error upserting legislators:", legError);
    process.exit(1);
  }
  console.log(`Upserted ${legislatorUpserts.length} legislators`);

  const stockUpserts = Array.from(stockMap.values()).map((row) => ({
    symbol: row.stock_symbol,
    name: row.stock_name,
    sector: row.sector || "其他",
  }));

  const { error: stockError } = await supabase
    .from("stocks")
    .upsert(stockUpserts, { onConflict: "symbol", ignoreDuplicates: false });

  if (stockError) {
    console.error("Error upserting stocks:", stockError);
    process.exit(1);
  }
  console.log(`Upserted ${stockUpserts.length} stocks`);

  const { data: legislators } = await supabase.from("legislators").select("id, name");
  const { data: stocks } = await supabase.from("stocks").select("id, symbol");

  const legIdMap = new Map(legislators!.map((l) => [l.name, l.id]));
  const stockIdMap = new Map(stocks!.map((s) => [s.symbol, s.id]));

  const holdingInserts = rows
    .filter((row) => legIdMap.has(row.name) && stockIdMap.has(row.stock_symbol))
    .map((row) => ({
      legislator_id: legIdMap.get(row.name)!,
      stock_id: stockIdMap.get(row.stock_symbol)!,
      shares: parseInt(row.shares, 10),
      report_date: row.report_date,
      source: "監察院廉政專刊",
    }));

  const { error: holdError } = await supabase.from("holdings").insert(holdingInserts);

  if (holdError) {
    console.error("Error inserting holdings:", holdError);
    process.exit(1);
  }
  console.log(`Inserted ${holdingInserts.length} holdings`);
  console.log("Done!");
}

main();
