import { Request, Response } from "express";
import { prisma } from "../../libs/prisma";

// GET /api/student/reservations
export async function getMyReservations(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;

  const [ticketReservations, outfitRentals, seatAssignments] =
    await Promise.all([
      prisma.ticketReservation.findMany({
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
            },
          },
          tickets: {
            select: {
              id: true,
              ticketCode: true,
              guestName: true,
              ticketStatus: true,
            },
          },
        },
        orderBy: { reservedAt: "desc" },
      }),

      prisma.outfitRental.findMany({
        where: { userId },
        select: {
          id: true,
          selectedSize: true,
          rentalStatus: true,
          pickupDate: true,
          returnDate: true,
          rentedAt: true,
          ceremony: {
            select: {
              id: true,
              title: true,
              ceremonyDate: true,
            },
          },
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
      }),

      prisma.seatAssignment.findMany({
        where: { userId },
        select: {
          id: true,
          assignedAt: true,
          ceremony: {
            select: {
              id: true,
              title: true,
              ceremonyDate: true,
              venue: true,
            },
          },
          seat: {
            select: {
              id: true,
              seatNumber: true,
              sectionName: true,
              rowNumber: true,
            },
          },
        },
        orderBy: { assignedAt: "desc" },
      }),
    ]);

  res.status(200).json({
    ticketReservations,
    outfitRentals,
    seatAssignments,
  });
}
