import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

/**
 * El contexto vive separado del provider y del hook, por la misma razón que en
 * i18n: un archivo que exporta un componente no debería exportar además
 * funciones, o Fast Refresh recarga el módulo entero y se pierde el estado.
 */
export interface Employee {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor";
  isActive: boolean;
}

export interface AuthState {
  /** true mientras no sabemos todavía si hay sesión. */
  loading: boolean;
  session: Session | null;
  employee: Employee | null;
  signIn(email: string, password: string): Promise<{ error: string | null }>;
  signOut(): Promise<void>;
}

export const AuthCtx = createContext<AuthState | null>(null);
