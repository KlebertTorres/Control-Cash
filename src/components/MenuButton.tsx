import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function MenuButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ marginRight: 20 }}
      onPress={() =>
        navigation.dispatch(DrawerActions.openDrawer())
      }
    >
      <Ionicons name="menu" size={28} color="white" />
    </TouchableOpacity>
  );
}