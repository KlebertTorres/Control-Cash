export interface UserData {
  uid: string;
  name: string;
  email: string;
  profilePhoto?: string; // URL da foto de perfil
  darkTheme?: boolean;
  tutorialComplete?: boolean;
  monthlyLimit?: number;
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}