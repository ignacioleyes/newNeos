import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { NeosLogo } from "../../components/ui/NeosLogo";

/**
 * Layout del panel + guardia de acceso.
 *
 * Importante: esto es UX, no seguridad. Lo que realmente impide escribir es la
 * RLS del lado de Supabase (`is_employee()`). Si alguien saltea este
 * componente, igual no puede tocar nada: las policies rechazan la escritura.
 * Acá sólo evitamos mostrar una pantalla rota.
 */
export function AdminLayout() {
  const { loading, session, employee, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-base-100">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  // Sesión válida pero sin permiso: pasa si alguien se registró por su cuenta,
  // o si le dieron de baja. Hay que decirlo, no mostrar un panel vacío.
  if (!employee) {
    return (
      <div className="min-h-screen grid place-items-center bg-base-100 px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold mb-3">
            Tu cuenta no tiene acceso al panel
          </h1>
          <p className="opacity-70 leading-relaxed mb-8">
            Entraste con <span className="text-primary">{session.user.email}</span>,
            pero esa cuenta no está habilitada. Pedile a un administrador de NEOS
            que te dé de alta.
          </p>
          <button onClick={signOut} className="btn btn-ghost rounded-full border border-base-content/20">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="border-b border-base-300/60 bg-base-200">
        <div className="container mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-3">
              <NeosLogo className="h-5" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary">
                Panel
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link to="/admin/proyectos" className="opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                Proyectos
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="opacity-60 hover:opacity-100 hover:text-primary transition-colors">
              Ver la landing ↗
            </Link>
            <span className="hidden sm:inline opacity-50">
              {employee.name ?? employee.email}
              {employee.role === "admin" && (
                <span className="ml-2 rounded-full border border-primary/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                  admin
                </span>
              )}
            </span>
            <button
              onClick={signOut}
              className="btn btn-ghost btn-sm rounded-full border border-base-content/20 hover:border-primary hover:text-primary"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
}
