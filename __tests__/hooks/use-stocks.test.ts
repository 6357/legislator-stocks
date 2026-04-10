import { renderHook, waitFor, act } from "@testing-library/react";
import { useStocks } from "../../src/hooks/use-stocks";
import { supabase } from "../../src/lib/supabase";

jest.mock("../../src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockStocks = [
  { id: "1", symbol: "2330", name: "台積電", sector: "半導體", holder_count: 28, total_shares: 95000 },
  { id: "2", symbol: "2881", name: "富邦金", sector: "金融", holder_count: 10, total_shares: 5000 },
];

function setupMock(data: any[]) {
  const mockSelect = jest.fn().mockReturnThis();
  const mockIlike = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockOrder = jest.fn().mockResolvedValue({ data, error: null });

  (supabase.from as jest.Mock).mockReturnValue({
    select: mockSelect,
    ilike: mockIlike,
    eq: mockEq,
    order: mockOrder,
  });

  return { mockSelect, mockIlike, mockEq, mockOrder };
}

describe("useStocks", () => {
  it("fetches all stocks on mount", async () => {
    setupMock(mockStocks);
    const { result } = renderHook(() => useStocks("", null));

    await waitFor(() => {
      expect(result.current.stocks).toEqual(mockStocks);
      expect(result.current.loading).toBe(false);
    });
  });

  it("filters by sector when provided", async () => {
    const filtered = mockStocks.filter((s) => s.sector === "金融");
    setupMock(filtered);
    const { result } = renderHook(() => useStocks("", "金融"));

    await waitFor(() => {
      expect(result.current.stocks).toEqual(filtered);
    });
  });
});
