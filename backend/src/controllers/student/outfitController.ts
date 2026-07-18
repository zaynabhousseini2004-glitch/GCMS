import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const RentOutfitSchema = z.object({
  ceremonyId: z.number().int().positive(),
  outfitId: z.number().int().positive(),
  selectedSize: z.string().min(1),
});

// GET /api/student/outfits
export async function getOutfits(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const { type, size } = req.query;

  const where: Record<string, unknown> = {
    campusId,
    status: "AVAILABLE",
    quantityAvailable: { gt: 0 },
  };
  if (type && typeof type === "string") {
    where.outfitType = type;
  }
  if (size && typeof size === "string") {
    where.size = size;
  }

  const outfits = await prisma.outfit.findMany({
    where,
    select: {
      id: true,
      outfitType: true,
      size: true,
      color: true,
      ceremonyType: true,
      quantityAvailable: true,
      rentalPrice: true,
      status: true,
      imageUrl: true,
    },
    orderBy: { outfitType: "asc" },
  });

  res.status(200).json({ outfits });
}

// POST /api/student/outfits/rent
export async function rentOutfit(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const campusId = req.user!.campusId!;

  const parsed = RentOutfitSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const { ceremonyId, outfitId, selectedSize } = parsed.data;

  // Verify ceremony
  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }
  if (ceremony.status !== "UPCOMING") {
    res.status(409).json({ message: "Ceremony is not accepting rentals" });
    return;
  }

  // Verify outfit availability
  const outfit = await prisma.outfit.findUnique({
    where: { id: outfitId, campusId },
  });
  if (!outfit) {
    res.status(404).json({ message: "Outfit not found" });
    return;
  }
  if (outfit.status !== "AVAILABLE" || outfit.quantityAvailable < 1) {
    res.status(409).json({ message: "Outfit is not available" });
    return;
  }

  // Check if student already has a pending/approved rental for this outfit + ceremony
  const existingRental = await prisma.outfitRental.findFirst({
    where: {
      userId,
      ceremonyId,
      outfitId,
      rentalStatus: { in: ["PENDING", "APPROVED"] },
    },
  });
  if (existingRental) {
    res
      .status(409)
      .json({ message: "You already have an active rental for this outfit" });
    return;
  }

  const rental = await prisma.outfitRental.create({
    data: {
      userId,
      ceremonyId,
      outfitId,
      selectedSize,
    },
    select: {
      id: true,
      selectedSize: true,
      rentalStatus: true,
      rentedAt: true,
      outfit: {
        select: {
          id: true,
          outfitType: true,
          color: true,
          rentalPrice: true,
        },
      },
    },
  });

  res.status(201).json({ rental });
}

// GET /api/student/outfits/rentals
export async function getMyRentals(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;

  const rentals = await prisma.outfitRental.findMany({
    where: { userId },
    select: {
      id: true,
      selectedSize: true,
      rentalStatus: true,
      rentedAt: true,
      outfit: {
        select: {
          id: true,
          outfitType: true,
          color: true,
          rentalPrice: true,
        },
      },
    },
    orderBy: { rentedAt: "desc" },
  });

  res.status(200).json({ rentals });
}

// PATCH /api/student/outfits/rentals/:id/cancel
export async function cancelRental(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const rentalId = Number(req.params.id);
  if (!Number.isInteger(rentalId) || rentalId < 1) {
    res.status(400).json({ message: "Invalid rental id" });
    return;
  }

  const existing = await prisma.outfitRental.findFirst({
    where: { id: rentalId, userId },
  });
  if (!existing) {
    res.status(404).json({ message: "Rental not found" });
    return;
  }
  if (existing.rentalStatus !== "PENDING") {
    res.status(409).json({
      message: `Cannot cancel rental with status ${existing.rentalStatus}`,
    });
    return;
  }

  const rental = await prisma.outfitRental.update({
    where: { id: rentalId },
    data: { rentalStatus: "REJECTED" },
    select: {
      id: true,
      rentalStatus: true,
    },
  });

  res.status(200).json({ rental });
}
