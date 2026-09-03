import api from "@/api/axios";

export async function getWorkspaceTree(projectId: string) {
  const res = await api.get(`/workspace/${projectId}/tree`);
  return res.data;
}

export async function openWorkspaceFile(projectId: string, path: string) {
  const res = await api.get(`/workspace/${projectId}/file`, {
    params: { path },
  });

  return res.data.content;
}

export async function saveWorkspaceFile(projectId: string,
  path: string,
  content: string
) {
  await api.post(`/workspace/${projectId}/file`, {
    path,
    content,
  });
}

export async function createWorkspaceFolder(projectId: string, path: string) {
  await api.post(`/workspace/${projectId}/folder`, { path });
}

export async function deleteWorkspacePath(projectId: string, path: string) {
  await api.delete(`/workspace/${projectId}/path`, { data: { path } });
}

export async function searchWorkspace(projectId: string, query: string) {
  const { data } = await api.get<{ matches: Array<{ path: string; line: number; preview: string }> }>(`/workspace/${projectId}/search`, { params: { q: query } });
  return data.matches;
}
