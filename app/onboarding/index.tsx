import { InputField } from "@/src/components/InputField";
import { SimpleButton } from "@/src/components/SimpleButton";
import { useTheme } from "@/src/hooks/useTheme";
import { useAuth } from "@/src/hooks/useAuth";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { UpdateUserDoc } from "@/src/services/userService";
import { useCategories } from "@/src/hooks/useCategories";

export default function Onboarding() {
  const router = useRouter();

  const { user, setUser } = useAuth();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;
  const { categories, addCategory, getCategoryByName } = useCategories();

  const { addTransaction } = useTransaction();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    salary: "",
    extraIncome: "",
    waterBill: "",
    electricityBill: "",
    internetBill: "",
  });

  type OnboardingStep = {
    title: string;
    description: string;
    fields?: {
      key: keyof typeof data;
      label: string;
      placeholder: string;
    }[];
    tutorial?: { title: string; detail: string }[];
  };

  const steps: OnboardingStep[] = [
    {
      title: "Bem-vindo ao Control Cash!",
      description:
        "Vamos configurar seu perfil financeiro. Primeiro, informe sua renda mensal.",
      fields: [
        {
          key: "salary",
          label: "Salário Líquido (R$)",
          placeholder: "Ex: 3000",
        },
        {
          key: "extraIncome",
          label: "Renda Extra (R$)",
          placeholder: "Ex: 500",
        },
      ],
    },
    {
      title: "Contas Fixas",
      description: "Agora, informe suas contas fixas mensais.",
      fields: [
        {
          key: "waterBill",
          label: "Conta de Água (R$)",
          placeholder: "Ex: 80",
        },
        {
          key: "electricityBill",
          label: "Conta de Luz (R$)",
          placeholder: "Ex: 150",
        },
        { key: "internetBill", label: "Internet (R$)", placeholder: "Ex: 100" },
      ],
    },
    {
      title: "Tutorial do App",
      description:
        "Agora que você já informou seus valores, veja como usar cada parte do aplicativo.",
      tutorial: [
        {
          title: "Tela Inicial",
          detail:
            "Aqui você verá o seu saldo atualizado automaticamente com seu salário e gastos mensais inseridos.",
        },
        {
          title: "Adicionar Transação",
          detail:
            "Use essa tela para registrar qualquer gasto ou ganho extra do mês. Tudo exibido será baseado nos seus valores.",
        },
        {
          title: "Estatísticas",
          detail:
            "Os valores e gráficos são gerados a partir das transações reais que você inserir, incluindo suas contas fixas e renda.",
        },
        {
          title: "Configurações",
          detail:
            "Aqui você pode alternar o tema, ver informações do perfil e retornar ao tutorial sempre que quiser.",
        },
      ],
    },
  ];

  const handleNext = () => {
      if (step < steps.length - 1) {
      setStep(step + 1);
      } else {
      handleFinish();
      }
  };

  const handleBack = () => {
      if (step > 0) {
          setStep(step - 1);
      }
  };

  const DEFAULT_CATEGORIES = [
    { name: "Alimentação", color: "#FF6B6B", icon: "🍔", type: "expense" as const },
    { name: "Transporte", color: "#4ECDC4", icon: "🚗", type: "expense" as const },
    { name: "Moradia", color: "#45B7D1", icon: "🏠", type: "expense" as const },
    { name: "Saúde", color: "#96CEB4", icon: "⚕️", type: "expense" as const },
    { name: "Educação", color: "#FFEAA7", icon: "📚", type: "expense" as const },
    { name: "Lazer", color: "#DDA15E", icon: "🎮", type: "expense" as const },
    { name: "Utilidades", color: "#BC6C25", icon: "💡", type: "expense" as const },
    { name: "Investimentos", color: "#2ECC71", icon: "📈", type: "income" as const },
    { name: "Salário", color: "#27AE60", icon: "💼", type: "income" as const },
    { name: "Freelance", color: "#F39C12", icon: "💻", type: "income" as const },
  ];

  const handleFinish = async () => {

    setLoading(true);

    // Create default categories
    console.log("Criando categorias padrão...");
    for (const category of DEFAULT_CATEGORIES) {
      try {
        await addCategory({ 
          name: category.name,
          color: category.color,
          icon: category.icon,
          type: category.type,
          isDefault: true,
        });
      } catch (error) {
        console.error(`Erro ao criar categoria ${category.name}:`, error);
      }
    }

    console.log("Categorias padrão criadas!");

    const categoriaMoradia = await getCategoryByName("Moradia");
    const categoriaSalario = await getCategoryByName("Salário");

    const numericData = {
      salary: parseFloat(data.salary) || 0,
      extraIncome: parseFloat(data.extraIncome) || 0,
      waterBill: parseFloat(data.waterBill) || 0,
      electricityBill: parseFloat(data.electricityBill) || 0,
      internetBill: parseFloat(data.internetBill) || 0,
    };

    // Adicionar transações iniciais
    const now = new Date().toISOString().split("T")[0];
    if (numericData.salary > 0) {
      addTransaction({
        type: "income",
        amount: numericData.salary,
        description: "Salário",
        date: now,
        categoryId: categoriaSalario.id,
      });
      await UpdateUserDoc(user.uid, { monthlyLimit: numericData.salary });
    }
    if (numericData.extraIncome > 0) {
      addTransaction({
        type: "income",
        amount: numericData.extraIncome,
        description: "Renda Extra",
        date: now,
        categoryId: categoriaSalario.id,
      });
    }
    if (numericData.waterBill > 0) {
      addTransaction({
        type: "expense",
        amount: numericData.waterBill,
        description: "Conta de Água",
        date: now,
        categoryId: categoriaMoradia.id,
      });
    }
    if (numericData.electricityBill > 0) {
      addTransaction({
        type: "expense",
        amount: numericData.electricityBill,
        description: "Conta de Luz",
        date: now,
        categoryId: categoriaMoradia.id,
      });
    }
    if (numericData.internetBill > 0) {
      addTransaction({
        type: "expense",
        amount: numericData.internetBill,
        description: "Internet",
        date: now,
        categoryId: categoriaMoradia.id,
      });
    }

    await UpdateUserDoc(user.uid, {tutorialComplete: true});
    
    setUser({
      ...user,
      tutorialComplete: true,
    });

    router.replace("/(drawer)/(tabs)/home");
  };

  const currentStep = steps[step];

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.emoji}>📊</Text>
        <Text style={[styles.title, { color: Colors.text }]}>{currentStep.title}</Text>
        <Text style={[styles.description, { color: Colors.text }]}>{currentStep.description}</Text>

        {currentStep.fields?.map((field) => (
            <InputField
                style={{width: "85%"}}
                key={field.key}
                placeholder={field.label}
                onChangeText={(value:any) =>
                    setData((prev) => ({ ...prev, [field.key]: value }))
                }  
                value={data[field.key]}
                keyboardType="numeric"
            />
        ))}

        {currentStep.tutorial?.map((item) => (
          <View key={item.title} style={[styles.tutorialCard, { backgroundColor: Colors.cardBackground }]}>
            <Text style={styles.tutorialTitle}>{item.title}</Text>
            <Text style={styles.tutorialDetail}>{item.detail}</Text>
          </View>
        ))}

        <SimpleButton 
          styleButton={[styles.button, loading && { paddingHorizontal: 30 }]} 
          onPress={handleNext}
          styleText={styles.buttonText}
          text={step < steps.length - 1 ? "Próximo" : loading ? "Carregando..." : "Finalizar"}
          disabled={loading}
        />

        {step > 0 && <SimpleButton 
            styleButton={styles.button} 
            onPress={handleBack}
            styleText={styles.buttonText}
            text="Voltar"
        />}

        <Text style={[styles.stepIndicator, { color: Colors.text }]}>
          {step + 1} de {steps.length}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 100
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  tutorialCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  tutorialDetail: {
    fontSize: 15,
    color: "#f0f0f0",
    lineHeight: 22,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepIndicator: {
    color: "#ccc",
    marginTop: 20,
    fontSize: 14,
  },
});