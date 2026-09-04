import groq from "../lib/groq";
import { prisma } from "../lib/prisma";
import { getWorkspaceTree } from "./workspace.service";
import type { WorkspaceNode } from "../types/workspace.types";
import { requireProjectAccess } from "./project-access.service";

const MODEL = "openai/gpt-oss-20b";

const SYSTEM_PROMPT = `You are Codexa, an expert software engineer working in a project-scoped cloud IDE. Explain code, debug issues, generate production-ready code, and keep responses concise. Never claim you changed files yourself. When the user asks to create or modify files, finish your answer with one fenced \`\`\`codexa-edits block containing JSON: {"summary":"short summary","files":[{"path":"relative/path.ext","content":"complete desired file content"}]}. Include only files that should change, use paths relative to the project root, and never include node_modules, .git, absolute paths, or paths containing .. .`;

export type AiTool =
  | "chat"
  | "explain"
  | "generate"
  | "refactor"
  | "fix"
  | "optimize"
  | "document"
  | "test"
  | "rename";

type FileContext = {
  path: string;
  content: string;
};

function flattenTree(
  nodes: WorkspaceNode[],
  result: string[] = []
): string[] {
  for (const node of nodes) {
    if (result.length >= 200) return result;

    result.push(
      `${node.type === "folder" ? "dir" : "file"}: ${node.path}`
    );

    if (node.children) {
      flattenTree(node.children, result);
    }
  }

  return result;
}

export async function getProjectAiResponse(input: {
  projectId: string;
  ownerId: string;
  message: string;
  tool: AiTool;
  currentFile?: FileContext;
  openFiles?: FileContext[];
  selectedCode?: string;
}) {
  await requireProjectAccess(
    input.projectId,
    input.ownerId
  );

  const project = await prisma.project.findUnique({
    where: {
      id: input.projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      id: `${input.projectId}-default`,
    },
    update: {},
    create: {
      id: `${input.projectId}-default`,
      projectId: input.projectId,
    },
  });

  const history = await prisma.aiMessage.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });

  const projectTree = flattenTree(
    await getWorkspaceTree(
      input.projectId,
      input.ownerId
    )
  );

  const openFiles = (input.openFiles ?? [])
    .slice(0, 6)
    .map(
      (file) =>
        `Open file: ${file.path}\n${file.content.slice(
          0,
          12_000
        )}`
    )
    .join("\n\n");

  const context = [
    `Tool: ${input.tool}. Project: ${project.name}.`,
    `Project structure:\n${projectTree.join("\n")}`,
    input.currentFile
      ? `Current file: ${input.currentFile.path}\n${input.currentFile.content.slice(
          0,
          20_000
        )}`
      : "",
    openFiles,
    input.selectedCode
      ? `Selected code:\n${input.selectedCode.slice(
          0,
          12_000
        )}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const completion =
    await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${context}`,
        },

        ...history.map(
          (item: (typeof history)[number]) => ({
            role:
              item.role === "assistant"
                ? ("assistant" as const)
                : ("user" as const),
            content: item.content,
          })
        ),

        {
          role: "user",
          content: input.message,
        },
      ],
    });

  const response =
    completion.choices[0]?.message.content?.trim();

  if (!response) {
    throw new Error(
      "The AI service returned an empty response"
    );
  }

  await prisma.$transaction([
    prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: input.message,
      },
    }),

    prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: response,
      },
    }),
  ]);

  return response;
}

export async function getProjectConversation(
  projectId: string,
  ownerId: string
) {
  await requireProjectAccess(
    projectId,
    ownerId
  );

  const conversation =
    await prisma.conversation.findUnique({
      where: {
        id: `${projectId}-default`,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 100,
        },
      },
    });

  return conversation?.messages ?? [];
}