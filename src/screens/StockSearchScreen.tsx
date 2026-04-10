import React, { useState } from "react";
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useStocks } from "../hooks/use-stocks";
import { StockListItem } from "../components/StockListItem";
import { SectorFilter } from "../components/SectorFilter";

type RootStackParamList = {
  Tabs: undefined;
  StockDetail: { stockId: string };
};

export function StockSearchScreen() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const { stocks, loading } = useStocks(search, sector);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 輸入股票代號或名稱..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />
      <SectorFilter selected={sector} onSelect={setSector} />
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StockListItem
              stock={item}
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
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 14,
  },
  loader: { marginTop: 40 },
});
