import { renderHook, act, waitFor } from "@testing-library/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFavorites } from "../../src/hooks/use-favorites";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it("starts with empty favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });
  });

  it("adds a stock to favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });

    await act(async () => {
      await result.current.toggleFavorite("stock-1");
    });

    expect(result.current.favorites).toContain("stock-1");
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("removes a stock from favorites when toggled twice", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(["stock-1"]));
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites).toContain("stock-1");
    });

    await act(async () => {
      await result.current.toggleFavorite("stock-1");
    });

    expect(result.current.favorites).not.toContain("stock-1");
  });

  it("isFavorite returns correct boolean", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(["stock-1"]));
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isFavorite("stock-1")).toBe(true);
      expect(result.current.isFavorite("stock-2")).toBe(false);
    });
  });
});
