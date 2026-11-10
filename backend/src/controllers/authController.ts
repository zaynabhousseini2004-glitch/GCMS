import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../libs/prisma';
import { signToken } from '../middlewares/auth';

// ─── Validation schemas ────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(['STUDENT', 'VENDOR']),
});

const LoginSchema = z.object({
  // trim + lowercase BEFORE the .email() format check, so a stray space or
  // auto-capitalized first letter (common on mobile keyboards) doesn't get
  // rejected as "invalid email" before it ever reaches the DB lookup.
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
    return;
  }

  const { fullName, email, password, phone, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      phone,
      role,
      ...(role === "VENDOR" ? { vendorApprovalStatus: "PENDING" } : {}),
    },
    select: { id: true, fullName: true, email: true, role: true, status: true, avatarUrl: true },
  });

  const token = signToken({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  res.status(201).json({ token, user });
}

// ─── Select Campus ────────────────────────────────────────────────────────────

export async function selectCampus(req: Request, res: Response): Promise<void> {
  const campusId = Number(req.body.campusId);
  if (!campusId || isNaN(campusId)) {
    res.status(400).json({ message: 'campusId is required' });
    return;
  }

  const campus = await prisma.campus.findUnique({ where: { id: campusId } });
  if (!campus) {
    res.status(404).json({ message: 'Campus not found' });
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { campusId },
    select: { id: true, fullName: true, email: true, role: true, status: true, campusId: true, vendorApprovalStatus: true },
  });

  const token = signToken({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    campusId: user.campusId,
  });

  res.json({ token, user });
}

// ─── Get current user profile ─────────────────────────────────────────────────

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, fullName: true, email: true, phone: true,
      role: true, status: true, campusId: true,
      avatarUrl: true, vendorApprovalStatus: true,
      universityId: true, faculty: true, department: true,
      graduationYear: true, graduationSemester: true,
    },
  });
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  res.json({ user });
}

// ─── Update own profile (name / phone) ────────────────────────────────────────

const UpdateProfileSchema = z.object({
  fullName:           z.string().min(2).optional(),
  phone:              z.string().optional(),
  // Student-specific academic fields
  universityId:       z.string().optional(),
  faculty:            z.string().optional(),
  department:         z.string().optional(),
  graduationYear:     z.number().int().positive().optional(),
  graduationSemester: z.enum(['FALL', 'SPRING', 'SUMMER']).optional(),
});

export async function updateMyProfile(req: Request, res: Response): Promise<void> {
  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
    return;
  }
  const { fullName, phone, universityId, faculty, department, graduationYear, graduationSemester } = parsed.data;

  const isStudent = req.user!.role === 'STUDENT';

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(fullName                                   ? { fullName }                                 : {}),
      ...(phone        !== undefined                 ? { phone }                                    : {}),
      ...(isStudent && universityId !== undefined    ? { universityId }                             : {}),
      ...(isStudent && faculty      !== undefined    ? { faculty }                                  : {}),
      ...(isStudent && department   !== undefined    ? { department }                               : {}),
      ...(isStudent && graduationYear !== undefined  ? { graduationYear }                           : {}),
      ...(isStudent && graduationSemester            ? { graduationSemester }                       : {}),
    },
    select: { id: true, fullName: true, email: true, phone: true, role: true, status: true, campusId: true, avatarUrl: true, vendorApprovalStatus: true,
      universityId: true, faculty: true, department: true, graduationYear: true, graduationSemester: true },
  });
  res.json({ user });
}

// ─── Change password ──────────────────────────────────────────────────────────

const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export async function changePassword(req: Request, res: Response): Promise<void> {
  const parsed = ChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
    return;
  }
  const { oldPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { passwordHash: true },
  });
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const match = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!match) { res.status(400).json({ message: 'Old password is incorrect' }); return; }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user!.id }, data: { passwordHash } });
  res.json({ message: 'Password changed successfully' });
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
    return;
  }

  // LoginSchema already trims + lowercases the email before validation.
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      passwordHash: true,
      role: true,
      status: true,
      avatarUrl: true,
      campusId: true,
      vendorApprovalStatus: true,
    },
  });

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  if (user.status === 'INACTIVE') {
    res.status(403).json({ message: 'Account is inactive' });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    campusId: user.campusId,
  });

  const { passwordHash: _, ...safeUser } = user;
  res.status(200).json({ token, user: safeUser });
}
