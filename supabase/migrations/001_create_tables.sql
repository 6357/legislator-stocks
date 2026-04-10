-- legislators
CREATE TABLE legislators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  party text NOT NULL,
  constituency text NOT NULL,
  term int NOT NULL
);

-- stocks
CREATE TABLE stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  name text NOT NULL,
  sector text NOT NULL
);

CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stocks_sector ON stocks(sector);

-- holdings
CREATE TABLE holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legislator_id uuid NOT NULL REFERENCES legislators(id),
  stock_id uuid NOT NULL REFERENCES stocks(id),
  shares bigint NOT NULL,
  report_date date NOT NULL,
  source text NOT NULL
);

CREATE INDEX idx_holdings_stock_id ON holdings(stock_id);
CREATE INDEX idx_holdings_legislator_id ON holdings(legislator_id);

-- stock_valuations
CREATE TABLE stock_valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id uuid NOT NULL REFERENCES stocks(id),
  date date NOT NULL,
  price numeric NOT NULL,
  pe_ratio numeric,
  pb_ratio numeric,
  dividend_yield numeric,
  pe_percentile numeric,
  pb_percentile numeric,
  yield_percentile numeric,
  UNIQUE(stock_id, date)
);

CREATE INDEX idx_stock_valuations_stock_date ON stock_valuations(stock_id, date DESC);

-- View: stock with holder count
CREATE VIEW stocks_with_holder_count AS
SELECT
  s.id,
  s.symbol,
  s.name,
  s.sector,
  COUNT(DISTINCT h.legislator_id) AS holder_count,
  SUM(h.shares) AS total_shares
FROM stocks s
LEFT JOIN holdings h ON h.stock_id = s.id
GROUP BY s.id, s.symbol, s.name, s.sector;

-- Row Level Security
ALTER TABLE legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_valuations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read legislators" ON legislators FOR SELECT USING (true);
CREATE POLICY "Public read stocks" ON stocks FOR SELECT USING (true);
CREATE POLICY "Public read holdings" ON holdings FOR SELECT USING (true);
CREATE POLICY "Public read stock_valuations" ON stock_valuations FOR SELECT USING (true);
