import { FlatList, View, TouchableOpacity, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import useTheme from "@/hooks/useTheme";
import { createStyles } from "@/styles/home.styles";
import { HeaderHome } from "@/components/HeaderHome";
import { NoteInput } from "@/components/NoteInput";

export default function HomeScreen() {
  const { colors } = useTheme();
  const homeStyles = createStyles(colors);

  const notes = useQuery(api.notes.getNotes);
  const deleteNote = useMutation(api.notes.deleteNote);

  const handleRemoveNote = (id: Id<"notes">) => {
    deleteNote({ id });
  };

  const totalNotes = notes?.length || 0;
  const completedNotes = notes?.filter((note) => note.completed).length || 0;

  return (
    <View style={homeStyles.container}>
      {/* Заголовок екрана */}
      <HeaderHome completedNotes={completedNotes} totalNotes={totalNotes} />
      {/* Поле для введення нотатки та кнопка відправки */}
      <NoteInput />
      {/* Списковий компонент FlatList для рендерингу елементів */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={(item) => item._id}
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
                      handleRemoveNote(item._id);
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
