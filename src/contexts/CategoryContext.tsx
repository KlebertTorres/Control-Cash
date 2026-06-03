import { createContext, ReactNode, useEffect, useState } from "react";
import { Category, CategoryContextType } from "../types/CategoryType";
import { useAuth } from "../hooks/useAuth";
import { CreateCategoryDoc, DeleteCategoryDoc, GetCategoriesDoc } from "../services/categoryService";

export const CategoryContext = createContext<CategoryContextType | undefined>(
    undefined,
);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const loadCategories = async () => {
        try{
            setLoadingCategories(true);

            const categoriesData = await GetCategoriesDoc(user.uid);

            setCategories(categoriesData);
        }catch(error){
            console.log(error);
        } finally{
            setLoadingCategories(false);
        }
    }

    useEffect(() => {
        if(!user?.uid) {
            setLoadingCategories(false);
            return;
        }

        loadCategories();
    }, [user?.uid]);

    const addCategory = async (categoryData: Omit<Category, "id">) => {
        const newCategory = await CreateCategoryDoc(user.uid, categoryData);
        setCategories((prev) => ([...prev, newCategory]));
    }

    const removeCategory = async (id: string) => {
        await DeleteCategoryDoc(user.uid, id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }

    return (
        <CategoryContext.Provider
            value={({
                categories,
                loadingCategories,
                addCategory,
                removeCategory
            })}
        >
            {children}
        </CategoryContext.Provider>
    )
}