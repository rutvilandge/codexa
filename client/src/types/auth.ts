export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}