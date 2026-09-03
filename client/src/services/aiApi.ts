import api from "@/api/axios";

interface ChatResponse {
  response: string;
}

export type AiTool = "chat" | "explain" | "generate" | "refactor" | "fix" | "optimize" | "document" | "test" | "rename";
export type AiFileContext = { path: string; content: string };

export async function sendChatMessage(input: { message: string; projectId: string; tool?: AiTool; currentFile?: AiFileContext; openFiles?: AiFileContext[]; selectedCode?: string }): Promise<string> {
  const { data } = await api.post<ChatResponse>("/ai/chat", { ...input, tool: input.tool ?? "chat" });
  return data.response;
}

export async function getConversation(projectId: string): Promise<Array<{ id: string; role: "user" | "assistant"; content: string }>> {
  const { data } = await api.get<{ messages: Array<{ id: string; role: "user" | "assistant"; content: string }> }>(`/ai/${projectId}/conversation`);
  return data.messages;
}
