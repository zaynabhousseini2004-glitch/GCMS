import { Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../../libs/prisma";

const ReserveTicketsSchema = z.object({
  ceremonyId: z.number().int().positive(),
  numberOfTickets: z.number().int().min(1).max(10),
  guests: z
    .array(
      z.object({
        guestName: z.string().min(1),
      }),
    )
    .optional(),
});

function generateTicketCode(): string {
  return `TKT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
}

function generateQrCode(ticketCode: string): string {
  // QR data payload — the frontend will render this as a QR image
  return `GCMS:${ticketCode}`;
}

// POST /api/student/tickets
export async function reserveTickets(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const campusId = req.user!.campusId!;

  const parsed = ReserveTicketsSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const { ceremonyId, numberOfTickets, guests } = parsed.data;

  // Verify ceremony exists on student's campus and is upcoming
  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }
  if (ceremony.status !== "UPCOMING") {
    res
      .status(409)
      .json({ message: "Ceremony is not accepting reservations" });
    return;
  }

  // Block reservation if admin has not set a ticket price yet
  if (ceremony.ticketPrice === null) {
    res
      .status(409)
      .json({ message: "Ticket price has not been set for this ceremony. Please contact the admin." });
    return;
  }

  // Check student eligibility
  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: { eligibilityStatus: true },
  });
  if (student?.eligibilityStatus !== "ELIGIBLE") {
    res
      .status(403)
      .json({ message: "You must be marked as ELIGIBLE to reserve tickets" });
    return;
  }

  // Build ticket data
  const ticketData = Array.from({ length: numberOfTickets }, (_, i) => {
    const ticketCode = generateTicketCode();
    return {
      ticketCode,
      qrCode: generateQrCode(ticketCode),
      guestName: guests?.[i]?.guestName ?? null,
    };
  });

  // Get price from the ceremony's configured ticket price
  const pricePerTicket = Number(ceremony.ticketPrice);

  const reservation = await prisma.ticketReservation.create({
    data: {
      userId,
      ceremonyId,
      numberOfTickets,
      pricePerTicket,
      totalPrice: pricePerTicket * numberOfTickets,
      tickets: {
        create: ticketData,
      },
    },
    select: {
      id: true,
      numberOfTickets: true,
      pricePerTicket: true,
      totalPrice: true,
      reservationStatus: true,
      reservedAt: true,
      tickets: {
        select: {
          id: true,
          ticketCode: true,
          qrCode: true,
          guestName: true,
          ticketStatus: true,
        },
      },
    },
  });

  res.status(201).json({ reservation });
}

// GET /api/student/tickets
export async function getMyTickets(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;

  const reservations = await prisma.ticketReservation.findMany({
    where: { userId },
    select: {
      id: true,
      numberOfTickets: true,
      pricePerTicket: true,
      totalPrice: true,
      reservationStatus: true,
      reservedAt: true,
      ceremony: {
        select: {
          id: true,
          title: true,
          ceremonyDate: true,
          venue: true,
          status: true,
        },
      },
      tickets: {
        select: {
          id: true,
          ticketCode: true,
          qrCode: true,
          guestName: true,
          seatNumber: true,
          ticketStatus: true,
        },
      },
    },
    orderBy: { reservedAt: "desc" },
  });

  res.status(200).json({ reservations });
}

// GET /api/student/tickets/:id
export async function getTicketById(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId < 1) {
    res.status(400).json({ message: "Invalid reservation id" });
    return;
  }

  const reservation = await prisma.ticketReservation.findUnique({
    where: { id: reservationId, userId },
    select: {
      id: true,
      numberOfTickets: true,
      pricePerTicket: true,
      totalPrice: true,
      reservationStatus: true,
      reservedAt: true,
      ceremony: {
        select: {
          id: true,
          title: true,
          ceremonyDate: true,
          venue: true,
          status: true,
        },
      },
      tickets: {
        select: {
          id: true,
          ticketCode: true,
          qrCode: true,
          guestName: true,
          seatNumber: true,
          ticketStatus: true,
          createdAt: true,
        },
      },
    },
  });

  if (!reservation) {
    res.status(404).json({ message: "Reservation not found" });
    return;
  }

  res.status(200).json({ reservation });
}

// PATCH /api/student/tickets/:id/cancel
export async function cancelReservation(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId < 1) {
    res.status(400).json({ message: "Invalid reservation id" });
    return;
  }

  const existing = await prisma.ticketReservation.findUnique({
    where: { id: reservationId, userId },
  });
  if (!existing) {
    res.status(404).json({ message: "Reservation not found" });
    return;
  }
  if (existing.reservationStatus !== "PENDING") {
    res.status(409).json({
      message: `Cannot cancel reservation with status ${existing.reservationStatus}`,
    });
    return;
  }

  const reservation = await prisma.$transaction(async (tx) => {
    // Cancel all tickets
    await tx.ticket.updateMany({
      where: { reservationId },
      data: { ticketStatus: "CANCELLED" },
    });

    return tx.ticketReservation.update({
      where: { id: reservationId },
      data: { reservationStatus: "CANCELLED" },
      select: {
        id: true,
        reservationStatus: true,
      },
    });
  });

  res.status(200).json({ reservation });
}
