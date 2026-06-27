import useTheme from "@/hooks/useTheme";
import { createStyles } from "@/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface HeaderHomeProps {
  completedNotes: number;
  totalNotes: number;
}

export const HeaderHome = ({ completedNotes, totalNotes }: HeaderHomeProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const progressPercentage =
    totalNotes > 0 ? Math.round((completedNotes / totalNotes) * 100) : 0;

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash-outline" size={28} color="#fff" />
        </View>

        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>Today&apos;s Tasks</Text>
          <Text style={styles.subtitle}>
            {completedNotes} of {totalNotes} completed
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{progressPercentage}%</Text>
        </View>
      </View>
    </View>
  );
};
