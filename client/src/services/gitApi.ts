import api from "@/api/axios";

export type GitSummary = { initialized: boolean; branch: string | null; status: string[]; history: string[]; branches: string[] };

export async function getGitSummary(projectId: string): Promise<GitSummary> {
  const { data } = await api.get<GitSummary>(`/git/${projectId}`);
  return data;
}

export async function initializeGit(projectId: string) { await api.post(`/git/${projectId}/init`); }
export async function gitAction(projectId: string, action: "commit" | "createBranch" | "switchBranch" | "merge" | "pull" | "push", payload: { branch?: string; message?: string } = {}) {
  await api.post(`/git/${projectId}/action`, { action, ...payload });
}

export async function getGitDiff(projectId: string, path: string) { const { data } = await api.get<{ diff: string }>(`/git/${projectId}/diff`, { params: { path } }); return data.diff; }
export async function getGitHistory(projectId: string, path: string) { const { data } = await api.get<{ history: Array<{ hash: string; shortHash: string; author: string; date: string; subject: string }> }>(`/git/${projectId}/history`, { params: { path } }); return data.history; }
