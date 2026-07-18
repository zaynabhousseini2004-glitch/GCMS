import { Request, Response } from "express";
import { prisma } from "../../libs/prisma";

// GET /api/student/ceremonies
export async function getCeremonies(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

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
      ticketPrice: true,
      bannerUrl: true,
      instructions: {
        where: { target: { in: ["STUDENT", "PARENT", "GUEST"] } },
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
          target: true,
        },
        orderBy: [{ target: "asc" }, { order: "asc" }],
      },
      _count: {
        select: {
          registrations: true,
          ticketReservations: true,
        },
      },
    },
    orderBy: { ceremonyDate: "asc" },
  });

  res.status(200).json({ ceremonies });
}

// GET /api/student/ceremonies/:id
export async function getCeremonyById(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.id);
  if (!Number.isInteger(ceremonyId) || ceremonyId < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
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
      ticketPrice: true,
      bannerUrl: true,
      instructions: {
        where: { target: { in: ["STUDENT", "PARENT", "GUEST"] } },
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
          target: true,
        },
        orderBy: [{ target: "asc" }, { order: "asc" }],
      },
      serviceOfferings: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
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
