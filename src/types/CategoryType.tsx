export interface Category {
  id?: string;
  name: string;
  color: string;
}

export interface CategoryContextType {
  categories: Category[];
  loadingCategories: boolean;
  addCategory: (category: Omit<Category, "id">) => void;
  removeCategory: (id:string) => void;
}