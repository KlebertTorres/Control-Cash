import { createContext, ReactNode, useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { CreateCategoryDoc, DeleteCategoryDoc, GetCategoriesDoc, UpdateCategoryDoc } from "../services/categoryService";
import { Category, CategoryContextType } from "../types/CategoryType";

export const CategoryContext = createContext<CategoryContextType | undefined>(
    undefined,
);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const loadCategories = useCallback(async () => {
        try{
            setLoadingCategories(true);

            const categoriesData = await GetCategoriesDoc(user.uid);

            setCategories(categoriesData);
        }catch(error){
            console.log(error);
        } finally{
            setLoadingCategories(false);
        }
    }, [user.uid]);

    useEffect(() => {
        if(!user?.uid) {
            setLoadingCategories(false);
            return;
        }

        loadCategories();
    }, [user?.uid, loadCategories]);

    const addCategory = async (categoryData: Omit<Category, "id">) => {
        const newCategory = await CreateCategoryDoc(user.uid, categoryData);
        setCategories((prev) => ([...prev, newCategory]));
    }

    const removeCategory = async (id: string) => {
        await DeleteCategoryDoc(user.uid, id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }

      const updateCategory = async (id:string, categoryData: Partial<Category>) => {
        await  UpdateCategoryDoc(user.uid, id, categoryData);
    
        setCategories(
          (prev) => (prev.map((category) =>
            category.id === id ?
            {
              ...category,
              ...categoryData
            }
            : category
            )
          )
        );
      };

      const getSubCategories = (parentId: string): Category[] => {
        return categories.filter((cat) => cat.parentId === parentId);
      };

      return (
          <CategoryContext.Provider
              value={({
                  categories,
                  loadingCategories,
                  addCategory,
                  removeCategory,
                  updateCategory,
                  getSubCategories,
              })}
          >
              {children}
          </CategoryContext.Provider>
      )
}