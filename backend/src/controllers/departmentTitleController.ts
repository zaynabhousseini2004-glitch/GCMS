import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../libs/prisma";

const TitleSchema = z.object({
  title: z.string().min(1),
});

// GET /api/admin/department-titles
export async function getDepartmentTitles(
  req: Request,
  res: Response,
): Promise<void> {
  const titles = await prisma.departmentTitle.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      _count: { select: { heads: true } },
    },
  });

  res.status(200).json({ departmentTitles: titles });
}

// POST /api/admin/department-titles
export async function createDepartmentTitle(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = TitleSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.departmentTitle.findUnique({
    where: { title: parsed.data.title },
  });
  if (existing) {
    res.status(409).json({ message: "Title already exists" });
    return;
  }

  const record = await prisma.departmentTitle.create({
    data: { title: parsed.data.title },
    select: { id: true, title: true, createdAt: true },
  });

  res.status(201).json({ departmentTitle: record });
}

// PATCH /api/admin/department-titles/:id
export async function updateDepartmentTitle(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const parsed = TitleSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.departmentTitle.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Title not found" });
    return;
  }

  const nameTaken = await prisma.departmentTitle.findUnique({
    where: { title: parsed.data.title },
  });
  if (nameTaken && nameTaken.id !== id) {
    res.status(409).json({ message: "Title already exists" });
    return;
  }

  const record = await prisma.departmentTitle.update({
    where: { id },
    data: { title: parsed.data.title },
    select: { id: true, title: true, createdAt: true },
  });

  res.status(200).json({ departmentTitle: record });
}

// DELETE /api/admin/department-titles/:id
export async function deleteDepartmentTitle(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const existing = await prisma.departmentTitle.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Title not found" });
    return;
  }

  await prisma.departmentTitle.delete({ where: { id } });
  res.status(200).json({ message: "Title deleted successfully" });
}
