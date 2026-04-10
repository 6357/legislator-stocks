import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  purchaseMonthly,
  purchaseAnnual,
  restorePurchases,
} from "../lib/revenue-cat";

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchased: () => void;
}

export function PaywallModal({ visible, onClose, onPurchased }: Props) {
  const [purchasing, setPurchasing] = useState(false);

  async function handlePurchase(type: "monthly" | "annual") {
    setPurchasing(true);
    try {
      if (type === "monthly") {
        await purchaseMonthly();
      } else {
        await purchaseAnnual();
      }
      onPurchased();
      onClose();
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Purchase Failed", e.message);
      }
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    setPurchasing(true);
    try {
      const isPro = await restorePurchases();
      if (isPro) {
        onPurchased();
        onClose();
      } else {
        Alert.alert("Restore Purchase", "No previous subscription found");
      }
    } catch (e: any) {
      Alert.alert("Restore Failed", e.message);
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Upgrade to PRO</Text>
          <Text style={styles.subtitle}>
            Unlock Buffett valuation scale and push notifications
          </Text>

          {purchasing ? (
            <ActivityIndicator style={{ marginVertical: 24 }} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePurchase("monthly")}
              >
                <Text style={styles.optionTitle}>Monthly</Text>
                <Text style={styles.optionPrice}>NT$99 / mo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option, styles.optionHighlight]}
                onPress={() => handlePurchase("annual")}
              >
                <View>
                  <Text style={styles.optionTitle}>Annual</Text>
                  <Text style={styles.optionDiscount}>Save 16%</Text>
                </View>
                <Text style={styles.optionPrice}>NT$999 / yr</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.restore} onPress={handleRestore}>
                <Text style={styles.restoreText}>Restore Purchase</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  optionHighlight: {
    backgroundColor: "#f0f0ff",
    borderWidth: 1,
    borderColor: "#667eea",
  },
  optionTitle: { fontSize: 16, fontWeight: "bold" },
  optionPrice: { fontSize: 16, fontWeight: "bold", color: "#667eea" },
  optionDiscount: { fontSize: 12, color: "#666", marginTop: 2 },
  restore: { alignItems: "center", marginTop: 12 },
  restoreText: { fontSize: 14, color: "#007AFF" },
  close: { alignItems: "center", marginTop: 16 },
  closeText: { fontSize: 16, color: "#999" },
});
