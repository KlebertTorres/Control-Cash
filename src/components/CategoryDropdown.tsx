import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Category } from "../types/CategoryType";
import { DarkMode, LightMode } from "../styles/cores";

interface CategoryDropdownProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
  darkMode: boolean;
  transactionType: "income" | "expense";
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedId,
  onSelect,
  darkMode,
  transactionType,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const Colors = darkMode ? DarkMode : LightMode;

  // Filter categories by type (only parent categories)
  const parentCategories = categories.filter(
    (cat) =>
      !cat.parentId &&
      (!cat.type || cat.type === transactionType || cat.type === "custom")
  );

  // Get subcategories for selected parent
  const subcategories = selectedParentId
    ? categories.filter((cat) => cat.parentId === selectedParentId)
    : [];

  const selectedCategory = categories.find((cat) => cat.id === selectedId);
  const selectedParent = selectedParentId
    ? categories.find((cat) => cat.id === selectedParentId)
    : null;

  const handleSelectCategory = (categoryId: string) => {
    onSelect(categoryId);
    setModalVisible(false);
    setSelectedParentId(null);
  };

  const handleSelectParent = (parentId: string) => {
    setSelectedParentId(parentId);
  };

  const handleGoBack = () => {
    setSelectedParentId(null);
  };

  return (
    <View>
      <Pressable
        style={[
          styles.dropdownButton,
          { backgroundColor: Colors.cardBackground, borderColor: Colors.text },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { color: Colors.text }]}>
          {selectedCategory ? selectedCategory.name : "Selecione uma categoria"}
        </Text>
        {selectedCategory && (
          <View
            style={[
              styles.colorIndicator,
              { backgroundColor: selectedCategory.color || "#999" },
            ]}
          />
        )}
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedParentId(null);
        }}
      >
        <View style={[styles.modalOverlay, { backgroundColor: Colors.overlay }]}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: Colors.cardBackground },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: Colors.borderColor },
              ]}
            >
              {selectedParentId && (
                <Pressable onPress={handleGoBack}>
                  <Text style={[styles.backButton, { color: Colors.primary }]}>
                    ← Voltar
                  </Text>
                </Pressable>
              )}
              <Text
                style={[
                  styles.modalTitle,
                  { color: Colors.text, flex: 1, textAlign: "center" },
                ]}
              >
                {selectedParentId
                  ? `Subcategorias de ${selectedParent?.name}`
                  : "Categorias"}
              </Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setSelectedParentId(null);
                }}
              >
                <Text style={[styles.closeButton, { color: Colors.primary }]}>
                  ✕
                </Text>
              </Pressable>
            </View>

            <ScrollView style={styles.categoryList}>
              {selectedParentId ? (
                // Show subcategories
                subcategories.length > 0 ? (
                  subcategories.map((category) => (
                    <Pressable
                      key={category.id}
                      style={[
                        styles.categoryItem,
                        {
                          backgroundColor:
                            selectedId === category.id
                              ? Colors.primary + "20"
                              : "transparent",
                        },
                      ]}
                      onPress={() => handleSelectCategory(category.id)}
                    >
                      <View
                        style={[
                          styles.categoryItemColor,
                          { backgroundColor: category.color || "#999" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.categoryItemText,
                          { color: Colors.text },
                        ]}
                      >
                        {category.icon ? `${category.icon} ` : ""}{category.name}
                      </Text>
                      {selectedId === category.id && (
                        <Text style={[styles.checkmark, { color: Colors.primary }]}>
                          ✓
                        </Text>
                      )}
                    </Pressable>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: Colors.text }]}>
                    Nenhuma subcategoria
                  </Text>
                )
              ) : (
                // Show parent categories
                parentCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      {
                        backgroundColor:
                          selectedId === category.id
                            ? Colors.primary + "20"
                            : "transparent",
                      },
                    ]}
                    onPress={() => {
                      const subs = categories.filter(
                        (cat) => cat.parentId === category.id
                      );
                      if (subs.length > 0) {
                        handleSelectParent(category.id);
                      } else {
                        handleSelectCategory(category.id);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.categoryItemColor,
                        { backgroundColor: category.color || "#999" },
                      ]}
                    />
                    <Text
                      style={[styles.categoryItemText, { color: Colors.text }]}
                    >
                      {category.icon ? `${category.icon} ` : ""}{category.name}
                    </Text>
                    {selectedId === category.id && (
                      <Text style={[styles.checkmark, { color: Colors.primary }]}>
                        ✓
                      </Text>
                    )}
                    {categories.some((cat) => cat.parentId === category.id) && (
                      <Text
                        style={[styles.arrowIcon, { color: Colors.secondary }]}
                      >
                        →
                      </Text>
                    )}
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    flex: 1,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  categoryList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  categoryItemColor: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 12,
  },
  categoryItemText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  arrowIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 14,
  },
});
