import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../libs/prisma";

const CreateCampusSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
});

const UpdateCampusSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().optional(),
});

// POST /api/admin/campuses
export async function createCampus(req: Request, res: Response): Promise<void> {
  const parsed = CreateCampusSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const { name, location } = parsed.data;

  const existing = await prisma.campus.findUnique({ where: { name } });
  if (existing) {
    res.status(409).json({ message: "Campus name already exists" });
    return;
  }

  const campus = await prisma.campus.create({
    data: { name, location },
    select: {
      id: true,
      name: true,
      location: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({ campus });
}

// GET /api/admin/campuses
export async function getCampuses(req: Request, res: Response): Promise<void> {
  const campuses = await prisma.campus.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      location: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { users: true, ceremonies: true },
      },
    },
  });

  res.status(200).json({ campuses });
}

// GET /api/admin/campuses/:id
export async function getCampusById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const campus = await prisma.campus.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      location: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { users: true, ceremonies: true },
      },
    },
  });

  if (!campus) {
    res.status(404).json({ message: "Campus not found" });
    return;
  }

  res.status(200).json({ campus });
}

// PATCH /api/admin/campuses/:id
export async function updateCampus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const parsed = UpdateCampusSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.campus.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Campus not found" });
    return;
  }

  if (parsed.data.name && parsed.data.name !== existing.name) {
    const nameTaken = await prisma.campus.findUnique({
      where: { name: parsed.data.name },
    });
    if (nameTaken) {
      res.status(409).json({ message: "Campus name already exists" });
      return;
    }
  }

  const campus = await prisma.campus.update({
    where: { id },
    data: parsed.data,
    select: {
      id: true,
      name: true,
      location: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ campus });
}

// DELETE /api/admin/campuses/:id
export async function deleteCampus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const existing = await prisma.campus.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Campus not found" });
    return;
  }

  await prisma.campus.delete({ where: { id } });
  res.status(200).json({ message: "Campus deleted successfully" });
}

// GET /api/admin/campuses/:id/admins
export async function getCampusAdmins(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const campus = await prisma.campus.findUnique({ where: { id } });
  if (!campus) {
    res.status(404).json({ message: "Campus not found" });
    return;
  }

  const admins = await prisma.user.findMany({
    where: { campusId: id, role: "ADMIN" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
    },
    orderBy: { fullName: "asc" },
  });

  res.status(200).json({ admins });
}

// POST /api/admin/campuses/:id/admins  — assign an existing admin to this campus
export async function assignAdminToCampus(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = Number(req.params.id);
  if (!Number.isInteger(campusId) || campusId < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const parsed = z
    .object({ adminId: z.number().int().positive() })
    .safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const campus = await prisma.campus.findUnique({ where: { id: campusId } });
  if (!campus) {
    res.status(404).json({ message: "Campus not found" });
    return;
  }

  const admin = await prisma.user.findUnique({
    where: { id: parsed.data.adminId },
  });
  if (!admin || admin.role !== "ADMIN") {
    res.status(404).json({ message: "Admin user not found" });
    return;
  }

  const updated = await prisma.user.update({
    where: { id: parsed.data.adminId },
    data: { campusId },
    select: { id: true, fullName: true, email: true, campusId: true },
  });

  res.status(200).json({ user: updated });
}

// DELETE /api/admin/campuses/:id/admins/:adminId  — remove admin from campus
export async function removeAdminFromCampus(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = Number(req.params.id);
  const adminId = Number(req.params.adminId);

  if (
    !Number.isInteger(campusId) ||
    campusId < 1 ||
    !Number.isInteger(adminId) ||
    adminId < 1
  ) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin || admin.role !== "ADMIN" || admin.campusId !== campusId) {
    res.status(404).json({ message: "Admin not found on this campus" });
    return;
  }

  await prisma.user.update({
    where: { id: adminId },
    data: { campusId: null },
  });

  res.status(200).json({ message: "Admin removed from campus" });
}
