import { Stack } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ActivityIndicator, View } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <ThemeProvider>
        <AuthLoading>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        </AuthLoading>
        <Unauthenticated>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </Stack>
        </Unauthenticated>

        <Authenticated>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </Authenticated>
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
