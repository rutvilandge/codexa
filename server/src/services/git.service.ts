import crypto from "crypto";

import { prisma } from "../lib/prisma";
import { requireProjectAccess } from "./project-access.service";

type SnapshotFile = {
  path: string;
  content: string;
  status: "added" | "modified" | "deleted";
};

async function getRepository(projectId: string, userId: string) {
  await requireProjectAccess(projectId, userId);

  return prisma.gitRepository.findUnique({
    where: { projectId },
    include: {
      branches: {
        orderBy: { name: "asc" },
      },
    },
  });
}

async function requireRepository(projectId: string, userId: string) {
  const repository = await getRepository(projectId, userId);

  if (!repository) {
    throw new Error("Git repository is not initialized");
  }

  return repository;
}

async function getCurrentFiles(projectId: string) {
  const files = await prisma.file.findMany({
    where: { projectId },
    include: {
      folder: {
        include: {
          parent: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const folders = await prisma.folder.findMany({
    where: { projectId },
    select: {
      id: true,
      name: true,
      parentId: true,
    },
  });

  const folderMap = new Map(
    folders.map((folder) => [folder.id, folder])
  );

  function getFolderPath(folderId: string | null): string {
    if (!folderId) return "";

    const parts: string[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = folderMap.get(currentId);

      if (!folder) break;

      parts.unshift(folder.name);
      currentId = folder.parentId;
    }

    return parts.join("/");
  }

  return files.map((file) => {
    const folderPath = getFolderPath(file.folderId);

    return {
      path: folderPath ? `${folderPath}/${file.name}` : file.name,
      content: file.content,
    };
  });
}

async function getLatestCommit(
  repositoryId: string,
  branchId: string
) {
  return prisma.gitCommit.findFirst({
    where: {
      repositoryId,
      branchId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      files: true,
    },
  });
}

export async function getGitSummary(
  projectId: string,
  ownerId: string
) {
  await requireProjectAccess(projectId, ownerId);

  const repository = await prisma.gitRepository.findUnique({
    where: { projectId },
    include: {
      branches: {
        orderBy: { name: "asc" },
      },
      commits: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  // No repository yet = valid uninitialized Git state.
  if (!repository) {
    return {
      initialized: false,
      branch: null,
      status: [],
      history: [],
      branches: [],
    };
  }

  const currentFiles = await getCurrentFiles(projectId);

  const activeBranch =
    repository.branches.find(
      (branch) => branch.name === "main"
    ) ?? repository.branches[0];

  if (!activeBranch) {
    return {
      initialized: true,
      branch: null,
      status: currentFiles.map(
        (file) => `?? ${file.path}`
      ),
      history: [],
      branches: [],
    };
  }

  const latestCommit = await getLatestCommit(
    repository.id,
    activeBranch.id
  );

  const previousFiles = new Map(
    (latestCommit?.files ?? [])
      .filter((file) => file.status !== "deleted")
      .map((file) => [file.path, file.content])
  );

  const currentMap = new Map(
    currentFiles.map((file) => [file.path, file.content])
  );

  const status: string[] = [];

  for (const [path, content] of currentMap) {
    if (!previousFiles.has(path)) {
      status.push(`?? ${path}`);
    } else if (previousFiles.get(path) !== content) {
      status.push(` M ${path}`);
    }
  }

  for (const path of previousFiles.keys()) {
    if (!currentMap.has(path)) {
      status.push(` D ${path}`);
    }
  }

  const history = await prisma.gitCommit.findMany({
    where: {
      repositoryId: repository.id,
      branchId: activeBranch.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      hash: true,
      message: true,
      createdAt: true,
    },
  });

  return {
    initialized: true,
    branch: activeBranch.name,
    status,
    history: history.map(
      (commit) =>
        `${commit.hash.slice(0, 7)} ${commit.message}`
    ),
    branches: repository.branches.map(
      (branch) => branch.name
    ),
  };
}

export async function initializeRepository(
  projectId: string,
  ownerId: string
) {
  await requireProjectAccess(projectId, ownerId, true);

  const existing = await prisma.gitRepository.findUnique({
    where: { projectId },
  });

  if (existing) {
    throw new Error("Git repository is already initialized");
  }

  await prisma.gitRepository.create({
    data: {
      projectId,
      branches: {
        create: {
          name: "main",
        },
      },
    },
  });
}

export async function createBranch(
  projectId: string,
  ownerId: string,
  name: string
) {
  await requireProjectAccess(projectId, ownerId, true);

  const repository = await requireRepository(
    projectId,
    ownerId
  );

  const existing = await prisma.gitBranch.findUnique({
    where: {
      repositoryId_name: {
        repositoryId: repository.id,
        name,
      },
    },
  });

  if (existing) {
    throw new Error("Branch already exists");
  }

  await prisma.gitBranch.create({
    data: {
      repositoryId: repository.id,
      name,
    },
  });
}

export async function switchBranch(
  projectId: string,
  ownerId: string,
  name: string
) {
  await requireProjectAccess(projectId, ownerId, true);

  const repository = await requireRepository(
    projectId,
    ownerId
  );

  const branch = await prisma.gitBranch.findUnique({
    where: {
      repositoryId_name: {
        repositoryId: repository.id,
        name,
      },
    },
  });

  if (!branch) {
    throw new Error("Branch not found");
  }

  throw new Error(
    "Branch switching requires workspace branch restoration and is not available yet"
  );
}

export async function commitChanges(
  projectId: string,
  ownerId: string,
  message: string
) {
  await requireProjectAccess(projectId, ownerId, true);

  const repository = await requireRepository(
    projectId,
    ownerId
  );

  const branch =
    repository.branches.find(
      (item) => item.name === "main"
    ) ?? repository.branches[0];

  if (!branch) {
    throw new Error("No Git branch exists");
  }

  const currentFiles = await getCurrentFiles(projectId);

  const latestCommit = await getLatestCommit(
    repository.id,
    branch.id
  );

  const previousFiles = new Map(
    (latestCommit?.files ?? [])
      .filter((file) => file.status !== "deleted")
      .map((file) => [file.path, file.content])
  );

  const currentMap = new Map(
    currentFiles.map((file) => [file.path, file.content])
  );

  const snapshot: SnapshotFile[] = [];

  for (const [path, content] of currentMap) {
    if (!previousFiles.has(path)) {
      snapshot.push({
        path,
        content,
        status: "added",
      });
    } else if (previousFiles.get(path) !== content) {
      snapshot.push({
        path,
        content,
        status: "modified",
      });
    }
  }

  for (const path of previousFiles.keys()) {
    if (!currentMap.has(path)) {
      snapshot.push({
        path,
        content: "",
        status: "deleted",
      });
    }
  }

  if (snapshot.length === 0) {
    throw new Error("Nothing to commit");
  }

  const hash = crypto
    .createHash("sha1")
    .update(
      JSON.stringify({
        parent: latestCommit?.hash ?? null,
        message,
        snapshot,
        timestamp: Date.now(),
      })
    )
    .digest("hex");

  await prisma.gitCommit.create({
    data: {
      repositoryId: repository.id,
      branchId: branch.id,
      hash,
      message,
      authorId: ownerId,
      files: {
        create: snapshot.map((file) => ({
          path: file.path,
          content: file.content,
          status: file.status,
        })),
      },
    },
  });
}

export async function mergeBranch(
  projectId: string,
  ownerId: string,
  name: string
) {
  await requireProjectAccess(projectId, ownerId, true);

  const repository = await requireRepository(
    projectId,
    ownerId
  );

  const sourceBranch = await prisma.gitBranch.findUnique({
    where: {
      repositoryId_name: {
        repositoryId: repository.id,
        name,
      },
    },
  });

  if (!sourceBranch) {
    throw new Error("Branch not found");
  }

  throw new Error(
    "Branch merging requires workspace synchronization and is not available yet"
  );
}

export async function syncRemote(
  projectId: string,
  ownerId: string,
  action: "pull" | "push"
) {
  await requireProjectAccess(projectId, ownerId, true);

  throw new Error(
    `Git ${action} requires a connected remote repository. Connect GitHub before using ${action}.`
  );
}

function safeFilePath(filePath: string) {
  if (
    !filePath ||
    filePath.startsWith("/") ||
    filePath.includes("\\") ||
    filePath.split("/").includes("..")
  ) {
    throw new Error(
      "A project-relative file path is required"
    );
  }

  return filePath;
}

export async function getFileHistory(
  projectId: string,
  ownerId: string,
  filePath: string
) {
  const repository = await requireRepository(
    projectId,
    ownerId
  );

  const safePath = safeFilePath(filePath);

  const commits = await prisma.gitCommit.findMany({
    where: {
      repositoryId: repository.id,
      files: {
        some: {
          path: safePath,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return commits.map((commit) => ({
    hash: commit.hash,
    shortHash: commit.hash.slice(0, 7),
    author: commit.author.name,
    date: commit.createdAt
      .toISOString()
      .slice(0, 10),
    subject: commit.message,
  }));
}

export async function getFileDiff(
  projectId: string,
  ownerId: string,
  filePath: string
) {
  const repository = await requireRepository(
    projectId,
    ownerId
  );

  const safePath = safeFilePath(filePath);

  const commits = await prisma.gitCommit.findMany({
    where: {
      repositoryId: repository.id,
      files: {
        some: {
          path: safePath,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      files: {
        where: {
          path: safePath,
        },
      },
    },
  });

  if (commits.length === 0) {
    return "";
  }

  const latest = commits[commits.length - 1].files[0];

  if (!latest) {
    return "";
  }

  const previousCommit =
    commits.length > 1
      ? commits[commits.length - 2]
      : null;

  const previous =
    previousCommit?.files[0]?.content ?? "";

  const current = latest.content;

  if (previous === current) {
    return "";
  }

  return [
    `--- ${safePath}`,
    `+++ ${safePath}`,
    "",
    ...previous
      .split("\n")
      .map((line) => `- ${line}`),
    ...current
      .split("\n")
      .map((line) => `+ ${line}`),
  ].join("\n");
}