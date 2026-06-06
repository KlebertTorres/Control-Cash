import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DarkMode, LightMode } from "../styles/cores";
import {
  exportToJSON,
  exportToCSV,
  exportToText,
} from "../services/reportExportService";
import { Transaction } from "../types/TransactionType";
import { Category } from "../types/CategoryType";

interface ExportDialogProps {
  visible: boolean;
  transactions: Transaction[];
  categories: Category[];
  period: string;
  onClose: () => void;
  darkMode: boolean;
}

interface ExportOption {
  id: string;
  format: string;
  description: string;
  icon: string;
  color: string;
  mimeType: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "json",
    format: "JSON",
    description: "Formato estruturado para importação em outros apps",
    icon: "code-outline",
    color: "#3b82f6",
    mimeType: "application/json",
  },
  {
    id: "csv",
    format: "CSV",
    description: "Compatível com Excel e Google Sheets",
    icon: "grid-outline",
    color: "#10b981",
    mimeType: "text/csv",
  },
  {
    id: "txt",
    format: "Texto",
    description: "Relatório em formato legível",
    icon: "document-text-outline",
    color: "#f59e0b",
    mimeType: "text/plain",
  },
];

export const ExportDialog: React.FC<ExportDialogProps> = ({
  visible,
  transactions,
  categories,
  period,
  onClose,
  darkMode,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: string) => {
    if (transactions.length === 0) {
      Alert.alert("Aviso", "Nenhuma transação para exportar.");
      return;
    }

    try {
      setExporting(true);

      const timestamp = new Date().getTime();
      const fileName = `relatorio_${period}_${timestamp}`;

      switch (format) {
        case "json":
          await exportToJSON(transactions, categories, period, `${fileName}.json`);
          break;
        case "csv":
          await exportToCSV(transactions, categories, `${fileName}.csv`);
          break;
        case "txt":
          await exportToText(transactions, categories, period, `${fileName}.txt`);
          break;
      }

      Alert.alert("Sucesso", `Relatório exportado em formato ${format.toUpperCase()}!`);
      onClose();
    } catch (error) {
      console.error(`Erro ao exportar em ${format}:`, error);
      Alert.alert("Erro", `Não foi possível exportar o relatório em ${format}.`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        ]}
      >
        <View
          style={[
            styles.dialog,
            { backgroundColor: Colors.cardBackground },
          ]}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: Colors.borderColor },
            ]}
          >
            <Text style={[styles.title, { color: Colors.text }]}>
              Exportar Relatório
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons
                name="close-outline"
                size={24}
                color={Colors.secondary}
              />
            </Pressable>
          </View>

          <Text
            style={[
              styles.subtitle,
              { color: Colors.secondary, marginHorizontal: 16, marginTop: 16 },
            ]}
          >
            Escolha o formato desejado:
          </Text>

          <View style={styles.optionsContainer}>
            {EXPORT_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: Colors.backgroundColor,
                    borderColor: Colors.borderColor,
                  },
                ]}
                onPress={() => handleExport(option.id)}
                disabled={exporting}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.color + "20" },
                  ]}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color={option.color} />
                  ) : (
                    <Ionicons
                      name={option.icon as any}
                      size={24}
                      color={option.color}
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.optionTitle,
                      { color: Colors.text },
                    ]}
                  >
                    {option.format}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: Colors.secondary },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={Colors.secondary}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[
              styles.cancelButton,
              {
                backgroundColor: Colors.backgroundColor,
                borderColor: Colors.borderColor,
              },
            ]}
            onPress={onClose}
            disabled={exporting}
          >
            <Text style={[styles.cancelButtonText, { color: Colors.text }]}>
              Cancelar
            </Text>
          </Pressable>

          <Text
            style={[
              styles.info,
              { color: Colors.secondary, marginHorizontal: 16 },
            ]}
          >
            {transactions.length} transações serão incluídas no relatório
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    borderRadius: 12,
    width: "85%",
    maxHeight: "80%",
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
  },
  cancelButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  info: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
});
