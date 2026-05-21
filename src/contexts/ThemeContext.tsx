import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({} as any);

export function ThemeProvider({ children }: any){

    const [darkMode, setdarkMode] = useState(true);

    async function carregarTema(){

        const temaSalvo = 
            await AsyncStorage.getItem("@theme");

        if(temaSalvo !== null){
            setdarkMode(JSON.parse(temaSalvo))
        }
    }

    useEffect(() => {
        carregarTema();
    }, []);

    async function toggleTheme() {
        
        const novoTema = !darkMode;

        setdarkMode(novoTema);

        await AsyncStorage.setItem(
            "@theme",
            JSON.stringify(novoTema)
        );
    }

    return(
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )

}