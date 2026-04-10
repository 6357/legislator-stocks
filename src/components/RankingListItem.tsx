import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { StockWithHolderCount } from "../lib/types";

interface Props {
  stock: StockWithHolderCount;
  rank: number;
  sortBy: "holder_count" | "total_shares";
  onPress: (stockId: string) => void;
}

const RANK_COLORS: Record<number, string> = {
  1: "#e67e22",
  2: "#95a5a6",
  3: "#cd7f32",
};

export function RankingListItem({ stock, rank, sortBy, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(stock.id)}>
      <Text style={[styles.rank, { color: RANK_COLORS[rank] || "#666" }]}>{rank}</Text>
      <View style={styles.info}>
        <Text style={styles.title}>{stock.symbol} {stock.name}</Text>
        <Text style={styles.subtitle}>{stock.sector}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.statValue}>
          {sortBy === "holder_count" ? `${stock.holder_count} 位` : `${stock.total_shares.toLocaleString()} 股`}
        </Text>
        <Text style={styles.statLabel}>
          {sortBy === "holder_count" ? "立委持有" : "總持股"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rank: { width: 28, fontWeight: "bold", fontSize: 18 },
  info: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 15 },
  subtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  stat: { alignItems: "flex-end" },
  statValue: { fontWeight: "bold", fontSize: 14 },
  statLabel: { fontSize: 11, color: "#666" },
});
