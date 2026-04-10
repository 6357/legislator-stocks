import {
  getValuationRating,
  StockValuation,
  VALUATION_LABELS,
} from "../../src/lib/types";

function makeValuation(
  pe: number | null,
  pb: number | null,
  dy: number | null
): StockValuation {
  return {
    id: "test",
    stock_id: "test",
    date: "2026-04-09",
    price: 100,
    pe_ratio: pe ? pe : null,
    pb_ratio: pb ? pb : null,
    dividend_yield: dy ? dy : null,
    pe_percentile: pe,
    pb_percentile: pb,
    yield_percentile: dy,
  };
}

describe("getValuationRating", () => {
  it("returns 'low' when median percentile < 20", () => {
    expect(getValuationRating(makeValuation(10, 15, 50))).toBe("low");
  });

  it("returns 'fair' when median percentile is 20-80", () => {
    expect(getValuationRating(makeValuation(30, 50, 70))).toBe("fair");
  });

  it("returns 'high' when median percentile > 80", () => {
    expect(getValuationRating(makeValuation(50, 85, 90))).toBe("high");
  });

  it("returns null when all percentiles are null", () => {
    expect(getValuationRating(makeValuation(null, null, null))).toBeNull();
  });

  it("handles partial data — only one percentile available", () => {
    expect(getValuationRating(makeValuation(10, null, null))).toBe("low");
  });

  it("handles partial data — two percentiles available", () => {
    expect(getValuationRating(makeValuation(25, 75, null))).toBe("fair");
  });
});

describe("VALUATION_LABELS", () => {
  it("has Chinese labels for all ratings", () => {
    expect(VALUATION_LABELS.low).toBe("偏低估值");
    expect(VALUATION_LABELS.fair).toBe("合理估值");
    expect(VALUATION_LABELS.high).toBe("偏高估值");
  });
});
