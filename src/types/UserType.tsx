export interface UserData {
  uid: string;
  name: string;
  email: string;

  theme?: boolean;
  tutorialComplete?: boolean;
  monthlyLimit?: number;
}