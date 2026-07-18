import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const ScanSchema = z.object({
  // Accept either the raw QR payload ("GCMS:TKT-XXX") or a bare ticket code
  qrCode: z.string().min(1).optional(),
  ticketCode: z.string().min(1).optional(),
}).refine((d) => d.qrCode || d.ticketCode, {
  message: "Either qrCode or ticketCode is required",
});

function extractTicketCode(raw: string): string {
  // Strip "GCMS:" prefix if present
  return raw.startsWith("GCMS:") ? raw.slice(5) : raw;
}

// POST /api/admin/qr-scan
export async function scanQrCode(req: Request, res: Response): Promise<void> {
  const scannedById = req.user!.id;

  const parsed = ScanSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const rawCode = parsed.data.qrCode ?? parsed.data.ticketCode!;
  const ticketCode = extractTicketCode(rawCode);

  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode },
    select: {
      id: true,
      ticketCode: true,
      qrCode: true,
      guestName: true,
      seatNumber: true,
      ticketStatus: true,
      reservation: {
        select: {
          id: true,
          reservationStatus: true,
          numberOfTickets: true,
          totalPrice: true,
          user: { select: { id: true, fullName: true, email: true } },
          ceremony: {
            select: {
              id: true,
              title: true,
              ceremonyDate: true,
              venue: true,
              status: true,
              campusId: true,
            },
          },
        },
      },
    },
  });

  // Fetch outfit rentals for this student + ceremony separately (no direct relation on TicketReservation)
  const outfitRentals = ticket?.reservation?.user?.id
    ? await prisma.outfitRental.findMany({
        where: {
          userId: ticket.reservation.user.id,
          ceremonyId: ticket.reservation.ceremony.id,
        },
        select: { id: true, rentalStatus: true, outfit: { select: { outfitType: true, size: true } } },
      })
    : [];

  // Helper to build the shared ticket info payload
  function buildTicketInfo(t: typeof ticket) {
    if (!t) return null;
    const c = t.reservation.ceremony;
    const isUpcoming = c.status === "UPCOMING";
    return {
      ticketCode: t.ticketCode,
      guestName: t.guestName ?? null,
      seatNumber: t.seatNumber ?? null,
      ticketStatus: t.ticketStatus,
      student: t.reservation.user
        ? { id: t.reservation.user.id, fullName: t.reservation.user.fullName, email: t.reservation.user.email }
        : null,
      ceremony: {
        id: c.id,
        title: c.title,
        ceremonyDate: c.ceremonyDate,
        venue: c.venue ?? null,
        status: c.status,
        isUpcoming,
      },
      reservation: {
        id: t.reservation.id,
        status: t.reservation.reservationStatus,
        numberOfTickets: t.reservation.numberOfTickets,
        totalPrice: t.reservation.totalPrice,
      },
      outfitRentals: outfitRentals.map((or) => ({
        id: or.id,
        status: or.rentalStatus,
        outfitType: or.outfit?.outfitType ?? null,
        size: or.outfit?.size ?? null,
      })),
    };
  }

  // Ticket not found or wrong campus
  if (!ticket || ticket.reservation.ceremony.campusId !== req.user!.campusId) {
    await prisma.qrScan
      .create({
        data: {
          ticketId: ticket?.id ?? 0,
          scannedById,
          scanStatus: "INVALID",
          scanNote: ticket ? "Wrong campus" : "Ticket not found",
        },
      })
      .catch(() => {}); // best-effort log if ticketId is 0

    res.status(200).json({ status: "INVALID", access: "DENIED", data: null });
    return;
  }

  // Ticket cancelled
  if (ticket.ticketStatus === "CANCELLED") {
    await prisma.qrScan.create({
      data: { ticketId: ticket.id, scannedById, scanStatus: "INVALID", scanNote: "Ticket cancelled" },
    });
    res.status(200).json({ status: "INVALID", access: "DENIED", data: buildTicketInfo(ticket) });
    return;
  }

  // Ticket already used
  if (ticket.ticketStatus === "USED") {
    await prisma.qrScan.create({
      data: { ticketId: ticket.id, scannedById, scanStatus: "ALREADY_USED", scanNote: "Ticket already scanned" },
    });
    res.status(200).json({ status: "ALREADY_USED", access: "DENIED", data: buildTicketInfo(ticket) });
    return;
  }

  // Valid — mark as USED
  await prisma.$transaction([
    prisma.ticket.update({ where: { id: ticket.id }, data: { ticketStatus: "USED" } }),
    prisma.qrScan.create({ data: { ticketId: ticket.id, scannedById, scanStatus: "VALID" } }),
  ]);

  res.status(200).json({ status: "VALID", access: "GRANTED", data: buildTicketInfo(ticket) });
}
