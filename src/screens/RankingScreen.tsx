import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRankings, RankingSort } from "../hooks/use-rankings";
import { RankingListItem } from "../components/RankingListItem";

type RootStackParamList = {
  Tabs: undefined;
  StockDetail: { stockId: string };
};

export function RankingScreen() {
  const [sortBy, setSortBy] = useState<RankingSort>("holder_count");
  const { rankings, loading } = useRankings(sortBy);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggle, sortBy === "holder_count" && styles.toggleActive]}
          onPress={() => setSortBy("holder_count")}
        >
          <Text style={[styles.toggleText, sortBy === "holder_count" && styles.toggleTextActive]}>
            最多立委持有
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggle, sortBy === "total_shares" && styles.toggleActive]}
          onPress={() => setSortBy("total_shares")}
        >
          <Text style={[styles.toggleText, sortBy === "total_shares" && styles.toggleTextActive]}>
            持股金額
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={rankings}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RankingListItem
              stock={item}
              rank={index + 1}
              sortBy={sortBy}
              onPress={(id) => navigation.navigate("StockDetail", { stockId: id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  toggleRow: { flexDirection: "row", padding: 16, gap: 8 },
  toggle: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  toggleActive: { backgroundColor: "#007AFF" },
  toggleText: { fontSize: 13, color: "#666" },
  toggleTextActive: { color: "white" },
  loader: { marginTop: 40 },
});
