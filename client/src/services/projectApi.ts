import api from "@/api/axios";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<{ projects: Project[] }>("/projects");
  return data.projects;
}

export async function createProject(payload: { name: string; description?: string; template?: "basic" | "react" }): Promise<Project> {
  const { data } = await api.post<{ project: Project }>("/projects", payload);
  return data.project;
}

export async function updateProject(
  id: string,
  payload: { name?: string; description?: string }
): Promise<Project> {
  const { data } = await api.patch<{ project: Project }>(`/projects/${id}`, payload);
  return data.project;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
