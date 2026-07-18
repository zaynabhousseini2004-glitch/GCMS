import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateCeremonySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ceremonyDate: z.coerce.date(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  venue: z.string().min(1),
  capacity: z.number().int().positive().optional(),
  ceremonyType: z.enum(["BACHELOR", "MASTER"]),
  semester: z.enum(["FALL", "SPRING", "SUMMER"]),
});

const UpdateCeremonySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  ceremonyDate: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  venue: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
  ceremonyType: z.enum(["BACHELOR", "MASTER"]).optional(),
  semester: z.enum(["FALL", "SPRING", "SUMMER"]).optional(),
});

const CEREMONY_SELECT = {
  id: true,
  title: true,
  description: true,
  ceremonyDate: true,
  startTime: true,
  endTime: true,
  venue: true,
  capacity: true,
  ceremonyType: true,
  semester: true,
  status: true,
  ticketPrice: true,
  bannerUrl: true,
  campusId: true,
  createdAt: true,
  updatedAt: true,
} as const;

// POST /api/admin/ceremonies
export async function createCeremony(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const parsed = CreateCeremonySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const ceremony = await prisma.ceremony.create({
    data: { ...parsed.data, campusId },
    select: CEREMONY_SELECT,
  });

  res.status(201).json({ ceremony });
}

// GET /api/admin/ceremonies
export async function getCeremonies(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const ceremonies = await prisma.ceremony.findMany({
    where: { campusId },
    select: {
      ...CEREMONY_SELECT,
      _count: {
        select: {
          registrations: true,
          ticketReservations: true,
          seats: true,
        },
      },
    },
    orderBy: { ceremonyDate: "desc" },
  });

  res.status(200).json({ ceremonies });
}

// GET /api/admin/ceremonies/:id
export async function getCeremonyById(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id, campusId },
    select: {
      ...CEREMONY_SELECT,
      _count: {
        select: {
          registrations: true,
          ticketReservations: true,
          seats: true,
          vendorRequests: true,
          serviceOfferings: true,
        },
      },
    },
  });

  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  res.status(200).json({ ceremony });
}

// PATCH /api/admin/ceremonies/:id
export async function updateCeremony(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const parsed = UpdateCeremonySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.ceremony.findUnique({
    where: { id, campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const ceremony = await prisma.ceremony.update({
    where: { id },
    data: parsed.data,
    select: CEREMONY_SELECT,
  });

  res.status(200).json({ ceremony });
}

// PATCH /api/admin/ceremonies/:id/cancel
export async function cancelCeremony(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const existing = await prisma.ceremony.findUnique({
    where: { id, campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }
  if (existing.status === "CANCELLED") {
    res.status(409).json({ message: "Ceremony is already cancelled" });
    return;
  }

  const ceremony = await prisma.ceremony.update({
    where: { id },
    data: { status: "CANCELLED" },
    select: CEREMONY_SELECT,
  });

  res.status(200).json({ ceremony });
}
