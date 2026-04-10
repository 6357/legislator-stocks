import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ProUpgradeCard } from "../components/ProUpgradeCard";

export function ProfileScreen() {
  // Note: useSubscription hook will be added in Task 9
  const isProUser = false;

  return (
    <View style={styles.container}>
      {!isProUser && (
        <ProUpgradeCard onPress={() => Alert.alert("訂閱", "即將開啟訂閱流程...")} />
      )}
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>收藏的股票</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>推播通知設定</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>關於</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>意見回饋</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowText: { fontSize: 15 },
  rowArrow: { color: "#999" },
});
