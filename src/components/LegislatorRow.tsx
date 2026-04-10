import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HoldingWithLegislator } from "../lib/types";

interface Props {
  holding: HoldingWithLegislator;
}

export function LegislatorRow({ holding }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{holding.legislator.name}</Text>
        <Text style={styles.detail}>
          {holding.legislator.party} ｜ {holding.legislator.constituency}
        </Text>
      </View>
      <Text style={styles.shares}>{holding.shares.toLocaleString()} 股</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 15 },
  detail: { fontSize: 12, color: "#666", marginTop: 2 },
  shares: { fontWeight: "bold", fontSize: 14 },
});
