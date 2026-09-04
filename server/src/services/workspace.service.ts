import { prisma } from "../lib/prisma";
import { buildFileTree } from "../utils/fileTree";
import { getAccessibleWorkspace } from "./project-access.service";

function normalizeWorkspacePath(filePath: string) {
  const normalized = filePath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");

  if (
    !normalized ||
    normalized === "." ||
    normalized.split("/").some((part) => part === "..")
  ) {
    throw new Error("Invalid workspace path");
  }

  return normalized;
}

async function getProjectAccess(
  projectId: string,
  userId: string,
  requireEdit = false
) {
  return getAccessibleWorkspace(
    projectId,
    userId,
    requireEdit
  );
}

export async function getWorkspaceTree(
  projectId: string,
  ownerId: string
) {
  await getProjectAccess(projectId, ownerId);

  return buildFileTree(projectId);
}

export async function getFile(
  projectId: string,
  ownerId: string,
  filePath: string
) {
  await getProjectAccess(projectId, ownerId);

  const normalizedPath = normalizeWorkspacePath(filePath);

  const parts = normalizedPath.split("/");
  const fileName = parts[parts.length - 1];
  const folderParts = parts.slice(0, -1);

  let folderId: string | null = null;

  if (folderParts.length > 0) {
    let parentId: string | null = null;

    for (const folderName of folderParts) {
      const folder: { id: string } | null =
        await prisma.folder.findFirst({
          where: {
            projectId,
            name: folderName,
            parentId,
          },
          select: {
            id: true,
          },
        });

      if (!folder) {
        throw new Error("File not found");
      }

      parentId = folder.id;
    }

    folderId = parentId;
  }

  const file = await prisma.file.findFirst({
    where: {
      projectId,
      name: fileName,
      folderId,
    },
    select: {
      content: true,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  return file.content;
}

export async function saveFile(
  projectId: string,
  ownerId: string,
  filePath: string,
  content: string
) {
  await getProjectAccess(projectId, ownerId, true);

  const normalizedPath = normalizeWorkspacePath(filePath);

  const parts = normalizedPath.split("/");
  const fileName = parts[parts.length - 1];
  const folderParts = parts.slice(0, -1);

  let folderId: string | null = null;

  if (folderParts.length > 0) {
    let parentId: string | null = null;

    for (const folderName of folderParts) {
      const folder: { id: string } | null =
        await prisma.folder.findFirst({
          where: {
            projectId,
            name: folderName,
            parentId,
          },
          select: {
            id: true,
          },
        });

      if (!folder) {
        throw new Error(`Folder not found: ${folderName}`);
      }

      parentId = folder.id;
    }

    folderId = parentId;
  }

  const extension = fileName.includes(".")
    ? fileName.split(".").pop() || ""
    : "";

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    html: "html",
    css: "css",
    scss: "scss",
    md: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    sql: "sql",
  };

  const language =
    languageMap[extension.toLowerCase()] ||
    extension ||
    "plaintext";

  const existingFile = await prisma.file.findFirst({
    where: {
      projectId,
      name: fileName,
      folderId,
    },
    select: {
      id: true,
    },
  });

  if (existingFile) {
    await prisma.file.update({
      where: {
        id: existingFile.id,
      },
      data: {
        content,
        extension,
        language,
      },
    });

    return;
  }

  await prisma.file.create({
    data: {
      name: fileName,
      extension,
      language,
      content,
      projectId,
      folderId,
    },
  });
}

export async function createFolder(
  projectId: string,
  ownerId: string,
  folderPath: string
) {
  await getProjectAccess(projectId, ownerId, true);

  const normalizedPath = normalizeWorkspacePath(folderPath);

  const parts = normalizedPath.split("/");

  let parentId: string | null = null;

  for (const folderName of parts) {
    const existingFolder: { id: string } | null =
      await prisma.folder.findFirst({
        where: {
          projectId,
          name: folderName,
          parentId,
        },
        select: {
          id: true,
        },
      });

    if (existingFolder) {
      parentId = existingFolder.id;
      continue;
    }

    const folder: { id: string } =
  await prisma.folder.create({
      data: {
        name: folderName,
        projectId,
        parentId,
      },
      select: {
        id: true,
      },
    });

    parentId = folder.id;
  }
}

export async function deleteWorkspacePath(
  projectId: string,
  ownerId: string,
  workspacePath: string
) {
  await getProjectAccess(projectId, ownerId, true);

  const normalizedPath = normalizeWorkspacePath(
    workspacePath
  );

  const parts = normalizedPath.split("/");
  const targetName = parts[parts.length - 1];
  const parentParts = parts.slice(0, -1);

  let parentId: string | null = null;

  for (const folderName of parentParts) {
    const folder: { id: string } | null =
      await prisma.folder.findFirst({
        where: {
          projectId,
          name: folderName,
          parentId,
        },
        select: {
          id: true,
        },
      });

    if (!folder) {
      throw new Error("Path not found");
    }

    parentId = folder.id;
  }

  const file = await prisma.file.findFirst({
    where: {
      projectId,
      name: targetName,
      folderId: parentId,
    },
    select: {
      id: true,
    },
  });

  if (file) {
    await prisma.file.delete({
      where: {
        id: file.id,
      },
    });

    return;
  }

  const folder: { id: string } | null =
    await prisma.folder.findFirst({
      where: {
        projectId,
        name: targetName,
        parentId,
      },
      select: {
        id: true,
      },
    });

  if (!folder) {
    throw new Error("Path not found");
  }

  await prisma.folder.delete({
    where: {
      id: folder.id,
    },
  });
}

export async function searchWorkspace(
  projectId: string,
  userId: string,
  query: string
) {
  await getProjectAccess(projectId, userId);

  const files = await prisma.file.findMany({
    where: {
      projectId,
      content: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      name: true,
      content: true,
      folderId: true,
    },
    take: 100,
  });

  const folderCache = new Map<string, string>();

  async function getFolderPath(
    folderId: string | null
  ): Promise<string> {
    if (!folderId) {
      return "";
    }

    const cached = folderCache.get(folderId);

    if (cached !== undefined) {
      return cached;
    }

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        parentId: true,
      },
    });

    if (!folder) {
      return "";
    }

    const parentPath = await getFolderPath(
      folder.parentId
    );

    const folderPath = parentPath
      ? `${parentPath}/${folder.name}`
      : folder.name;

    folderCache.set(folderId, folderPath);

    return folderPath;
  }

  const matches: Array<{
    path: string;
    line: number;
    preview: string;
  }> = [];

  for (const file of files) {
    if (matches.length >= 100) {
      break;
    }

    const folderPath = await getFolderPath(
      file.folderId
    );

    const filePath = folderPath
      ? `${folderPath}/${file.name}`
      : file.name;

    file.content.split("\n").forEach(
      (line, index) => {
        if (matches.length >= 100) {
          return;
        }

        if (
          line
            .toLowerCase()
            .includes(query.toLowerCase())
        ) {
          matches.push({
            path: filePath,
            line: index + 1,
            preview: line.trim().slice(0, 200),
          });
        }
      }
    );
  }

  return matches;
}