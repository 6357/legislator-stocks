import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { initRevenueCat } from "./src/lib/revenue-cat";
import { StockSearchScreen } from "./src/screens/StockSearchScreen";
import { RankingScreen } from "./src/screens/RankingScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { StockDetailScreen } from "./src/screens/StockDetailScreen";

type RootStackParamList = {
  Tabs: undefined;
  StockDetail: { stockId: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="StockSearch"
        component={StockSearchScreen}
        options={{
          title: "股票",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          title: "排行榜",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏆</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initRevenueCat();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StockDetail"
          component={StockDetailScreen}
          options={{ title: "股票詳情" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
