import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../libs/prisma";

const ADMIN_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  campusId: true,
  createdAt: true,
  updatedAt: true,
} as const;

const CreateAdminSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  campusId: z.number().int().positive().optional(),
});

const UpdateAdminSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  // Optional — the superadmin "Edit Admin" form can reset a password here.
  // Previously this field didn't exist on the schema, so Zod silently
  // stripped it and the password was NEVER actually updated even though
  // the request returned 200.
  password: z.string().min(8).optional(),
  phone: z.string().optional(),
  campusId: z.number().int().positive().nullable().optional(),
});

// POST /api/admin/create
export async function createAdmin(req: Request, res: Response): Promise<void> {
  const parsed = CreateAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const { fullName, email, password, phone, campusId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: { fullName, email, passwordHash, phone, campusId, role: "ADMIN" },
    select: ADMIN_SELECT,
  });

  res.status(201).json({ user: admin });
}

// GET /api/admin/users
export async function getAdminUsers(
  req: Request,
  res: Response,
): Promise<void> {
  const users = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: ADMIN_SELECT,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ users });
}

// GET /api/admin/users/:id
export async function getAdminUserById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id, role: "ADMIN" },
    select: ADMIN_SELECT,
  });

  if (!user) {
    res.status(404).json({ message: "Admin user not found" });
    return;
  }

  res.status(200).json({ user });
}

// PATCH /api/admin/users/:id
export async function updateAdminUser(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }

  const parsed = UpdateAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id, role: "ADMIN" },
  });
  if (!existing) {
    res.status(404).json({ message: "Admin user not found" });
    return;
  }

  if (parsed.data.email && parsed.data.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (emailTaken) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }
  }

  // Hash the new password exactly once, here, and only if one was provided —
  // `password` is never a column on User, so it must never be passed
  // straight through to Prisma as-is.
  const { password, ...rest } = parsed.data;
  const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;

  const user = await prisma.user.update({
    where: { id },
    data: { ...rest, ...(passwordHash ? { passwordHash } : {}) },
    select: ADMIN_SELECT,
  });

  res.status(200).json({ user });
}

// PATCH /api/admin/users/:id/deactivate
export async function deactivateAdminUser(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id, role: "ADMIN" },
  });
  if (!existing) {
    res.status(404).json({ message: "Admin user not found" });
    return;
  }

  if (existing.status === "INACTIVE") {
    res.status(409).json({ message: "User is already inactive" });
    return;
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status: "INACTIVE" },
    select: ADMIN_SELECT,
  });

  res.status(200).json({ user });
}

// PATCH /api/admin/users/:id/activate
export async function activateAdminUser(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id, role: "ADMIN" },
  });
  if (!existing) {
    res.status(404).json({ message: "Admin user not found" });
    return;
  }

  if (existing.status === "ACTIVE") {
    res.status(409).json({ message: "User is already active" });
    return;
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status: "ACTIVE" },
    select: ADMIN_SELECT,
  });

  res.status(200).json({ user });
}
