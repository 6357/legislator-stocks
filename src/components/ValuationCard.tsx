import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  StockValuation,
  getValuationRating,
  VALUATION_LABELS,
} from "../lib/types";

interface Props {
  valuation: StockValuation;
}

export function ValuationCard({ valuation }: Props) {
  const rating = getValuationRating(valuation);
  if (!rating) return null;

  const values = [
    valuation.pe_percentile,
    valuation.pb_percentile,
    valuation.yield_percentile,
  ].filter((v): v is number => v !== null);
  values.sort((a, b) => a - b);
  const median = values[Math.floor(values.length / 2)];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>⚖️ 巴菲特估值體重機</Text>
        <View style={styles.proBadge}>
          <Text style={styles.proText}>PRO</Text>
        </View>
      </View>
      <Text style={styles.rating}>{VALUATION_LABELS[rating]}</Text>
      <Text style={styles.detail}>
        PE 百分位 {valuation.pe_percentile ?? "—"}% ｜ PB 百分位 {valuation.pb_percentile ?? "—"}%
        {valuation.yield_percentile != null ? ` ｜ 殖利率百分位 ${valuation.yield_percentile}%` : ""}
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${median}%` }]} />
      </View>
      <View style={styles.barLabels}>
        <Text style={styles.barLabel}>便宜</Text>
        <Text style={styles.barLabel}>合理</Text>
        <Text style={styles.barLabel}>昂貴</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#667eea",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerText: { fontSize: 13, color: "rgba(255,255,255,0.9)" },
  proBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proText: { fontSize: 11, color: "white" },
  rating: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 4 },
  detail: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  barBg: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    height: 8,
    marginTop: 10,
  },
  barFill: {
    backgroundColor: "white",
    borderRadius: 4,
    height: 8,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  barLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
});
