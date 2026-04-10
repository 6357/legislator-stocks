import { renderHook, waitFor } from "@testing-library/react";
import { useRankings } from "../../src/hooks/use-rankings";
import { supabase } from "../../src/lib/supabase";

jest.mock("../../src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockData = [
  { id: "1", symbol: "2330", name: "台積電", sector: "半導體", holder_count: 28, total_shares: 95000 },
  { id: "2", symbol: "2317", name: "鴻海", sector: "電子", holder_count: 15, total_shares: 30000 },
];

describe("useRankings", () => {
  beforeEach(() => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });
  });

  it("fetches rankings ordered by holder_count by default", async () => {
    const { result } = renderHook(() => useRankings("holder_count"));

    await waitFor(() => {
      expect(result.current.rankings).toEqual(mockData);
      expect(result.current.loading).toBe(false);
    });
  });
});
