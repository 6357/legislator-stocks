import React, { useState } from "react";
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from "react-native";
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

  const ListHeader = () => (
    <View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 輸入股票代號或名稱..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearch("")}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <SectorFilter selected={sector} onSelect={setSector} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {loading ? (
        <>
          <ListHeader />
          <ActivityIndicator style={styles.loader} />
        </>
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<ListHeader />}
          stickyHeaderIndices={[0]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => (
            <StockListItem
              stock={item}
              onPress={(id) => navigation.navigate("StockDetail", { stockId: id })}
            />
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 16,
    color: "#999",
  },
  loader: { marginTop: 40 },
});
