import {
  createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut
} from "firebase/auth";
import { auth } from "./firebaseconfig";
import { CreateUserDoc, DeleteUserDoc, GetUserDoc } from "./userService";
import { DeleteTransactionDoc } from "./transactionService";
import { DeleteCategoryDoc, CreateCategoryDoc } from "./categoryService";
import { Transaction } from "../types/TransactionType";
import { Category } from "../types/CategoryType";

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

export async function Registrar( email: string, name: string, senha: string) {

  try {
    console.log("Criando auth...");

    const userCredential =
      await createUserWithEmailAndPassword(auth, email, senha);

    console.log("Auth criado!");

    console.log("UID:", userCredential.user.uid);

    await CreateUserDoc({
      uid: userCredential.user.uid,
      name,
      email,
    });

    console.log("Firestore criado!");

    // Create default categories
    console.log("Criando categorias padrão...");
    for (const category of DEFAULT_CATEGORIES) {
      try {
        await CreateCategoryDoc(userCredential.user.uid, {
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

    return userCredential.user;

  } catch (error) {

    console.log("ERRO REGISTRO:", error);

    throw error;
  }
}

export async function Login(email: string, senha: string) {

  try {
    const userCredentials =
      await signInWithEmailAndPassword(auth, email, senha);

    const firebaseUser = userCredentials.user;

    const userData =
      await GetUserDoc(firebaseUser.uid);

    return {
      firebaseUser,
      userData,
    };

  } catch (error) {

    console.log("ERRO LOGIN:", error);

    throw error;
  }
}

export async function Logout() {
  await signOut(auth);
}

export async function DeletarConta(transactions: Transaction[], categories: Category[]){
  const user = auth.currentUser;

  if(!user) return;

  try{

    for (const transaction of transactions) {
      await DeleteTransactionDoc(
        user.uid,
        transaction.id
      );
    }

    for (const category of categories) {
      await DeleteCategoryDoc(
        user.uid,
        category.id
      );
    }

    //Apaga do firestore
    await DeleteUserDoc(user.uid);
    
    //Apaga do authenticator
    await deleteUser(user)

    Logout()

  }catch(error){
    console.error("Erro ao deletar:", error);
  }
}