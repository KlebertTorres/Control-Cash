import {
  createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut
} from "firebase/auth";
import { auth } from "./firebaseconfig";
import { CreateUserDoc, DeleteUserDoc, GetUserDoc } from "./userService";

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

export async function DeletarConta(){
  const user = auth.currentUser;

  if(!user) return;

  try{
    Logout()
    //Apaga do firestore
    await DeleteUserDoc(user.uid);

    //Apaga do authenticator
    await deleteUser(user)

  }catch(error){
    console.error("Erro ao deletar:", error);
  }
}