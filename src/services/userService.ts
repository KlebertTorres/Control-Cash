import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { UserData } from "../types/UserType";
import { db } from "./firebaseconfig";

export async function CreateUserDoc(user: UserData) {
  try {
    console.log("Criando documento...");

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.name,
      email: user.email,
      darkTheme: false,
      tutorialComplete: false,
      monthlyLimit: 0,
      createdAt: serverTimestamp(),
    });

    console.log("Documento criado!");

  } catch (error) {
    console.log("ERRO FIRESTORE:", error);
    throw error;
  }
}

export async function GetUserDoc(uid: string) {
  try {

    const docRef = doc(db, "users", uid);

    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;

  } catch (error) {
    console.log("Erro ao buscar usuário:", error);
    throw error;
  }
}

export async function UpdateUserDoc(uid: string, user: Partial<UserData>){
  try{
    console.log("Atualizando usuário...")

    await updateDoc(
      doc(db, "users", uid), user
    )
    console.log("Usuário Atualizado!")

  }catch(error){
    console.log("Erro ao atualizar usuário:", error);
    throw error;
  }
}

export async function DeleteUserDoc(uid:string){
   try{
    console.log("Deletando usuário....")
    await deleteDoc(doc(db, "users", uid))

    console.log("Usuário deletado!")

   }catch(error){
    console.log("Erro ao deletar usuário: ", error);
    throw error;
   }
}