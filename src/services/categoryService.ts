import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { Category } from "../types/CategoryType";
import { db } from "./firebaseconfig";

export async function CreateCategoryDoc(uid: string, categoryData: Omit<Category, "id">){
    try{

        console.log("Criando categoria...")
        console.log("uid:", uid);
        console.log("categoryRef path:", "users", uid, "categories");
        console.log("categoryData:", categoryData);

        const categoryRef = collection(db, "users", uid, "categories");

        const docRef = 
            await addDoc(
                categoryRef,
                {
                    ...categoryData,
                    createdAt: serverTimestamp()
                }
            )

        console.log("Categoria criada com sucesso!")

        console.log("categoryData:", categoryData, "docRef.id:", docRef.id);

        return {id: docRef.id, ...categoryData}

    }catch(error){
        console.log("Erro ao criar categoria: ", error);
        throw error
    }
}

export async function GetCategoryDoc(uid: string, categoryId:string){
    try{
        console.log("Buscando categoria...")

        const categoryRef = doc(db, "users", uid, "categories", categoryId);

        const snapshot = await getDoc(categoryRef);

        if(snapshot.exists()){
            return {
                id: snapshot.id,
                ...snapshot.data()
            }
        };

        return null;

    }catch(error){
        console.log("Erro ao buscar categoria: ", error);
    }
}

export async function GetCategoriesDoc(uid: string){
    try{
        console.log("Buscando categorias...")

        const categoriesRef = collection(db, "users", uid, "categories")

        const q = query(
            categoriesRef,
            orderBy("name", "asc")
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
        }));
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }catch(_){
        console.log("Erro ao buscar categorias");
        return [];
    }
}

export async function UpdateCategoryDoc(uid:string, categoryId: string, categoryData: Partial<Category>){
    try{
        console.log("Atualizando Categoria...")

        const categoryRef = doc(db, "users", uid, "categories", categoryId);

        await updateDoc(categoryRef, categoryData);

        console.log("Categoria atualizada com sucesso! ")


    }catch(error){
        console.log("Erro ao atualizar categoria: ", error);
        throw error;
    }
}

export async function DeleteCategoryDoc(uid:string, categoryId: string){
    try{
        console.log("Deletando categoria...");

        const categoryRef = doc(db, "users", uid, "categories", categoryId)

        console.log(
        "Caminho:",
        `users/${uid}/categories/${categoryId}`
        );

        await deleteDoc(categoryRef)

        console.log("Categoria deletada com sucesso!")

    }catch(error){
        console.log("Erro ao deletar categoria: ", error);
        throw error;
    }
}