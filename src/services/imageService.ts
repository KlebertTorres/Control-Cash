import * as ImagePicker from "expo-image-picker";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebaseconfig";

export type ImageType = "profile" | "category" | "proof";

export async function PickImage(type: ImageType): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "proof" ? [4, 3] : [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("Erro ao selecionar imagem:", error);
    throw error;
  }
}

export async function UploadImage(
  userId: string,
  imageUri: string,
  type: ImageType,
  fileName: string
): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `users/${userId}/${type}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  } catch (error) {
    console.error("Erro ao fazer upload de imagem:", error);
    throw error;
  }
}

export async function DeleteImage(userId: string, type: ImageType, fileName: string): Promise<void> {
  try {
    const storageRef = ref(storage, `users/${userId}/${type}/${fileName}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    throw error;
  }
}

export async function GetImageUrl(
  userId: string,
  type: ImageType,
  fileName: string
): Promise<string> {
  try {
    const storageRef = ref(storage, `users/${userId}/${type}/${fileName}`);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Erro ao obter URL da imagem:", error);
    throw error;
  }
}

export async function RequestImagePermissions(): Promise<boolean> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return permission.status === "granted";
  } catch (error) {
    console.error("Erro ao solicitar permissão de mídia:", error);
    return false;
  }
}
