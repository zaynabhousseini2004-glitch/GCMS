import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const BulkCreateSeatsSchema = z.object({
  seats: z
    .array(
      z.object({
        seatNumber: z.string().min(1),
        sectionName: z.string().optional(),
        rowNumber: z.string().optional(),
      }),
    )
    .min(1),
});

const AssignSeatSchema = z.object({
  seatId: z.number().int().positive(),
  userId: z.number().int().positive().optional(),
  guestName: z.string().min(1).max(100).optional(),
}).refine((d) => d.userId || d.guestName, {
  message: "Either userId or guestName is required",
});

// POST /api/admin/ceremonies/:ceremonyId/seats  — bulk create
export async function createSeats(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.ceremonyId);
  if (!Number.isInteger(ceremonyId) || ceremonyId < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const parsed = BulkCreateSeatsSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const data = parsed.data.seats.map((s) => ({
    ...s,
    ceremonyId,
  }));

  const result = await prisma.seat.createMany({
    data,
    skipDuplicates: true,
  });

  res.status(201).json({ message: "Seats created", count: result.count });
}

// GET /api/admin/ceremonies/:ceremonyId/seats
export async function getSeats(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.ceremonyId);
  if (!Number.isInteger(ceremonyId) || ceremonyId < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const [seats, ticketReservations] = await Promise.all([
    prisma.seat.findMany({
      where: { ceremonyId },
      select: {
        id: true,
        seatNumber: true,
        sectionName: true,
        rowNumber: true,
        seatStatus: true,
        assignments: {
          select: {
            id: true,
            guestName: true,
            user: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
      orderBy: { seatNumber: "asc" },
    }),
    prisma.ticketReservation.findMany({
      where: { ceremonyId, reservationStatus: "CONFIRMED" },
      select: {
        userId: true,
        numberOfTickets: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    }),
  ]);

  // Aggregate numberOfTickets per user (a student may have multiple reservation rows)
  const ticketMap = new Map<number, { userId: number; numberOfTickets: number; user: { id: number; fullName: string; email: string } }>();
  for (const tr of ticketReservations) {
    if (ticketMap.has(tr.userId)) {
      ticketMap.get(tr.userId)!.numberOfTickets += tr.numberOfTickets;
    } else {
      ticketMap.set(tr.userId, { ...tr });
    }
  }

  res.status(200).json({ seats, ticketReservations: Array.from(ticketMap.values()) });
}

// POST /api/admin/ceremonies/:ceremonyId/seats/assign
export async function assignSeat(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.ceremonyId);
  if (!Number.isInteger(ceremonyId) || ceremonyId < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const parsed = AssignSeatSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const seat = await prisma.seat.findUnique({
    where: { id: parsed.data.seatId, ceremonyId },
  });
  if (!seat) {
    res.status(404).json({ message: "Seat not found in this ceremony" });
    return;
  }
  if (seat.seatStatus !== "AVAILABLE") {
    res.status(409).json({ message: "Seat is not available" });
    return;
  }

  if (parsed.data.userId) {
    // Registered student path — check student exists and ticket limit
    const student = await prisma.user.findUnique({
      where: { id: parsed.data.userId, role: "STUDENT" },
    });
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    // Check ticket purchase limit — sum across all reservation rows
    const ticketAgg = await prisma.ticketReservation.aggregate({
      where: { userId: parsed.data.userId, ceremonyId, reservationStatus: "CONFIRMED" },
      _sum: { numberOfTickets: true },
    });
    const allowedSeats = ticketAgg._sum.numberOfTickets ?? 0;
    if (allowedSeats === 0) {
      res.status(409).json({ message: "Student has no confirmed ticket reservation for this ceremony" });
      return;
    }

    const existingAssignments = await prisma.seatAssignment.count({
      where: { userId: parsed.data.userId, ceremonyId },
    });
    if (existingAssignments >= allowedSeats) {
      res.status(409).json({
        message: `Student already has ${existingAssignments} seat(s) assigned — limit is ${allowedSeats} based on purchased tickets`,
      });
      return;
    }
  }

  const [assignment] = await prisma.$transaction([
    prisma.seatAssignment.create({
      data: {
        ...(parsed.data.userId ? { userId: parsed.data.userId } : {}),
        ...(parsed.data.guestName ? { guestName: parsed.data.guestName } : {}),
        ceremonyId,
        seatId: parsed.data.seatId,
      },
      select: {
        id: true,
        assignedAt: true,
        user: { select: { id: true, fullName: true } },
        seat: { select: { id: true, seatNumber: true } },
      },
    }),
    prisma.seat.update({
      where: { id: parsed.data.seatId },
      data: { seatStatus: "RESERVED" },
    }),
  ]);

  res.status(201).json({ assignment });
}

// DELETE /api/admin/ceremonies/:ceremonyId/seats/assign/:id
export async function removeSeatAssignment(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.ceremonyId);
  const id = Number(req.params.id);
  if (
    !Number.isInteger(ceremonyId) ||
    ceremonyId < 1 ||
    !Number.isInteger(id) ||
    id < 1
  ) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const assignment = await prisma.seatAssignment.findUnique({
    where: { id, ceremonyId },
  });
  if (!assignment) {
    res.status(404).json({ message: "Seat assignment not found" });
    return;
  }

  await prisma.$transaction([
    prisma.seatAssignment.delete({ where: { id } }),
    prisma.seat.update({
      where: { id: assignment.seatId },
      data: { seatStatus: "AVAILABLE" },
    }),
  ]);

  res.status(200).json({ message: "Seat assignment removed" });
}
