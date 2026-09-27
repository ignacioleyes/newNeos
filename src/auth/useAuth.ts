import { useContext } from "react";
import { AuthCtx, type AuthState } from "./authState";

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth tiene que usarse dentro de <AuthProvider>");
  return ctx;
}
