import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const SECTORS = ["全部", "半導體", "金融", "電子", "塑膠", "通信", "其他"];

interface Props {
  selected: string | null;
  onSelect: (sector: string | null) => void;
}

export function SectorFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {SECTORS.map((sector) => {
        const isActive = sector === "全部" ? selected === null : selected === sector;
        return (
          <TouchableOpacity
            key={sector}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelect(sector === "全部" ? null : sector)}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {sector}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginBottom: 12 },
  pill: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#007AFF" },
  pillText: { fontSize: 12, color: "#666" },
  pillTextActive: { color: "white" },
});
