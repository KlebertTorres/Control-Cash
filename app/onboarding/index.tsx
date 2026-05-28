import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useOnBoarding } from "@/src/hooks/useOnBoarding";
import { useTransactionStore } from "@/src/hooks/useTransactionStore";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function Onboarding() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const { completeOnboarding } = useOnBoarding();
  const { addTransaction } = useTransactionStore();

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

  const handleFinish = () => {
    const numericData = {
      salary: parseFloat(data.salary) || 0,
      extraIncome: parseFloat(data.extraIncome) || 0,
      waterBill: parseFloat(data.waterBill) || 0,
      electricityBill: parseFloat(data.electricityBill) || 0,
      internetBill: parseFloat(data.internetBill) || 0,
    };

    // Adicionar transações iniciais
    const now = new Date().toISOString();
    if (numericData.salary > 0) {
      addTransaction({
        type: "income",
        amount: numericData.salary,
        description: "Salário",
        date: now,
        category: "Salário",
      });
    }
    if (numericData.extraIncome > 0) {
      addTransaction({
        type: "income",
        amount: numericData.extraIncome,
        description: "Renda Extra",
        date: now,
        category: "Extra",
      });
    }
    if (numericData.waterBill > 0) {
      addTransaction({
        type: "expense",
        amount: numericData.waterBill,
        description: "Conta de Água",
        date: now,
        category: "Contas",
      });
    }
    if (numericData.electricityBill > 0) {
      addTransaction({
        type: "expense",
        amount: numericData.electricityBill,
        description: "Conta de Luz",
        date: now,
        category: "Contas",
      });
    }
    if (numericData.internetBill > 0) {
      addTransaction({
        type: "expense",
        amount: numericData.internetBill,
        description: "Internet",
        date: now,
        category: "Contas",
      });
    }

    completeOnboarding(numericData);
    router.replace("/(tabs)/home");
  };

  const currentStep = steps[step];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.emoji}>📊</Text>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description}>{currentStep.description}</Text>

        {currentStep.fields?.map((field) => (
          <TextInput
            key={field.key}
            style={[styles.input, {backgroundColor: Colors.lightGreen}]}
            placeholder={field.label}
            placeholderTextColor="#666"
            value={data[field.key]}
            onChangeText={(value) =>
              setData((prev) => ({ ...prev, [field.key]: value }))
            }
            keyboardType="numeric"
          />
        ))}

        {currentStep.tutorial?.map((item) => (
          <View key={item.title} style={styles.tutorialCard}>
            <Text style={styles.tutorialTitle}>{item.title}</Text>
            <Text style={styles.tutorialDetail}>{item.detail}</Text>
          </View>
        ))}

        <TouchableOpacity style={[styles.button, {backgroundColor: Colors.deepGreen}]} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {step < steps.length - 1 ? "Próximo" : "Finalizar"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.stepIndicator}>
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
  input: {
    width: "85%",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    color: "#000",
    fontSize: 16,
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
    marginTop: 20,
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
