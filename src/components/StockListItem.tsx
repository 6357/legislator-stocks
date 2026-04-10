import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { StockWithHolderCount } from "../lib/types";

interface Props {
  stock: StockWithHolderCount;
  onPress: (stockId: string) => void;
}

export function StockListItem({ stock, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(stock.id)}>
      <View style={styles.info}>
        <Text style={styles.title}>{stock.symbol} {stock.name}</Text>
        <Text style={styles.subtitle}>{stock.sector} ｜ {stock.holder_count} 位立委持有</Text>
      </View>
      <Text style={styles.arrow}>▶</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 15 },
  subtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  arrow: { color: "#999", fontSize: 12 },
});
