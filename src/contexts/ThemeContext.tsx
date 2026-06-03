import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { UpdateUserDoc } from "../services/userService";

export const ThemeContext = createContext({} as any);

export function ThemeProvider({ children }: any){

    const { user, setUser } = useAuth();

    const darkMode = user?.darkTheme ?? false;

    async function toggleTheme() {

        if (!user) return;
        
        const novoTema = !darkMode;

        await UpdateUserDoc(user.uid, {darkTheme: novoTema});

        setUser({
            ...user,
            darkTheme: novoTema,
        });

        console.log("Novo tema: ", novoTema);
    }

    return(
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}