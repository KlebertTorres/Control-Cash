import { createContext, useState } from "react";

export const AuthContext = createContext({} as any);

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}