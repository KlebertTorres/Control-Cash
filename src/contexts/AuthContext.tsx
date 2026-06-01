import { onAuthStateChanged } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebaseconfig";
import { GetUserDoc } from "../services/userService";
  
export const AuthContext = createContext({} as any);

export function AuthProvider({children,}: { children: ReactNode; }) {
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(  
        auth,
        async (firebaseUser) => {

          console.log("onAuthStateChanged:", firebaseUser?.uid);

          if (!firebaseUser) {
            setUser(null);
            setLoading(false);
            return;
          }

          try {
            const userData = await GetUserDoc(
                  firebaseUser.uid
                );

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData?.name,
              theme: userData?.theme,
              monthlyLimit: userData?.monthlyLimit,
              tutorialComplete: userData?.tutorialComplete,
            });

          } catch (error) {
            console.log(error);
          }

          setLoading(false);
        }
      );

    return unsubscribe;

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}