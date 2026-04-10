-- Sample legislators
INSERT INTO legislators (name, party, constituency, term) VALUES
  ('王委員', '國民黨', '台北市第一選區', 11),
  ('林委員', '民進黨', '新北市第二選區', 11),
  ('陳委員', '民眾黨', '桃園市第一選區', 11),
  ('張委員', '國民黨', '台中市第三選區', 11),
  ('李委員', '民進黨', '高雄市第一選區', 11);

-- Sample stocks
INSERT INTO stocks (symbol, name, sector) VALUES
  ('2330', '台積電', '半導體'),
  ('2317', '鴻海', '電子'),
  ('2454', '聯發科', '半導體'),
  ('2881', '富邦金', '金融'),
  ('2882', '國泰金', '金融'),
  ('2303', '聯電', '半導體'),
  ('1301', '台塑', '塑膠'),
  ('2412', '中華電', '通信');

-- Sample holdings (linking legislators to stocks)
INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 50000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '王委員' AND s.symbol = '2330';

INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 30000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '林委員' AND s.symbol = '2330';

INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 15000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '陳委員' AND s.symbol = '2330';

INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 20000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '王委員' AND s.symbol = '2317';

INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 10000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '張委員' AND s.symbol = '2317';

INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 5000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '李委員' AND s.symbol = '2881';

INSERT INTO holdings (legislator_id, stock_id, shares, report_date, source)
SELECT l.id, s.id, 8000, '2025-11-01', '監察院廉政專刊'
FROM legislators l, stocks s
WHERE l.name = '張委員' AND s.symbol = '2882';

-- Sample valuation (latest for 台積電)
INSERT INTO stock_valuations (stock_id, date, price, pe_ratio, pb_ratio, dividend_yield, pe_percentile, pb_percentile, yield_percentile)
SELECT s.id, '2026-04-09', 850.00, 22.5, 6.8, 1.5, 18, 22, 65
FROM stocks s WHERE s.symbol = '2330';

INSERT INTO stock_valuations (stock_id, date, price, pe_ratio, pb_ratio, dividend_yield, pe_percentile, pb_percentile, yield_percentile)
SELECT s.id, '2026-04-09', 178.00, 12.3, 1.8, 4.2, 45, 50, 30
FROM stocks s WHERE s.symbol = '2317';
