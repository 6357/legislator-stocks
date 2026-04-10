import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface Props {
  onPress: () => void;
}

export function ProUpgradeCard({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>升級 PRO</Text>
      <Text style={styles.subtitle}>解鎖巴菲特估值體重機、進階分析</Text>
      <View style={styles.priceRow}>
        <View style={styles.priceOption}>
          <Text style={styles.price}>NT$99 / 月</Text>
        </View>
        <View style={[styles.priceOption, styles.priceOptionHighlight]}>
          <Text style={styles.price}>NT$999 / 年</Text>
          <Text style={styles.discount}>省 16%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#667eea",
  },
  title: { fontSize: 16, color: "white", fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 12 },
  priceRow: { flexDirection: "row", gap: 8 },
  priceOption: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  priceOptionHighlight: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  price: { color: "white", fontWeight: "bold", fontSize: 14 },
  discount: { color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 2 },
});
