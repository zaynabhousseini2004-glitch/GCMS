import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateOutfitSchema = z.object({
  outfitType: z.enum(["GOWN", "CAP", "HOOD"]),
  size: z.string().optional(),
  color: z.string().optional(),
  ceremonyType: z.enum(["BACHELOR", "MASTER"]).optional(),
  quantityAvailable: z.number().int().min(0).default(0),
  rentalPrice: z.number().min(0).default(0),
});

const UpdateOutfitSchema = z.object({
  outfitType: z.enum(["GOWN", "CAP", "HOOD"]).optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  ceremonyType: z.enum(["BACHELOR", "MASTER"]).optional(),
  quantityAvailable: z.number().int().min(0).optional(),
  rentalPrice: z.number().min(0).optional(),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
});

const OUTFIT_SELECT = {
  id: true,
  outfitType: true,
  size: true,
  color: true,
  ceremonyType: true,
  quantityAvailable: true,
  rentalPrice: true,
  status: true,
  imageUrl: true,
  campusId: true,
  createdAt: true,
  updatedAt: true,
} as const;

// POST /api/admin/outfits
export async function createOutfit(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const parsed = CreateOutfitSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const outfit = await prisma.outfit.create({
    data: { ...parsed.data, campusId },
    select: OUTFIT_SELECT,
  });

  res.status(201).json({ outfit });
}

// GET /api/admin/outfits
export async function getOutfits(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;

  const outfits = await prisma.outfit.findMany({
    where: { campusId },
    select: {
      ...OUTFIT_SELECT,
      _count: { select: { outfitRentals: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ outfits });
}

// PATCH /api/admin/outfits/:id
export async function updateOutfit(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid outfit id" });
    return;
  }

  const parsed = UpdateOutfitSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.outfit.findUnique({
    where: { id, campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Outfit not found" });
    return;
  }

  const outfit = await prisma.outfit.update({
    where: { id },
    data: parsed.data,
    select: OUTFIT_SELECT,
  });

  res.status(200).json({ outfit });
}

// GET /api/admin/outfits/rentals
export async function getOutfitRentals(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const rentals = await prisma.outfitRental.findMany({
    where: { ceremony: { campusId } },
    select: {
      id: true,
      selectedSize: true,
      rentalStatus: true,
      pickupDate: true,
      returnDate: true,
      rentedAt: true,
      user: { select: { id: true, fullName: true, email: true } },
      outfit: {
        select: {
          id: true,
          outfitType: true,
          size: true,
          color: true,
          rentalPrice: true,
        },
      },
      ceremony: { select: { id: true, title: true } },
    },
    orderBy: { rentedAt: "desc" },
  });

  res.status(200).json({ rentals });
}

// PATCH /api/admin/outfits/rentals/:id/approve
export async function approveRental(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid rental id" });
    return;
  }

  const existing = await prisma.outfitRental.findUnique({
    where: { id },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Rental not found" });
    return;
  }
  if (existing.rentalStatus !== "PENDING") {
    res
      .status(409)
      .json({ message: `Rental is already ${existing.rentalStatus}` });
    return;
  }

  const rental = await prisma.outfitRental.update({
    where: { id },
    data: { rentalStatus: "APPROVED" },
    select: { id: true, rentalStatus: true, selectedSize: true },
  });

  res.status(200).json({ rental });
}

// PATCH /api/admin/outfits/rentals/:id/reject
export async function rejectRental(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid rental id" });
    return;
  }

  const existing = await prisma.outfitRental.findUnique({
    where: { id },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Rental not found" });
    return;
  }
  if (existing.rentalStatus !== "PENDING") {
    res
      .status(409)
      .json({ message: `Rental is already ${existing.rentalStatus}` });
    return;
  }

  const rental = await prisma.outfitRental.update({
    where: { id },
    data: { rentalStatus: "REJECTED" },
    select: { id: true, rentalStatus: true, selectedSize: true },
  });

  res.status(200).json({ rental });
}
