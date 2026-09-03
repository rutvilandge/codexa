import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// =====================
// Create Project
// =====================
export const createProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user!.id,
      },
    });

    return res.status(201).json({
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

// =====================
// Get Projects
// =====================
export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: req.user!.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json({
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

// =====================
// Get Single Project
// =====================
export const getProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user!.id,
      },
      include: {
        folders: true,
        files: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json({
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

// =====================
// Update Project
// =====================
export const updateProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, description, isFavorite } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        isFavorite,
      },
    });

    return res.json({
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

// =====================
// Delete Project
// =====================
export const deleteProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    return res.json({
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