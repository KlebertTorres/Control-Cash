import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig"

export async function Login(email:string, senha:string){
    return await signInWithEmailAndPassword(auth, email, senha);
}