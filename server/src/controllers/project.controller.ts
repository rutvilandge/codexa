import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createProjectWorkspace,
  getProjectWorkspacePath,
  removeProjectWorkspace,
} from "../services/project-workspace.service";
import { requireProjectAccess } from "../services/project-access.service";

// =======================
// Create Project
// =======================
export const createProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, description, template } = req.body as {
      name?: unknown;
      description?: unknown;
      template?: unknown;
    };

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const selectedTemplate =
      template === "react" ? "react" : "basic";

    const projectId = crypto.randomUUID();

    const workspacePath = getProjectWorkspacePath(
      req.user!.id,
      projectId
    );

    // Vercel uses a serverless filesystem.
    // Do not create persistent workspaces on Vercel.
    if (!process.env.VERCEL) {
      await createProjectWorkspace(
        workspacePath,
        selectedTemplate
      );
    }

    const project = await prisma.project.create({
      data: {
        id: projectId,
        name: name.trim(),
        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,
        ownerId: req.user!.id,
        workspacePath,
        template: selectedTemplate,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================
// Get All Projects
// =======================
export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            ownerId: req.user!.id,
          },
          {
            members: {
              some: {
                userId: req.user!.id,
              },
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================
// Get Single Project
// =======================
export const getProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await requireProjectAccess(id, req.user!.id);

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================
// Update Project
// =======================
export const updateProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const { name, description, isFavorite } = req.body as {
      name?: unknown;
      description?: unknown;
      isFavorite?: unknown;
    };

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Project name cannot be empty",
      });
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user!.id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        ...(typeof name === "string"
          ? { name: name.trim() }
          : {}),

        ...(typeof description === "string"
          ? {
              description:
                description.trim() || null,
            }
          : {}),

        ...(typeof isFavorite === "boolean"
          ? { isFavorite }
          : {}),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================
// Delete Project
// =======================
export const deleteProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user!.id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    // Local filesystem cleanup only.
    // Vercel does not have persistent project workspaces.
    if (!process.env.VERCEL) {
      await removeProjectWorkspace(
        existingProject.workspacePath
      ).catch((error) => {
        console.error(
          "Failed to remove deleted project workspace",
          error
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};