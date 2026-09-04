import type { Response } from "express";
import { prisma } from "../lib/prisma";
import type { AuthRequest } from "../middleware/auth.middleware";

async function requireOwner(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });

  if (!project) {
    throw new Error("Only the project owner can manage collaborators");
  }
}

export async function listMembers(req: AuthRequest, res: Response) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.projectId as string,
        OR: [
          { ownerId: req.user!.id },
          {
            members: {
              some: { userId: req.user!.id },
            },
          },
        ],
      },
      select: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({
      owner: project.owner,
      members: project.members.map(
        (member: (typeof project.members)[number]) => ({
          id: member.id,
          role: member.role,
          user: member.user,
        })
      ),
    });
  } catch {
    return res
      .status(500)
      .json({ message: "Unable to load collaborators" });
  }
}

export async function invite(req: AuthRequest, res: Response) {
  const { email, role } = req.body as {
    email?: unknown;
    role?: unknown;
  };

  if (
    typeof email !== "string" ||
    !email.trim() ||
    !["VIEWER", "EDITOR"].includes(String(role ?? "EDITOR"))
  ) {
    return res
      .status(400)
      .json({ message: "A valid email and role are required" });
  }

  try {
    const projectId = req.params.projectId as string;

    await requireOwner(projectId, req.user!.id);

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user exists with that email" });
    }

    if (user.id === req.user!.id) {
      return res
        .status(400)
        .json({ message: "The project owner already has access" });
    }

    const member = await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
      update: {
        role: role === "VIEWER" ? "VIEWER" : "EDITOR",
      },
      create: {
        projectId,
        userId: user.id,
        role: role === "VIEWER" ? "VIEWER" : "EDITOR",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      member: {
        id: member.id,
        role: member.role,
        user: member.user,
      },
    });
  } catch (error) {
    return res.status(403).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to invite collaborator",
    });
  }
}

export async function updateMember(req: AuthRequest, res: Response) {
  const { role } = req.body as { role?: unknown };

  if (!["VIEWER", "EDITOR"].includes(String(role))) {
    return res.status(400).json({ message: "A valid role is required" });
  }

  try {
    const projectId = req.params.projectId as string;

    await requireOwner(projectId, req.user!.id);

    const member = await prisma.projectMember.updateMany({
      where: {
        id: req.params.memberId as string,
        projectId,
      },
      data: {
        role: role as "VIEWER" | "EDITOR",
      },
    });

    if (!member.count) {
      return res
        .status(404)
        .json({ message: "Collaborator not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(403).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to update collaborator",
    });
  }
}

export async function removeMember(req: AuthRequest, res: Response) {
  try {
    const projectId = req.params.projectId as string;

    await requireOwner(projectId, req.user!.id);

    await prisma.projectMember.deleteMany({
      where: {
        id: req.params.memberId as string,
        projectId,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(403).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to remove collaborator",
    });
  }
}