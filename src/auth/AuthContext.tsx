import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/**
 * Sesión del panel.
 *
 * Hay dos condiciones distintas y conviene no confundirlas:
 *
 *   `session`  — la persona está logueada en Supabase Auth.
 *   `employee` — además figura en la tabla `employees` y está activa.
 *
 * Sólo la segunda habilita a escribir: la RLS exige `is_employee()`, no
 * simplemente estar autenticado. Alguien podría tener sesión válida y ningún
 * permiso, y el panel tiene que decirlo claro en vez de romperse.
 */

export interface Employee {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor";
  isActive: boolean;
}

interface AuthState {
  /** true mientras no sabemos todavía si hay sesión. */
  loading: boolean;
  session: Session | null;
  employee: Employee | null;
  signIn(email: string, password: string): Promise<{ error: string | null }>;
  signOut(): Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);

async function fetchEmployee(userId: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from("employees")
    .select("id, email, name, role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    isActive: data.is_active,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(next: Session | null) {
      if (cancelled) return;
      setSession(next);
      setEmployee(next ? await fetchEmployee(next.user.id) : null);
      if (!cancelled) setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => load(data.session));

    // Cubre login, logout, refresh del token y sesión cerrada en otra pestaña.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      void load(next);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      employee,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
    }),
    [loading, session, employee]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth tiene que usarse dentro de <AuthProvider>");
  return ctx;
}
