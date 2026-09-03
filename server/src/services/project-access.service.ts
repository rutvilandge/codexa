import { prisma } from "../lib/prisma";

export type ProjectPermission = "viewer" | "editor" | "owner";

export async function getProjectPermission(projectId: string, userId: string): Promise<ProjectPermission | null> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
    select: { ownerId: true, members: { where: { userId }, select: { role: true } } },
  });
  if (!project) return null;
  if (project.ownerId === userId) return "owner";
  return project.members[0]?.role === "EDITOR" ? "editor" : "viewer";
}

export async function requireProjectAccess(projectId: string, userId: string, editable = false) {
  const permission = await getProjectPermission(projectId, userId);
  if (!permission || (editable && permission === "viewer")) throw new Error("Project access denied");
  return permission;
}

export async function getAccessibleWorkspace(projectId: string, userId: string, editable = false) {
  await requireProjectAccess(projectId, userId, editable);
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { workspacePath: true } });
  if (!project) throw new Error("Project not found");
  return project.workspacePath;
}
