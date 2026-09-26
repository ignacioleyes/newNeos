import { useParams, Navigate } from "react-router-dom";
import {
  useContentQuery,
  useProject,
  useProjectSections,
} from "../hooks/useContent";
import { ProjectTemplate } from "../components/project/ProjectTemplate";
import { ProjectComingSoon } from "./ProjectComingSoon";

/**
 * Página de detalle de un proyecto.
 *
 * Antes esto despachaba por slug a páginas escritas a mano (ProjectChaquies,
 * ProjectNeweken), y cualquier proyecto nuevo caía sí o sí en "próximamente".
 * Ahora la página se arma con las secciones que el proyecto tenga cargadas: un
 * proyecto nuevo puede tener una página completa sin tocar código.
 */
export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isPending } = useContentQuery();
  const project = useProject(slug);
  const sections = useProjectSections(slug);

  // Con el snapshot como placeholder casi nunca se entra acá, pero un deep link
  // a un proyecto creado después del último `yarn snapshot` sí puede caer: hay
  // que esperar la respuesta antes de decidir que no existe.
  if (!project) {
    if (isPending) return null;
    return <Navigate to="/" replace />;
  }

  // Sin secciones cargadas todavía no hay página que mostrar.
  if (sections.length === 0) return <ProjectComingSoon project={project} />;

  return <ProjectTemplate project={project} sections={sections} />;
}
