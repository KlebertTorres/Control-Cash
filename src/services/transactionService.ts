import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { Transaction } from "../types/TransactionsType";
import { db } from "./firebaseconfig";

export async function CreateTransactionDoc(uid: string, transaction: Omit<Transaction, "id">){
    try{

        console.log("Criando transação...")

        const transactionRef = collection(db, "users", uid, "transactions")

        const docRef = 
            await addDoc(
                transactionRef, 
                {   
                    ...transaction,
                    createdAt: serverTimestamp(),
                }
            )

        console.log("Transação criada com sucesso!");

        return {id: docRef.id, ...transaction};

    }catch(error){
        console.log("Falha ao criar a transação: ", error);
        throw error;
    }
}

export async function GetTransactionDoc(uid:string, transactionId:string){
    try{

        const transactionRef = doc(db, "users", uid, "transactions", transactionId)

        const snapshot = await getDoc(transactionRef)

        if(snapshot.exists()){
            return{
                id: snapshot.id,
                ...snapshot.data()
            };
        }

        return null;

    }catch(error){
        console.log("Falha ao buscar a transação: ", error);
    }
}

export async function GetTransactionsDoc(uid:string){
    try{

        const transactionRef = collection(db, "users", uid, "transactions")

        const q = query(
            transactionRef,
            orderBy("createdAt", "desc")
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            type: doc.data().type,
            amount: doc.data().amount,
            description: doc.data().description,
            date: doc.data().date,
            categoryId:doc.data().categoryId,
            categoryName: doc.data().categoryName,
        }));
        
    }catch(error){
        console.log("Falha ao buscar as transações: ", error);
        return [];
    }
}

export async function UpdateTransactionDoc(uid:string, id:string, transactionData: Partial<Transaction>){
    try{
        const transactionRef = doc(db, "users", uid, "transactions", id)

        console.log("Atualizando transação...")

        await updateDoc(transactionRef, transactionData)
            
        console.log("Transação atualizada com sucesso!")

    }catch(error){
        console.log("Falha ao atualizar a transação: ", error);
        throw error;
    }
}

export async function DeleteTransactionDoc(uid:string, transactionId:string){
    try{
        const transactionRef = doc(db, "users", uid, "transactions", transactionId)

        console.log("Deletando transação...")

        console.log(
        "Caminho:",
        `users/${uid}/transactions/${transactionId}`
        );

        await deleteDoc(transactionRef)

        console.log("Transação deletada!")

    }catch(error){
        console.log("Falha ao deletar a transação: ", error);
        throw error;
    }
}