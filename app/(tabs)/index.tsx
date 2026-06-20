import { FlatList, View, TouchableOpacity, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import useTheme from "@/hooks/useTheme";
import { createStyles } from "@/styles/home.styles";
import { HeaderHome } from "@/components/HeaderHome";
import { NoteInput } from "@/components/NoteInput";
import { ItemNote } from "@/components/ItemNote";

export default function HomeScreen() {
  const { colors } = useTheme();
  const homeStyles = createStyles(colors);

  const notes = useQuery(api.notes.getNotes);

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
          <ItemNote
            id={item._id}
            title={item.title}
            completed={item.completed}
          />
        )}
      />
    </View>
  );
}
