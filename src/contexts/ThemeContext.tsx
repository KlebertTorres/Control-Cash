import { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { UpdateUserDoc, GetUserDoc } from "../services/userService";

export const ThemeContext = createContext({} as any);

export function ThemeProvider({ children }: any){

    const { user, setUser } = useAuth();

    const darkMode = user?.darkTheme ?? false;

    const [loading, setLoading] = useState(false);
    const [userDarkMode, setuserDarkMode] = useState(false);

    useEffect(() => {
        async function loadTheme() {
            if (!user?.uid) {
                setuserDarkMode(false);
                return;
            }

            setLoading(true);

            try {
                const userData = await GetUserDoc(user.uid);

                setuserDarkMode(userData?.darkTheme ?? false);

            } catch (error) {
                console.error("Erro ao carregar tema:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTheme();
    }, [user?.uid]);

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