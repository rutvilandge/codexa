import api from "@/api/axios";

export type Collaborator = { id: string; role: "VIEWER" | "EDITOR"; user: { id: string; name: string; email: string } };

export async function getCollaborators(projectId: string) { const { data } = await api.get<{ owner: Collaborator["user"]; members: Collaborator[] }>(`/projects/${projectId}/members`); return data; }
export async function inviteCollaborator(projectId: string, email: string, role: "VIEWER" | "EDITOR") { await api.post(`/projects/${projectId}/members`, { email, role }); }
export async function removeCollaborator(projectId: string, memberId: string) { await api.delete(`/projects/${projectId}/members/${memberId}`); }
