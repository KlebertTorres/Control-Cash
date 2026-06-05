import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { Installment } from "../types/InstallmentType";
import { db } from "./firebaseconfig";

const INSTALLMENTS_COLLECTION = "installments";

export async function CreateInstallmentDoc(
  userId: string,
  installmentData: Omit<Installment, "id" | "transactions">
): Promise<Installment> {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/${INSTALLMENTS_COLLECTION}`), {
      ...installmentData,
      transactions: [],
      createdAt: Timestamp.now(),
    });

    return {
      ...installmentData,
      id: docRef.id,
      transactions: [],
    };
  } catch (error) {
    console.error("Erro ao criar parcelamento:", error);
    throw error;
  }
}

export async function GetInstallmentsDoc(userId: string): Promise<Installment[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/${INSTALLMENTS_COLLECTION}`)
    );

    const installments: Installment[] = [];
    querySnapshot.forEach((doc) => {
      installments.push({
        id: doc.id,
        ...doc.data(),
      } as Installment);
    });

    return installments;
  } catch (error) {
    console.error("Erro ao buscar parcelamentos:", error);
    throw error;
  }
}

export async function UpdateInstallmentDoc(
  userId: string,
  installmentId: string,
  updateData: Partial<Installment>
): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}/${INSTALLMENTS_COLLECTION}/${installmentId}`);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao atualizar parcelamento:", error);
    throw error;
  }
}

export async function DeleteInstallmentDoc(userId: string, installmentId: string): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}/${INSTALLMENTS_COLLECTION}/${installmentId}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar parcelamento:", error);
    throw error;
  }
}

export async function GetActiveInstallments(userId: string): Promise<Installment[]> {
  try {
    const q = query(
      collection(db, `users/${userId}/${INSTALLMENTS_COLLECTION}`),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);

    const installments: Installment[] = [];
    querySnapshot.forEach((doc) => {
      installments.push({
        id: doc.id,
        ...doc.data(),
      } as Installment);
    });

    return installments;
  } catch (error) {
    console.error("Erro ao buscar parcelamentos ativos:", error);
    throw error;
  }
}
