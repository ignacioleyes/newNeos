import { useParams, Navigate } from "react-router-dom";
import { useContentQuery, useProject } from "../hooks/useContent";
import { ProjectNeweken } from "./ProjectNeweken";
import { ProjectChaquies } from "./ProjectChaquies";
import { ProjectComingSoon } from "./ProjectComingSoon";

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isPending } = useContentQuery();
  const project = useProject(slug);

  // Con el snapshot como placeholder casi nunca se entra acá, pero un deep link
  // a un proyecto creado después del último `yarn snapshot` sí puede caer: en
  // ese caso hay que esperar la respuesta antes de decidir que no existe, o lo
  // mandaríamos al home por error.
  if (!project) {
    if (isPending) return null;
    return <Navigate to="/" replace />;
  }

  if (slug === "neweken") return <ProjectNeweken />;
  if (slug === "chaquies") return <ProjectChaquies />;

  return <ProjectComingSoon project={project} />;
}
