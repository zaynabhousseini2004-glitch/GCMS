import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateDepartmentHeadSchema = z.object({
  departmentTitleId: z.number().int().positive(),
  fullName: z.string().min(1),
  photoUrl: z.string().optional(),
  description: z.string().optional(),
});

const UpdateDepartmentHeadSchema = z.object({
  departmentTitleId: z.number().int().positive().optional(),
  fullName: z.string().min(1).optional(),
  photoUrl: z.string().optional(),
  description: z.string().optional(),
});

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

function formatHead(h: {
  id: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  campusId: number;
  createdAt: Date;
  updatedAt: Date;
  title: { id: number; title: string };
}) {
  return {
    id: h.id,
    fullName: h.name,
    departmentTitle: h.title.title,
    photoUrl: h.photoUrl,
    description: h.description,
    campusId: h.campusId,
    createdAt: h.createdAt,
    updatedAt: h.updatedAt,
  };
}

// POST /api/admin/department-heads
export async function createDepartmentHead(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const adminId = req.user!.id;

  const parsed = CreateDepartmentHeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const title = await prisma.departmentTitle.findUnique({
    where: { id: parsed.data.departmentTitleId },
  });
  if (!title) {
    res.status(404).json({ message: "Department title not found" });
    return;
  }

  const head = await prisma.departmentHead.create({
    data: {
      titleId: parsed.data.departmentTitleId,
      adminId,
      campusId,
      name: parsed.data.fullName,
      photoUrl: parsed.data.photoUrl,
      description: parsed.data.description,
    },
    select: HEAD_SELECT,
  });

  res.status(201).json({ departmentHead: formatHead(head) });
}

// GET /api/admin/department-heads
export async function getDepartmentHeads(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const heads = await prisma.departmentHead.findMany({
    where: { campusId },
    select: HEAD_SELECT,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ departmentHeads: heads.map(formatHead) });
}

// PATCH /api/admin/department-heads/:id
export async function updateDepartmentHead(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const parsed = UpdateDepartmentHeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.departmentHead.findUnique({
    where: { id, campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Department head not found" });
    return;
  }

  if (parsed.data.departmentTitleId) {
    const title = await prisma.departmentTitle.findUnique({
      where: { id: parsed.data.departmentTitleId },
    });
    if (!title) {
      res.status(404).json({ message: "Department title not found" });
      return;
    }
  }

  const head = await prisma.departmentHead.update({
    where: { id },
    data: {
      ...(parsed.data.departmentTitleId ? { titleId: parsed.data.departmentTitleId } : {}),
      ...(parsed.data.fullName ? { name: parsed.data.fullName } : {}),
      ...(parsed.data.photoUrl !== undefined ? { photoUrl: parsed.data.photoUrl } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
    },
    select: HEAD_SELECT,
  });

  res.status(200).json({ departmentHead: formatHead(head) });
}

// DELETE /api/admin/department-heads/:id
export async function deleteDepartmentHead(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const existing = await prisma.departmentHead.findUnique({
    where: { id, campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Department head not found" });
    return;
  }

  await prisma.departmentHead.delete({ where: { id } });
  res.status(200).json({ message: "Department head deleted" });
}
