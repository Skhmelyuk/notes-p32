import useTheme from "@/hooks/useTheme";
import { createStyles } from "@/styles/home.styles";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import { useMutation } from "convex/react";

interface ItemNoteProps {
  id: Id<"notes">;
  title: string;
  completed: boolean;
}

export const ItemNote = ({ id, title, completed }: ItemNoteProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);

  const deleteNote = useMutation(api.notes.deleteNote);
  const toggleNote = useMutation(api.notes.toggleNote);
  const updateNote = useMutation(api.notes.updateNote);

  const handleSave = async () => {
    if (!editText.trim()) return;
    await updateNote({ id, title: editText.trim() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(title);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditText(title);
    setIsEditing(true);
  };

  return (
    <View style={styles.todoItemWrapper}>
      <View style={styles.todoItem}>
        <TouchableOpacity
          style={styles.checkbox}
          activeOpacity={0.7}
          onPress={() => toggleNote({ id })}
          disabled={isEditing}
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
          {isEditing ? (
            <TextInput
              style={styles.todoInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              placeholder="Task name"
              placeholderTextColor={colors.textMuted}
            />
          ) : (
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
          )}

          <View style={styles.todoActions}>
            {isEditing ? (
              <>
                <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
                  <View style={styles.saveButton}>
                    <Ionicons name="checkmark-outline" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} activeOpacity={0.8}>
                  <View style={styles.cancelButton}>
                    <Ionicons name="close-outline" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={handleStartEdit} activeOpacity={0.8}>
                  <View style={styles.editButton}>
                    <Ionicons name="pencil-outline" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteNote({ id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
