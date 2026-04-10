import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favorite_stocks";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    });
  }, []);

  const toggleFavorite = useCallback(async (stockId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(stockId)
        ? prev.filter((id) => id !== stockId)
        : [...prev, stockId];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (stockId: string) => favorites.includes(stockId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
