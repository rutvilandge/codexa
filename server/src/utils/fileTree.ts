import { prisma } from "../lib/prisma";
import { WorkspaceNode } from "../types/workspace.types";

type FolderRecord = {
  id: string;
  name: string;
  parentId: string | null;
};

type FileRecord = {
  name: string;
  folderId: string | null;
};

export async function buildFileTree(
  projectId: string
): Promise<WorkspaceNode[]> {
  const [folders, files] = await Promise.all([
    prisma.folder.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.file.findMany({
      where: {
        projectId,
      },
      select: {
        name: true,
        folderId: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const folderRecords = folders as FolderRecord[];
  const fileRecords = files as FileRecord[];

  function buildChildren(
    parentId: string | null,
    parentPath = ""
  ): WorkspaceNode[] {
    const childFolders = folderRecords.filter(
      (folder) => folder.parentId === parentId
    );

    const childFiles = fileRecords.filter(
      (file) => file.folderId === parentId
    );

    const folderNodes: WorkspaceNode[] = childFolders.map(
      (folder) => {
        const currentPath = parentPath
          ? `${parentPath}/${folder.name}`
          : folder.name;

        return {
          name: folder.name,
          path: currentPath,
          type: "folder",
          children: buildChildren(
            folder.id,
            currentPath
          ),
        };
      }
    );

    const fileNodes: WorkspaceNode[] = childFiles.map(
      (file) => ({
        name: file.name,
        path: parentPath
          ? `${parentPath}/${file.name}`
          : file.name,
        type: "file",
      })
    );

    return [...folderNodes, ...fileNodes].sort(
      (a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }

        return a.type === "folder" ? -1 : 1;
      }
    );
  }

  return buildChildren(null);
}