import { createContext, ReactNode, useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTransaction } from "../hooks/useTransaction";
import { useCategories } from "../hooks/useCategories";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const FINANCIAL_INSIGHTS = {
  greeting: [
    "Olá! 👋 Sou seu assistente financeiro. Posso ajudá-lo com análises de gastos, dicas de economia e insights sobre suas transações.",
    "Bem-vindo! 💰 Estou aqui para ajudar você a entender melhor suas finanças e tomar melhores decisões financeiras.",
  ],
  balance: [
    "Seu saldo atual é {{balance}}. Você está {{status}}.",
    "De acordo com seus dados, seu saldo total é {{balance}}.",
  ],
  expense: [
    "Seus maiores gastos são em {{category}}. Considere revisar seus gastos nessa categoria.",
    "Detectei um aumento de {{percentage}}% em {{category}} este mês. Posso ajudar com estratégias de economia?",
  ],
  savings: [
    "Parabéns! 🎉 Você economizou {{amount}} este mês. Continue assim!",
    "Você está indo bem! Sua taxa de economia é de {{percentage}}%.",
  ],
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { transactions, getBalance, getTotalIncome, getTotalExpense } = useTransaction();
  const { categories } = useCategories();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: FINANCIAL_INSIGHTS.greeting[0],
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const generateInsight = useCallback((): string => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const balance = getBalance();
    const income = getTotalIncome(currentMonth);
    const expense = getTotalExpense(currentMonth);

    // Generate relevant insight based on financial data
    if (balance > 0) {
      return `Seu saldo está positivo em R$ ${Math.abs(balance).toFixed(2)}! 📈 Você tem receitas de R$ ${income.toFixed(2)} e despesas de R$ ${Math.abs(expense).toFixed(2)} este mês.`;
    } else if (expense > 0) {
      return `Cuidado! 🚨 Suas despesas (R$ ${Math.abs(expense).toFixed(2)}) excedem suas receitas (R$ ${income.toFixed(2)}) este mês.`;
    } else {
      return `Parabéns! 🎉 Você tem receitas de R$ ${income.toFixed(2)} este mês. Mantenha os gastos sob controle!`;
    }
  }, [transactions, getBalance, getTotalIncome, getTotalExpense]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      addMessage(userMessage);
      setIsLoading(true);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate assistant response based on user input
      let assistantResponse = "";
      const lowerContent = content.toLowerCase();

      if (
        lowerContent.includes("saldo") ||
        lowerContent.includes("quanto tenho") ||
        lowerContent.includes("dinheiro")
      ) {
        const balance = getBalance();
        assistantResponse = `Seu saldo total é de R$ ${balance.toFixed(2)}. ${
          balance > 0
            ? "Você está em uma situação financeira positiva! 📈"
            : "Você está com saldo negativo. Considere revisar seus gastos. 📉"
        }`;
      } else if (
        lowerContent.includes("despesa") ||
        lowerContent.includes("gasto") ||
        lowerContent.includes("maior gasto")
      ) {
        const categoryExpenses = categories.map((cat) => {
          const categoryTotal = transactions
            .filter((t) => t.categoryId === cat.id && t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
          return { name: cat.name, total: categoryTotal };
        });

        const topCategory = categoryExpenses.reduce((max, cat) =>
          cat.total > max.total ? cat : max
        );

        assistantResponse =
          topCategory && topCategory.total > 0
            ? `Sua maior despesa é em ${topCategory.name}, com um total de R$ ${topCategory.total.toFixed(2)}. Considere revisar gastos nessa categoria.`
            : "Você não tem despesas registradas ainda.";
      } else if (
        lowerContent.includes("receita") ||
        lowerContent.includes("ganho") ||
        lowerContent.includes("renda")
      ) {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const income = getTotalIncome(currentMonth);

        assistantResponse =
          income > 0
            ? `Suas receitas este mês são de R$ ${income.toFixed(2)}. Ótimo! Continue gerenciando bem suas finanças. 💪`
            : "Você não tem receitas registradas este mês. Considere registrar suas entradas.";
      } else if (
        lowerContent.includes("economia") ||
        lowerContent.includes("economizar") ||
        lowerContent.includes("poupar")
      ) {
        assistantResponse =
          "Aqui estão algumas dicas para economizar:\n1. 📊 Revise suas despesas regularmente\n2. 🛒 Faça listas antes de comprar\n3. 💳 Evite compras por impulso\n4. 🎯 Estabeleça metas de economia\n5. 📱 Use este aplicativo para rastrear seus gastos";
      } else if (
        lowerContent.includes("oi") ||
        lowerContent.includes("olá") ||
        lowerContent.includes("opa")
      ) {
        assistantResponse =
          "Olá! 👋 Como posso ajudá-lo com suas finanças hoje? Posso responder sobre saldo, despesas, receitas, ou dar dicas de economia.";
      } else {
        // Default to general insight
        assistantResponse = generateInsight();
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
      setIsLoading(false);
    },
    [addMessage, transactions, categories, getBalance, getTotalIncome, getTotalExpense, generateInsight]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: FINANCIAL_INSIGHTS.greeting[0],
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        addMessage,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
