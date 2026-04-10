import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useSubscription } from "../hooks/use-subscription";
import { ProUpgradeCard } from "../components/ProUpgradeCard";
import { PaywallModal } from "../components/PaywallModal";

const PRIVACY_POLICY_URL = "https://6357.github.io/legislator-stocks/privacy-policy.html";
const TERMS_OF_SERVICE_URL = "https://6357.github.io/legislator-stocks/terms-of-service.html";

export function ProfileScreen() {
  const { isProUser, refresh } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <View style={styles.container}>
      {!isProUser && (
        <>
          <ProUpgradeCard onPress={() => setShowPaywall(true)} />
          <PaywallModal
            visible={showPaywall}
            onClose={() => setShowPaywall(false)}
            onPurchased={() => refresh()}
          />
        </>
      )}
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>收藏的股票</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>推播通知設定</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
        <Text style={styles.rowText}>隱私權政策</Text>
        <Text style={styles.rowArrow}>▶</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)}>
        <Text style={styles.rowText}>使用條款</Text>
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
