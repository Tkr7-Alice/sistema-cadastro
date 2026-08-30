const TOKEN_KEY = "auth_token";
const ADMIN_KEY = "auth_admin";

export type AdminData = {
  id: number;
  nome: string;
  email: string;
};

export function saveAuth(token: string, admin: AdminData): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdmin(): AdminData | null {
  const data = localStorage.getItem(ADMIN_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as AdminData;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}
