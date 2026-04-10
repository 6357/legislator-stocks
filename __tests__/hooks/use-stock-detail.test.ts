import { renderHook, waitFor } from "@testing-library/react";
import { useStockDetail } from "../../src/hooks/use-stock-detail";
import { supabase } from "../../src/lib/supabase";

jest.mock("../../src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("useStockDetail", () => {
  it("fetches stock info, holders, and latest valuation", async () => {
    const mockStock = { id: "1", symbol: "2330", name: "台積電", sector: "半導體", holder_count: 3, total_shares: 95000 };
    const mockHolders = [
      { id: "h1", shares: 50000, legislator: { id: "l1", name: "王委員", party: "國民黨", constituency: "台北市" } },
    ];
    const mockValuation = {
      id: "v1", stock_id: "1", date: "2026-04-09", price: 850,
      pe_ratio: 22.5, pb_ratio: 6.8, dividend_yield: 1.5,
      pe_percentile: 18, pb_percentile: 22, yield_percentile: 65,
    };

    (supabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "stocks_with_holder_count") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockStock, error: null }),
        };
      }
      if (table === "holdings") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockHolders, error: null }),
        };
      }
      if (table === "stock_valuations") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockValuation, error: null }),
        };
      }
      return {};
    });

    const { result } = renderHook(() => useStockDetail("1"));

    await waitFor(() => {
      expect(result.current.stock).toEqual(mockStock);
      expect(result.current.holders).toEqual(mockHolders);
      expect(result.current.valuation).toEqual(mockValuation);
      expect(result.current.loading).toBe(false);
    });
  });
});
