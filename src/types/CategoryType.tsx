export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string; // Ícone ou imagem da categoria
  parentId?: string; // ID da categoria pai (para subcategorias)
  type?: "income" | "expense" | "custom"; // Tipo de movimentação
  isDefault?: boolean; // Se é uma categoria padrão
}

export interface SubCategory extends Omit<Category, 'parentId'> {
  parentId: string; // ID obrigatório da categoria pai
}

export interface CategoryContextType {
  categories: Category[];
  loadingCategories: boolean;
  addCategory: (category: Omit<Category, "id">) => void;
  removeCategory: (id:string) => void;
  updateCategory: (id:string, category: Partial<Category>) => void;
  getSubCategories: (parentId: string) => Category[];
}