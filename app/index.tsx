import { Redirect } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from "../src/services/firebaseconfig";
import { useOnBoarding } from '@/src/hooks/useOnBoarding';

export default function Index() {
  const { hasCompletedOnboarding } = useOnBoarding();
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

  // Se 'user' for null (usuário não logado), redireciona para o login
  if (!user){
    return <Redirect href="./auth/login" />
  }

  // Se 'hasCompletedOnboarding' for null (tutorial feito), redireciona para o onboarding
  if(!hasCompletedOnboarding){
    return <Redirect href="./onboarding" />;
    }

  // tudo certo, redireciona para home
  return <Redirect href="./(tabs)/home" />;
}