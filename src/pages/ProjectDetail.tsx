import { useParams, Navigate } from "react-router-dom";
import { projects } from "../data/projects";
import { ProjectNeweken } from "./ProjectNeweken";
import { ProjectComingSoon } from "./ProjectComingSoon";

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/" replace />;

  if (slug === "neweken") return <ProjectNeweken />;

  return <ProjectComingSoon project={project} />;
}
