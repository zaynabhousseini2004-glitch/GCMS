import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const STUDENT_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  avatarUrl: true,
  universityId: true,
  faculty: true,
  department: true,
  graduationYear: true,
  graduationSemester: true,
  eligibilityStatus: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

const UpdateEligibilitySchema = z.object({
  eligibilityStatus: z.enum(["PENDING", "ELIGIBLE", "NOT_ELIGIBLE"]),
});

// GET /api/admin/students
export async function getStudents(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const students = await prisma.user.findMany({
    where: { role: "STUDENT", campusId },
    select: STUDENT_SELECT,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ students });
}

// GET /api/admin/students/:id
export async function getStudentById(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid student id" });
    return;
  }

  const student = await prisma.user.findUnique({
    where: { id, role: "STUDENT", campusId },
    select: {
      ...STUDENT_SELECT,
      registrations: {
        select: {
          id: true,
          registrationStatus: true,
          registeredAt: true,
          ceremony: { select: { id: true, title: true, ceremonyDate: true } },
        },
      },
      ticketReservations: {
        select: {
          id: true,
          numberOfTickets: true,
          reservationStatus: true,
          reservedAt: true,
        },
      },
      outfitRentals: {
        select: {
          id: true,
          selectedSize: true,
          rentalStatus: true,
          rentedAt: true,
        },
      },
    },
  });

  if (!student) {
    res.status(404).json({ message: "Student not found" });
    return;
  }

  res.status(200).json({ student });
}

// PATCH /api/admin/students/:id/eligibility
export async function updateStudentEligibility(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid student id" });
    return;
  }

  const parsed = UpdateEligibilitySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id, role: "STUDENT", campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Student not found" });
    return;
  }

  const student = await prisma.user.update({
    where: { id },
    data: { eligibilityStatus: parsed.data.eligibilityStatus },
    select: STUDENT_SELECT,
  });

  res.status(200).json({ student });
}
