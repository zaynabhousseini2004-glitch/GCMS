import { Request, Response } from "express";
import { prisma } from "../../libs/prisma";

const HEAD_SELECT = {
  id: true,
  name: true,
  photoUrl: true,
  description: true,
  campusId: true,
  createdAt: true,
  updatedAt: true,
  title: { select: { id: true, title: true } },
} as const;

// GET /api/student/department-heads
export async function getDepartmentHeads(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const heads = await prisma.departmentHead.findMany({
    where: { campusId },
    select: HEAD_SELECT,
    orderBy: { createdAt: "asc" },
  });

  const departmentHeads = heads.map((h) => ({
    id: h.id,
    fullName: h.name,
    departmentTitle: h.title.title,
    photoUrl: h.photoUrl,
    description: h.description,
    campusId: h.campusId,
    createdAt: h.createdAt,
    updatedAt: h.updatedAt,
  }));

  res.status(200).json({ departmentHeads });
}
