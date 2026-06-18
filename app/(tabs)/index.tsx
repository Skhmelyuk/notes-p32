import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useTheme, { ColorScheme } from "@/hooks/useTheme";

interface Note {
  id: string;
  title: string;
  completed: boolean;
}

export default function HomeScreen() {
  const { colors } = useTheme();

  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState<string>("");

  const homeStyles = createStyles(colors);

  useEffect(() => {
    const loadNotes = async () => {
      const txt = await AsyncStorage.getItem("notes");
      if (txt) setNotes(JSON.parse(txt));
    };
    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      await AsyncStorage.setItem("notes", JSON.stringify(notes));
    };
    saveNotes();
  }, [notes]);

  const handleAddNote = async () => {
    if (!text.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(36),
      title: text,
      completed: false,
    };
    setNotes([newNote, ...notes]);
    setText("");
  };

  const handleRemoveNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <View style={homeStyles.container}>
      {/* Заголовок екрана */}
      <View style={homeStyles.header}>
        <View style={homeStyles.titleContainer}>
          <View style={homeStyles.iconContainer}>
            <Ionicons name="flash-outline" size={28} color="#fff" />
          </View>

          <View style={homeStyles.titleTextContainer}>
            <Text style={homeStyles.title}>Today&apos;s Tasks</Text>
            <Text style={homeStyles.subtitle}>10 of 20 completed</Text>
          </View>
        </View>
      </View>
      {/* Поле для введення нотатки та кнопка відправки */}
      <View style={homeStyles.inputSection}>
        <View style={homeStyles.inputWrapper}>
          <TextInput
            style={homeStyles.input}
            placeholder="What needs to be done?"
            value={text}
            onChangeText={setText}
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity
            onPress={handleAddNote}
            activeOpacity={0.8}
            disabled={!text.trim()}
            style={[
              homeStyles.addButton,
              !text.trim() && homeStyles.addButtonDisabled,
            ]}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Списковий компонент FlatList для рендерингу елементів */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={homeStyles.todoItemWrapper}>
            <View style={homeStyles.todoItem}>
              <View style={homeStyles.todoTextContainer}>
                <Text
                  style={[
                    homeStyles.todoText,
                    item.completed && {
                      textDecorationLine: "line-through",
                      color: colors.textMuted,
                      opacity: 0.6,
                    },
                  ]}
                >
                  {item.title}
                </Text>

                <View style={homeStyles.todoActions}>
                  <TouchableOpacity
                    onPress={() => {
                      handleRemoveNote(item.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={homeStyles.actionButton}>
                      <Ionicons name="trash-outline" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 24,
    },
    header: {
      paddingVertical: 32,
      paddingBottom: 24,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: colors.primary,
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      letterSpacing: -1,
      marginBottom: 4,
      color: colors.text,
    },
    subtitle: {
      fontSize: 17,
      fontWeight: "500",
      color: colors.textMuted,
    },
    inputSection: {
      paddingBottom: 24,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    input: {
      flex: 1,
      fontSize: 17,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      backgroundColor: colors.backgrounds.input,
      borderRadius: 16,
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    addButtonDisabled: {
      backgroundColor: colors.textMuted,
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    todoItemWrapper: {
      marginVertical: 12,
    },
    todoItem: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      padding: 20,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      backgroundColor: colors.surface,
    },
    checkbox: {
      marginRight: 16,
      marginTop: 2,
    },
    checkboxInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    todoTextContainer: {
      flex: 1,
    },
    todoText: {
      fontSize: 17,
      lineHeight: 24,
      fontWeight: "500" as const,
      marginBottom: 16,
      color: colors.text,
    },
    todoActions: {
      flexDirection: "row" as const,
      gap: 12,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.danger,
    },
  });
