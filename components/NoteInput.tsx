import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { createStyles } from "@/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export const NoteInput = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [text, setText] = useState<string>("");
  const createNote = useMutation(api.notes.createNote);

  const handleAddNote = async () => {
    if (!text.trim()) return;
    await createNote({ title: text.trim(), completed: false });
    setText("");
  };

  return (
    <View style={styles.inputSection}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          value={text}
          onChangeText={setText}
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity
          onPress={handleAddNote}
          activeOpacity={0.8}
          disabled={!text.trim()}
          style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
