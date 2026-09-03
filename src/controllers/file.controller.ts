import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ======================
// Create File
// ======================
export const createFile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      name,
      extension,
      language,
      content,
      projectId,
      folderId,
    } = req.body;

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

    const file = await prisma.file.create({
      data: {
        name,
        extension,
        language,
        content: content || "",
        projectId,
        folderId: folderId || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "File created successfully",
      file,
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
// Get Single File
// ======================
export const getFile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!file || file.project.ownerId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.status(200).json({
      success: true,
      file,
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
// Update File
// ======================
export const updateFile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      content,
      folderId,
    } = req.body;

    const existingFile = await prisma.file.findFirst({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!existingFile || existingFile.project.ownerId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = await prisma.file.update({
      where: {
        id,
      },
      data: {
        name,
        content,
        folderId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "File updated successfully",
      file,
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
// Delete File
// ======================
export const deleteFile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existingFile = await prisma.file.findFirst({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!existingFile || existingFile.project.ownerId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    await prisma.file.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};