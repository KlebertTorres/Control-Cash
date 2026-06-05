import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Transaction } from "../types/TransactionType";
import { db } from "./firebaseconfig";

// Validações
function validateTransaction(transaction: Partial<Transaction>): void {
  if (transaction.amount !== undefined && transaction.amount <= 0) {
    throw new Error("O valor da transação deve ser maior que zero");
  }
  if (transaction.date && !/^\d{4}-\d{2}-\d{2}$/.test(transaction.date)) {
    throw new Error("Data inválida. Use formato YYYY-MM-DD");
  }
  if (transaction.type && !["income", "expense"].includes(transaction.type)) {
    throw new Error("Tipo de transação deve ser 'income' ou 'expense'");
  }
}

export async function CreateTransactionDoc(uid: string, transaction: Omit<Transaction, "id">): Promise<Transaction> {
    try {
        validateTransaction(transaction);

        console.log("Criando transação...")

        const transactionRef = collection(db, "users", uid, "transactions")

        const docRef = await addDoc(transactionRef, {   
            ...transaction,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })

        console.log("Transação criada com sucesso!");

        return { id: docRef.id, ...transaction };

    } catch(error: any) {
        console.error("Falha ao criar a transação: ", error);
        throw new Error(error.message || "Erro ao criar transação");
    }
}

export async function GetTransactionDoc(uid: string, transactionId: string): Promise<Transaction | null> {
    try {
        const transactionRef = doc(db, "users", uid, "transactions", transactionId)

        const snapshot = await getDoc(transactionRef)

        if(snapshot.exists()){
            return {
                id: snapshot.id,
                ...snapshot.data(),
            } as Transaction;
        }

        return null;

    } catch(error: any) {
        console.error("Falha ao buscar a transação: ", error);
        throw new Error(error.message || "Erro ao buscar transação");
    }
}

export async function GetTransactionsDoc(uid: string): Promise<Transaction[]> {
    try {
        const transactionRef = collection(db, "users", uid, "transactions")

        const q = query(
            transactionRef,
            orderBy("date", "desc")
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Transaction));
        
    } catch(error: any) {
        console.error("Falha ao buscar as transações: ", error);
        return [];
    }
}

export async function GetTransactionsByDateRange(uid: string, startDate: string, endDate: string): Promise<Transaction[]> {
    try {
        const transactionRef = collection(db, "users", uid, "transactions")

        const q = query(
            transactionRef,
            where("date", ">=", startDate),
            where("date", "<=", endDate),
            orderBy("date", "desc")
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Transaction));
        
    } catch(error: any) {
        console.error("Falha ao buscar transações por período: ", error);
        return [];
    }
}

export async function GetTransactionsByCategory(uid: string, categoryId: string): Promise<Transaction[]> {
    try {
        const transactionRef = collection(db, "users", uid, "transactions")

        const q = query(
            transactionRef,
            where("categoryId", "==", categoryId),
            orderBy("date", "desc")
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Transaction));
        
    } catch(error: any) {
        console.error("Falha ao buscar transações por categoria: ", error);
        return [];
    }
}

export async function UpdateTransactionDoc(uid: string, id: string, transactionData: Partial<Transaction>): Promise<void> {
    try {
        validateTransaction(transactionData);

        const transactionRef = doc(db, "users", uid, "transactions", id)

        console.log("Atualizando transação...")

        await updateDoc(transactionRef, {
            ...transactionData,
            updatedAt: serverTimestamp(),
        })
            
        console.log("Transação atualizada com sucesso!")

    } catch(error: any) {
        console.error("Falha ao atualizar a transação: ", error);
        throw new Error(error.message || "Erro ao atualizar transação");
    }
}

export async function DeleteTransactionDoc(uid: string, transactionId: string): Promise<void> {
    try {
        const transactionRef = doc(db, "users", uid, "transactions", transactionId)

        console.log("Deletando transação...")

        console.log(
        "Caminho:",
        `users/${uid}/transactions/${transactionId}`
        );

        await deleteDoc(transactionRef)

        console.log("Transação deletada!")

    } catch(error: any) {
        console.error("Falha ao deletar a transação: ", error);
        throw new Error(error.message || "Erro ao deletar transação");
    }
}