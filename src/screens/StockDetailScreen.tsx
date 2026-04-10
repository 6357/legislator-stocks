import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useStockDetail } from "../hooks/use-stock-detail";
import { ValuationCard } from "../components/ValuationCard";
import { LegislatorRow } from "../components/LegislatorRow";
import { ProUpgradeCard } from "../components/ProUpgradeCard";

type RootStackParamList = {
  StockDetail: { stockId: string };
};

export function StockDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "StockDetail">>();
  const { stock, holders, valuation, loading } = useStockDetail(route.params.stockId);
  // Note: useSubscription will be added in Task 9
  const isProUser = false;

  if (loading || !stock) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={holders}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{stock.symbol} {stock.name}</Text>
            <Text style={styles.subtitle}>
              {stock.sector} ｜ {stock.holder_count} 位立委持有
            </Text>

            {isProUser && valuation ? (
              <ValuationCard valuation={valuation} />
            ) : !isProUser ? (
              <ProUpgradeCard onPress={() => {}} />
            ) : null}

            <Text style={styles.sectionTitle}>持有此股票的立委</Text>
          </View>
        }
        renderItem={({ item }) => <LegislatorRow holding={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  loader: { flex: 1, justifyContent: "center" },
  header: { paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 13, color: "#666", marginBottom: 16 },
  sectionTitle: { fontWeight: "bold", fontSize: 13, color: "#666", marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
});
