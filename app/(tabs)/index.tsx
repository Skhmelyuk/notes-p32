import { Text, View } from "react-native";
import useTheme from "@/hooks/useTheme";

export default function HomeScreen() {
  const { colors, toggleDarkMode, isDarkMode } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
      }}
    >
      <Text>Hello!!!!!!!!!!!!!!</Text>
    </View>
  );
}
