import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DarkMode, LightMode } from "../styles/cores";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const FAQS: FAQ[] = [
  {
    id: "1",
    question: "Como adicionar uma nova transação?",
    answer:
      "Toque no ícone '+' no centro da barra de navegação. Escolha o tipo (Gasto ou Ganho), insira o valor, descrição e categoria. Toque em 'Salvar'.",
  },
  {
    id: "2",
    question: "Como editar ou deletar uma transação?",
    answer:
      "Vá para a aba 'Agenda' ou 'Busca', localize a transação desejada e toque nela. Uma modal se abrirá permitindo editar ou deletar.",
  },
  {
    id: "3",
    question: "Como criar uma categoria personalizada?",
    answer:
      "Acesse a aba 'Categorias', toque em 'Adicionar Categoria', escolha a cor e ícone, insira o nome e toque em 'Salvar'.",
  },
  {
    id: "4",
    question: "Posso rastrear parcelamentos?",
    answer:
      "Sim! Ao adicionar uma transação, você pode marcar como parcelada. O sistema gera automaticamente as parcelas futuras.",
  },
  {
    id: "5",
    question: "Como usar o filtro de busca?",
    answer:
      "Na aba 'Busca', use os filtros para procurar por descrição, categoria, tipo de transação ou período. Você pode combinar múltiplos filtros.",
  },
  {
    id: "6",
    question: "Como ativar o modo escuro?",
    answer:
      "Vá para 'Configurações' e ative o toggle 'Modo Escuro'. A preferência será salva automaticamente.",
  },
  {
    id: "7",
    question: "Posso exporter meus dados?",
    answer:
      "Sim! Na seção de Relatórios, você pode gerar e visualizar relatórios detalhados de suas transações.",
  },
  {
    id: "8",
    question: "Como funciona o Chat Inteligente?",
    answer:
      "O assistente financeiro analisa suas transações e fornece insights. Pergunte sobre seu saldo, despesas, receitas ou peça dicas de economia.",
  },
];

const TIPS: Tip[] = [
  {
    id: "1",
    title: "Registre todas as transações",
    description:
      "Para obter uma visão clara de suas finanças, registre cada compra e receita. Quanto mais dados, melhores os insights.",
    icon: "receipt-outline",
  },
  {
    id: "2",
    title: "Use categorias consistentemente",
    description:
      "Organize suas transações em categorias claras. Isso facilita o rastreamento de padrões de gastos.",
    icon: "pricetag-outline",
  },
  {
    id: "3",
    title: "Revise seus gastos regularmente",
    description:
      "Analise seus relatórios semanal ou mensalmente para identificar oportunidades de economia.",
    icon: "trending-down-outline",
  },
  {
    id: "4",
    title: "Estabeleça um orçamento",
    description:
      "Defina limites de gastos por categoria para manter suas finanças sob controle.",
    icon: "wallet-outline",
  },
  {
    id: "5",
    title: "Consulte o assistente financeiro",
    description:
      "Converse com o assistente para obter recomendações personalizadas baseadas em seus dados.",
    icon: "chatbox-outline",
  },
  {
    id: "6",
    title: "Acompanhe as tendências",
    description:
      "Use os gráficos para visualizar como suas finanças evoluem ao longo do tempo.",
    icon: "bar-chart-outline",
  },
];

interface HelpCenterProps {
  darkMode: boolean;
  visible: boolean;
  onClose: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({
  darkMode,
  visible,
  onClose,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const [activeTab, setActiveTab] = useState<"faq" | "tips">("faq");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const renderFAQItem = ({ item }: { item: FAQ }) => (
    <TouchableOpacity
      style={[
        styles.faqItem,
        {
          backgroundColor:
            expandedFAQ === item.id
              ? Colors.cardBackground + "20"
              : Colors.cardBackground,
          borderColor: Colors.borderColor,
        },
      ]}
      onPress={() =>
        setExpandedFAQ(expandedFAQ === item.id ? null : item.id)
      }
    >
      <View style={styles.faqHeader}>
        <Text
          style={[
            styles.faqQuestion,
            { color: Colors.textColorPrimary, flex: 1 },
          ]}
        >
          {item.question}
        </Text>
        <Ionicons
          name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textColorPrimary}
        />
      </View>

      {expandedFAQ === item.id && (
        <Text style={[styles.faqAnswer, { color: Colors.textColorPrimary }]}>
          {item.answer}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderTipItem = ({ item }: { item: Tip }) => (
    <View
      style={[
        styles.tipCard,
        { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
      ]}
    >
      <View
        style={[
          styles.tipIconContainer,
          { backgroundColor: Colors.cardBackground + "20" },
        ]}
      >
        <Ionicons
          name={item.icon as any}
          size={28}
          color={Colors.textColorPrimary}
        />
      </View>
      <View style={styles.tipContent}>
        <Text style={[styles.tipTitle, { color: Colors.textColorPrimary }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.tipDescription, { color: Colors.textColorPrimary }]}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.backgroundColor }]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
          ]}
        >
          <Text style={[styles.title, { color: Colors.textColorPrimary }]}>
            Central de Ajuda
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close-outline" size={24} color={Colors.textColorPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: Colors.cardBackground }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "faq" && {
                borderBottomColor: Colors.cardBackground,
                borderBottomWidth: 3,
              },
            ]}
            onPress={() => setActiveTab("faq")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "faq" ? Colors.textColorPrimary : Colors.accentGreen,
                  fontWeight: activeTab === "faq" ? "bold" : "600",
                },
              ]}
            >
              FAQs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "tips" && {
                borderBottomColor: Colors.cardBackground,
                borderBottomWidth: 3,
              },
            ]}
            onPress={() => setActiveTab("tips")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "tips" ? Colors.textColorPrimary : Colors.accentGreen,
                  fontWeight: activeTab === "tips" ? "bold" : "600",
                },
              ]}
            >
              Dicas
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "faq"? 
        <FlatList
          data={FAQS}
          keyExtractor={(item) => item.id}
          renderItem={renderFAQItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled
        />:
        <FlatList
          data={TIPS}
          keyExtractor={(item) => item.id}
          renderItem={renderTipItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled
        />
        }
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  faqItem: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
});
