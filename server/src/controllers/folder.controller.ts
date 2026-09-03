import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ======================
// Create Folder
// ======================
export const createFolder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, projectId, parentId } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Name and Project ID are required",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user!.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        projectId,
        parentId: parentId || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================
// Get Folder Tree
// ======================
export const getFolders = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = req.params.projectId as string;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user!.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const folders = await prisma.folder.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================
// Rename Folder
// ======================
export const updateFolder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;

    const folder = await prisma.folder.findFirst({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!folder || folder.project.ownerId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const updated = await prisma.folder.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully",
      folder: updated,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================
// Delete Folder
// ======================
export const deleteFolder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const folder = await prisma.folder.findFirst({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!folder || folder.project.ownerId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    await prisma.folder.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
