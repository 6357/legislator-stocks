import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
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
        Alert.alert("購買失敗", e.message);
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
        Alert.alert("恢復購買", "找不到之前的訂閱紀錄");
      }
    } catch (e: any) {
      Alert.alert("恢復失敗", e.message);
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>升級 PRO</Text>
          <Text style={styles.subtitle}>
            解鎖巴菲特估值體重機、推播通知
          </Text>

          {purchasing ? (
            <ActivityIndicator style={{ marginVertical: 24 }} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePurchase("monthly")}
              >
                <Text style={styles.optionTitle}>月費方案</Text>
                <Text style={styles.optionPrice}>NT$99 / 月</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option, styles.optionHighlight]}
                onPress={() => handlePurchase("annual")}
              >
                <View>
                  <Text style={styles.optionTitle}>年費方案</Text>
                  <Text style={styles.optionDiscount}>省 16%</Text>
                </View>
                <Text style={styles.optionPrice}>NT$999 / 年</Text>
              </TouchableOpacity>

              <Text style={styles.autoRenewText}>
                訂閱將自動續訂，可隨時在 iPhone 設定中取消
              </Text>

              <View style={styles.legalLinks}>
                <Text
                  style={styles.legalLink}
                  onPress={() => Linking.openURL("https://6357.github.io/legislator-stocks/privacy-policy.html")}
                >
                  隱私權政策
                </Text>
                <Text style={styles.legalSeparator}>｜</Text>
                <Text
                  style={styles.legalLink}
                  onPress={() => Linking.openURL("https://6357.github.io/legislator-stocks/terms-of-service.html")}
                >
                  使用條款
                </Text>
              </View>

              <TouchableOpacity style={styles.restore} onPress={handleRestore}>
                <Text style={styles.restoreText}>恢復購買</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>取消</Text>
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
  autoRenewText: { fontSize: 12, color: "#999", textAlign: "center", marginTop: 12 },
  legalLinks: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  legalLink: { fontSize: 12, color: "#007AFF" },
  legalSeparator: { fontSize: 12, color: "#ccc", marginHorizontal: 4 },
  restore: { alignItems: "center", marginTop: 12 },
  restoreText: { fontSize: 14, color: "#007AFF" },
  close: { alignItems: "center", marginTop: 16 },
  closeText: { fontSize: 16, color: "#999" },
});
