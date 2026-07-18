import { Request, Response } from "express";
import { prisma } from "../libs/prisma";

// GET /api/public/campuses
export async function getCampuses(req: Request, res: Response): Promise<void> {
  const campuses = await prisma.campus.findMany({
    select: {
      id: true,
      name: true,
      location: true,
    },
    orderBy: { name: "asc" },
  });

  res.status(200).json({ campuses });
}

// GET /api/public/campuses/:campusId/ceremonies
export async function getCeremonies(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = Number(req.params.campusId);
  if (!Number.isInteger(campusId) || campusId < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const campus = await prisma.campus.findUnique({
    where: { id: campusId },
    select: { id: true },
  });
  if (!campus) {
    res.status(404).json({ message: "Campus not found" });
    return;
  }

  const ceremonies = await prisma.ceremony.findMany({
    where: { campusId, status: { not: "CANCELLED" } },
    select: {
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
    },
    orderBy: { ceremonyDate: "asc" },
  });

  res.status(200).json({ ceremonies });
}

// GET /api/public/campuses/:campusId/ceremonies/:id
export async function getCeremonyById(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = Number(req.params.campusId);
  const ceremonyId = Number(req.params.id);
  if (
    !Number.isInteger(campusId) ||
    campusId < 1 ||
    !Number.isInteger(ceremonyId) ||
    ceremonyId < 1
  ) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
    select: {
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
      instructions: {
        select: {
          id: true,
          target: true,
          title: true,
          content: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  res.status(200).json({ ceremony });
}

// GET /api/public/campuses/:campusId/outfits
export async function getOutfits(req: Request, res: Response): Promise<void> {
  const campusId = Number(req.params.campusId);
  if (!Number.isInteger(campusId) || campusId < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

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
    },
    orderBy: { outfitType: "asc" },
  });

  res.status(200).json({ outfits });
}

// GET /api/public/campuses/:campusId/department-heads
export async function getDepartmentHeads(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = Number(req.params.campusId);
  if (!Number.isInteger(campusId) || campusId < 1) {
    res.status(400).json({ message: "Invalid campus id" });
    return;
  }

  const heads = await prisma.departmentHead.findMany({
    where: { campusId },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      description: true,
      title: {
        select: { id: true, title: true },
      },
    },
    orderBy: { name: "asc" },
  });

  res.status(200).json({ departmentHeads: heads });
}
