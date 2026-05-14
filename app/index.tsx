import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from "../firebaseconfig"

export default function Index() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined significa "ainda verificando"

  useEffect(() => {
    // onAuthStateChanged retorna uma função para "desinscrever" o listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    })

    return () => unsubscribe();
  }, []); // O array vazio garante que o useEffect rode apenas uma vez

  if(user === undefined){
    // Você pode renderizar um splash screen ou um indicador de carregamento aqui
    return null;
  };

  // Se 'user' não for null (usuário logado), redireciona para a home
  if (user){
    return <Redirect href="./(tabs)/home" />;
  }

  // Se 'user' for null (usuário não logado), redireciona para o login
  return <Redirect href="./auth/login" />
}