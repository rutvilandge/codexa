import fs from "fs/promises";
import path from "path";

// Always resolve workspace storage relative to the backend/server directory.
const SERVER_ROOT = path.resolve(__dirname, "../../");

const WORKSPACES_ROOT = path.resolve(
  process.env.WORKSPACES_ROOT ?? path.join(SERVER_ROOT, "workspaces")
);

const TEMPLATES_ROOT = path.resolve(
  process.env.TEMPLATES_ROOT ?? path.join(SERVER_ROOT, "templates")
);

export function getProjectWorkspacePath(
  ownerId: string,
  projectId: string
) {
  return path.join(WORKSPACES_ROOT, ownerId, projectId);
}

export async function createProjectWorkspace(
  workspacePath: string,
  template = "basic"
) {
  const templatePath = path.join(TEMPLATES_ROOT, template);

  await fs.mkdir(path.dirname(workspacePath), {
    recursive: true,
  });

  try {
    await fs.access(templatePath);

    await fs.cp(templatePath, workspacePath, {
      recursive: true,
      errorOnExist: true,
    });
  } catch (error) {
    const errorCode = (error as NodeJS.ErrnoException).code;

    if (errorCode === "ENOENT") {
      throw new Error("The selected project template does not exist");
    }

    throw error;
  }
}

export async function removeProjectWorkspace(
  workspacePath: string
) {
  const root = path.resolve(WORKSPACES_ROOT);
  const target = path.resolve(workspacePath);

  const relative = path.relative(root, target);

  if (
    !relative ||
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Invalid workspace path");
  }

  await fs.rm(target, {
    recursive: true,
    force: true,
  });
}

export function ensurePathInsideWorkspace(
  workspacePath: string,
  relativePath: string
) {
  if (!relativePath || path.isAbsolute(relativePath)) {
    throw new Error("A relative workspace path is required");
  }

  const root = path.resolve(workspacePath);
  const resolvedPath = path.resolve(root, relativePath);

  const relative = path.relative(root, resolvedPath);

  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Path is outside the project workspace");
  }

  return resolvedPath;
}