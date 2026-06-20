import { useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";

import { useQuery } from "convex/react";
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
  const flatListRef = useRef<FlatList>(null);

  const totalNotes = notes?.length || 0;
  const completedNotes = notes?.filter((note) => note.completed).length || 0;

  const handleStartEdit = (index: number) => {
    setTimeout(() => {
      try {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      } catch {
        // Fallback: scroll to end if we are editing the last item
        if (notes && index === notes.length - 1) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }
    }, 150);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={homeStyles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Заголовок екрана */}
      <HeaderHome completedNotes={completedNotes} totalNotes={totalNotes} />
      {/* Поле для введення нотатки та кнопка відправки */}
      <NoteInput />
      {/* Списковий компонент FlatList для рендерингу елементів */}
      <FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 160 }}
        renderItem={({ item, index }) => (
          <ItemNote
            id={item._id}
            title={item.title}
            completed={item.completed}
            onStartEdit={() => handleStartEdit(index)}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}
