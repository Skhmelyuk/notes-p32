import { Stack } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </ThemeProvider>
    </ConvexProvider>
  );
}
