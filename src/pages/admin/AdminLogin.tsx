import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { NeosLogo } from "../../components/ui/NeosLogo";
import { TopoPattern } from "../../components/ui/TopoPattern";

/**
 * Login del panel.
 *
 * No hay registro ni "olvidé mi contraseña" a propósito: las cuentas las crea
 * un admin desde el panel (o desde el dashboard de Supabase). Una landing
 * pública con formulario de registro abierto sería una puerta al contenido.
 */
export function AdminLogin() {
  const { session, employee, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (session && employee) {
    const from = (location.state as { from?: string } | null)?.from ?? "/admin";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      // El mensaje de Supabase es genérico a propósito (no distingue "usuario
      // inexistente" de "contraseña incorrecta") para no filtrar qué emails
      // existen. Lo dejamos así.
      setError(error);
      setSubmitting(false);
    }
    // Si salió bien, onAuthStateChange redirige solo.
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-base-100 overflow-hidden">
      <TopoPattern
        className="absolute inset-0 w-full h-full text-primary"
        opacity={0.12}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <NeosLogo className="h-8" />
        </div>

        <div className="rounded-2xl border border-base-300/60 bg-base-200 p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight mb-1">
            Panel de administración
          </h1>
          <p className="text-sm opacity-60 mb-8">
            Acceso exclusivo para el equipo de NEOS.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] uppercase tracking-widest text-primary mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] uppercase tracking-widest text-primary mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-error leading-snug">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full rounded-full"
            >
              {submitting ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs opacity-50">
          ¿Problemas para entrar? Escribile a quien administre el panel.
        </p>
      </div>
    </div>
  );
}
