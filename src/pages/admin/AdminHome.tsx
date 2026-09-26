import { useAuth } from "../../auth/AuthContext";
import { useProjects } from "../../hooks/useContent";

/**
 * Home del panel. Por ahora sólo confirma el acceso y muestra el estado del
 * contenido: el ABM de proyectos llega en la parte siguiente.
 */
export function AdminHome() {
  const { employee } = useAuth();
  const projects = useProjects();

  const published = projects.length;
  const featured = projects.find((p) => p.isFeatured);

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">
        Hola{employee?.name ? `, ${employee.name.split(" ")[0]}` : ""}.
      </h1>
      <p className="opacity-60 mb-10">
        Desde acá vas a administrar el contenido de la landing.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
        <div className="rounded-2xl border border-base-300/60 bg-base-200 p-6">
          <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
            Proyectos publicados
          </p>
          <p className="font-display text-3xl font-semibold">{published}</p>
        </div>
        <div className="rounded-2xl border border-base-300/60 bg-base-200 p-6">
          <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
            Destacado
          </p>
          <p className="font-display text-xl font-semibold leading-tight">
            {featured?.name ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-base-300/60 bg-base-200 p-6">
          <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
            Tu rol
          </p>
          <p className="font-display text-xl font-semibold capitalize">
            {employee?.role ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-base-300 p-6 max-w-3xl">
        <p className="text-sm opacity-60 leading-relaxed">
          Próximamente: edición de proyectos, orden de la grilla, mapa para las
          coordenadas y el editor de secciones de las páginas de detalle.
        </p>
      </div>
    </>
  );
}
