import useTheme from "@/hooks/useTheme";
import { createStyles } from "@/styles/home.styles";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import { useMutation } from "convex/react";

interface ItemNoteProps {
  id: Id<"notes">;
  title: string;
  completed: boolean;
}

export const ItemNote = ({ id, title, completed }: ItemNoteProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const deleteNote = useMutation(api.notes.deleteNote);
  const toggleNote = useMutation(api.notes.toggleNote);

  return (
    <View style={styles.todoItemWrapper}>
      <View style={styles.todoItem}>
        <TouchableOpacity
          style={styles.checkbox}
          activeOpacity={0.7}
          onPress={() => toggleNote({ id })}
        >
          <View
            style={[
              styles.checkboxInner,
              {
                borderColor: completed ? "transparent" : colors.border,
                backgroundColor: completed ? colors.success : colors.textMuted,
              },
            ]}
          >
            {completed && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
        </TouchableOpacity>
        <View style={styles.todoTextContainer}>
          <Text
            style={[
              styles.todoText,
              completed && {
                textDecorationLine: "line-through",
                color: colors.textMuted,
                opacity: 0.6,
              },
            ]}
          >
            {title}
          </Text>

          <View style={styles.todoActions}>
            <TouchableOpacity
              onPress={() => deleteNote({ id })}
              activeOpacity={0.8}
            >
              <View style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
