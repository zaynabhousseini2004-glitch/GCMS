import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const SetTicketPriceSchema = z.object({
  pricePerTicket: z.number().min(0),
});

// GET /api/admin/tickets
export async function getTicketReservations(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const reservations = await prisma.ticketReservation.findMany({
    where: { ceremony: { campusId } },
    select: {
      id: true,
      numberOfTickets: true,
      pricePerTicket: true,
      totalPrice: true,
      reservationStatus: true,
      reservedAt: true,
      user: { select: { id: true, fullName: true, email: true } },
      ceremony: { select: { id: true, title: true, ceremonyDate: true } },
      _count: { select: { tickets: true } },
    },
    orderBy: { reservedAt: "desc" },
  });

  res.status(200).json({ reservations });
}

// GET /api/admin/tickets/:id
export async function getTicketReservationById(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid reservation id" });
    return;
  }

  const reservation = await prisma.ticketReservation.findUnique({
    where: { id },
    select: {
      id: true,
      numberOfTickets: true,
      pricePerTicket: true,
      totalPrice: true,
      reservationStatus: true,
      reservedAt: true,
      user: { select: { id: true, fullName: true, email: true } },
      ceremony: {
        select: { id: true, title: true, ceremonyDate: true, campusId: true },
      },
      tickets: {
        select: {
          id: true,
          ticketCode: true,
          guestName: true,
          seatNumber: true,
          ticketStatus: true,
          createdAt: true,
        },
      },
    },
  });

  if (!reservation || reservation.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Reservation not found" });
    return;
  }

  res.status(200).json({ reservation });
}

// PATCH /api/admin/tickets/:id/confirm
export async function confirmReservation(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid reservation id" });
    return;
  }

  const existing = await prisma.ticketReservation.findUnique({
    where: { id },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Reservation not found" });
    return;
  }
  if (existing.reservationStatus !== "PENDING") {
    res
      .status(409)
      .json({
        message: `Reservation is already ${existing.reservationStatus}`,
      });
    return;
  }

  const reservation = await prisma.ticketReservation.update({
    where: { id },
    data: { reservationStatus: "CONFIRMED" },
    select: {
      id: true,
      reservationStatus: true,
      numberOfTickets: true,
      totalPrice: true,
    },
  });

  res.status(200).json({ reservation });
}

// PATCH /api/admin/tickets/:id/cancel
export async function cancelReservation(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid reservation id" });
    return;
  }

  const existing = await prisma.ticketReservation.findUnique({
    where: { id },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Reservation not found" });
    return;
  }
  if (existing.reservationStatus === "CANCELLED") {
    res.status(409).json({ message: "Reservation is already cancelled" });
    return;
  }

  const reservation = await prisma.ticketReservation.update({
    where: { id },
    data: { reservationStatus: "CANCELLED" },
    select: {
      id: true,
      reservationStatus: true,
      numberOfTickets: true,
      totalPrice: true,
    },
  });

  // Also cancel all tickets in this reservation
  await prisma.ticket.updateMany({
    where: { reservationId: id },
    data: { ticketStatus: "CANCELLED" },
  });

  res.status(200).json({ reservation });
}

// PATCH /api/admin/ceremonies/:ceremonyId/ticket-price
export async function setTicketPrice(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const ceremonyId = Number(req.params.ceremonyId);
  if (!Number.isInteger(ceremonyId) || ceremonyId < 1) {
    res.status(400).json({ message: "Invalid ceremony id" });
    return;
  }

  const parsed = SetTicketPriceSchema.safeParse(req.body);
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

  // Persist the price on the ceremony so future reservations can use it
  await prisma.ceremony.update({
    where: { id: ceremonyId },
    data: { ticketPrice: parsed.data.pricePerTicket },
  });

  // Also update price for all existing PENDING reservations of this ceremony
  const updated = await prisma.ticketReservation.updateMany({
    where: { ceremonyId, reservationStatus: "PENDING" },
    data: { pricePerTicket: parsed.data.pricePerTicket },
  });

  res.status(200).json({
    message: "Ticket price updated",
    pricePerTicket: parsed.data.pricePerTicket,
    updatedCount: updated.count,
  });
}
