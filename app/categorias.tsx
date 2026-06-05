import { ColorPicker } from "@/src/components/ColorPicker";
import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// Icon mapping with emoji/unicode symbols
const iconMap: Record<string, string> = {
  tag: "🏷️",
  shopping: "🛒",
  utensils: "🍽️",
  car: "🚗",
  home: "🏠",
  heart: "❤️",
  book: "📚",
  dumbbell: "💪",
  school: "🎓",
  briefcase: "💼",
};

export default function CategoriesScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const { categories, addCategory, deleteCategory, updateCategory } =
    useCategories();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4CAF50");
  const [selectedIcon, setSelectedIcon] = useState("tag");

  const mainCategories = categories.filter((c) => !c.parentId);

  const getSubCategories = (parentId: string) => {
    return categories.filter((c) => c.parentId === parentId);
  };

  const openAddModal = () => {
    setCategoryName("");
    setSelectedColor("#4CAF50");
    setSelectedIcon("tag");
    setIsEditMode(false);
    setEditingId(null);
    setIsModalVisible(true);
  };

  const openEditModal = (category: typeof categories[0]) => {
    setCategoryName(category.name);
    setSelectedColor(category.color || "#4CAF50");
    setSelectedIcon(category.icon || "tag");
    setIsEditMode(true);
    setEditingId(category.id);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (categoryName.trim() === "") {
      Alert.alert("Erro", "Nome da categoria é obrigatório");
      return;
    }

    try {
      if (isEditMode && editingId) {
        await updateCategory(editingId, {
          name: categoryName,
          color: selectedColor,
          icon: selectedIcon,
        });
      } else {
        await addCategory({
          name: categoryName,
          color: selectedColor,
          icon: selectedIcon,
          type: "custom",
          isDefault: false,
        });
      }
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a categoria");
      console.error(error);
    }
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir a categoria "${categoryName}"? Todas as transações associadas serão mantidas, mas sem categoria.`,
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a categoria");
              console.error(error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const iconOptions = ["tag", "shopping", "utensils", "car", "home", "heart", "book", "dumbbell", "school", "briefcase"];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Text style={styles.headerTitle}>Categorias</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mainCategories.map((mainCat) => {
          const subCategories = getSubCategories(mainCat.id);
          return (
            <View key={mainCat.id} style={styles.categorySection}>
              {/* Main Category */}
              <View
                style={[
                  styles.mainCategoryCard,
                  { borderLeftColor: mainCat.color || Colors.primary },
                ]}
              >
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.categoryCircle,
                      { backgroundColor: mainCat.color },
                    ]}
                  />
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: Colors.text }]}>
                      {mainCat.name}
                    </Text>
                    {subCategories.length > 0 && (
                      <Text style={[styles.subcategoryCount, { color: Colors.placeholder }]}>
                        {subCategories.length} subcategorias
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(mainCat)}
                  >
                    <Text style={{ fontSize: 18, color: Colors.primary }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(mainCat.id, mainCat.name)}
                  >
                    <Text style={{ fontSize: 18, color: "#FF6B6B" }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Subcategories */}
              {subCategories.length > 0 && (
                <View style={styles.subcategoriesContainer}>
                  {subCategories.map((subCat) => (
                    <View
                      key={subCat.id}
                      style={[
                        styles.subcategoryCard,
                        { borderLeftColor: subCat.color || Colors.primary },
                      ]}
                    >
                      <View style={styles.categoryLeft}>
                        <View
                          style={[
                            styles.subcategoryCircle,
                            { backgroundColor: subCat.color },
                          ]}
                        />
                        <Text style={[styles.categoryName, { color: Colors.text }]}>
                          {subCat.name}
                        </Text>
                      </View>
                      <View style={styles.categoryActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => openEditModal(subCat)}
                        >
                          <Text style={{ fontSize: 16, color: Colors.primary }}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDelete(subCat.id, subCat.name)}
                        >
                          <Text style={{ fontSize: 16, color: "#FF6B6B" }}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors.primary }]}
        onPress={openAddModal}
      >
        <Text style={{ fontSize: 28, color: "white" }}>➕</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: Colors.background }]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={{ fontSize: 28, color: Colors.text }}>✕</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: Colors.text }]}>
                {isEditMode ? "Editar Categoria" : "Nova Categoria"}
              </Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.saveButton, { color: Colors.primary }]}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Name Input */}
              <Text style={[styles.inputLabel, { color: Colors.text }]}>
                Nome da Categoria
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: Colors.border,
                    color: Colors.text,
                    backgroundColor: Colors.cardBackground,
                  },
                ]}
                placeholder="Digite o nome..."
                placeholderTextColor={Colors.placeholder}
                value={categoryName}
                onChangeText={setCategoryName}
              />

              {/* Color Picker */}
              <Text style={[styles.inputLabel, { color: Colors.text }]}>
                Selecione a Cor
              </Text>
              <ColorPicker
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />

              {/* Icon Selector */}
              <Text style={[styles.inputLabel, { color: Colors.text }]}>
                Selecione o Ícone
              </Text>
              <View style={styles.iconGrid}>
                {iconOptions.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && {
                        borderColor: Colors.primary,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text
                      style={{
                        fontSize: 28,
                        color: selectedIcon === icon ? Colors.primary : Colors.text,
                      }}
                    >
                      {iconMap[icon]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preview */}
              <View
                style={[
                  styles.previewCard,
                  { backgroundColor: Colors.cardBackground },
                ]}
              >
                <Text style={[styles.previewLabel, { color: Colors.placeholder }]}>
                  Prévia
                </Text>
                <View style={styles.previewContent}>
                  <View
                    style={[
                      styles.previewCircle,
                      { backgroundColor: selectedColor },
                    ]}
                  />
                  <Text style={[styles.previewIcon, { fontSize: 24, color: Colors.text }]}>
                    {iconMap[selectedIcon]}
                  </Text>
                  <Text style={[styles.previewText, { color: Colors.text }]}>
                    {categoryName || "Categoria"}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categorySection: {
    marginBottom: 16,
  },
  mainCategoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subcategoryCount: {
    fontSize: 12,
  },
  categoryActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  subcategoriesContainer: {
    marginLeft: 20,
    gap: 8,
  },
  subcategoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    elevation: 1,
  },
  subcategoryCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  iconOption: {
    width: "18%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  previewCard: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 16,
    marginBottom: 40,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  previewIcon: {
    marginRight: 12,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
