import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseconfig"

export async function Registrar(email:string, senha:string){
    return await createUserWithEmailAndPassword(auth, email, senha)
}

export async function Login(email:string, senha:string){
    return await signInWithEmailAndPassword(auth, email, senha);
}

export async function Logout(){
    return await signOut(auth);
}