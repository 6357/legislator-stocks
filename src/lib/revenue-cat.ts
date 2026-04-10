import Purchases from "react-native-purchases";
import { Platform } from "react-native";
import Constants from "expo-constants";

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY!,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY!,
};

const isExpoGo = Constants.appOwnership === "expo";

export async function initRevenueCat() {
  if (isExpoGo) return;
  try {
    const apiKey = Platform.OS === "ios" ? API_KEYS.ios : API_KEYS.android;
    await Purchases.configure({ apiKey });
  } catch {
    // RevenueCat not available
  }
}

export async function getOfferings() {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchaseMonthly() {
  const offerings = await Purchases.getOfferings();
  const monthlyPackage = offerings.current?.monthly;
  if (!monthlyPackage) throw new Error("Monthly package not found");
  return Purchases.purchasePackage(monthlyPackage);
}

export async function purchaseAnnual() {
  const offerings = await Purchases.getOfferings();
  const annualPackage = offerings.current?.annual;
  if (!annualPackage) throw new Error("Annual package not found");
  return Purchases.purchasePackage(annualPackage);
}

export async function checkProStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active["pro"] !== undefined;
  } catch {
    return false;
  }
}

export async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases();
  return customerInfo.entitlements.active["pro"] !== undefined;
}
