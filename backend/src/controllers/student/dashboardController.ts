import { Request, Response } from "express";
import { prisma } from "../../libs/prisma";

// GET /api/student/dashboard
export async function getStudentDashboard(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const campusId = req.user!.campusId!;

  const [
    ticketCount,
    outfitRental,
    reservationCount,
    upcomingCeremonies,
    recentNotifications,
  ] = await Promise.all([
    // Total tickets the student has
    prisma.ticket.count({
      where: { reservation: { userId } },
    }),

    // Latest active outfit rental
    prisma.outfitRental.findFirst({
      where: { userId },
      orderBy: { rentedAt: "desc" },
      select: {
        id: true,
        rentalStatus: true,
        selectedSize: true,
        outfit: { select: { id: true, outfitType: true } },
      },
    }),

    // Total reservations (ticket reservations)
    prisma.ticketReservation.count({
      where: { userId },
    }),

    // Upcoming ceremonies on this campus
    prisma.ceremony.findMany({
      where: {
        campusId,
        status: "UPCOMING",
      },
      orderBy: { ceremonyDate: "asc" },
      take: 3,
      select: {
        id: true,
        title: true,
        ceremonyDate: true,
        startTime: true,
        venue: true,
        status: true,
      },
    }),

    // Recent notifications for this student
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  res.status(200).json({
    stats: {
      totalTickets: ticketCount,
      outfitStatus: outfitRental?.rentalStatus ?? null,
      outfitType: outfitRental?.outfit?.outfitType ?? null,
      totalReservations: reservationCount,
    },
    upcomingCeremonies,
    recentNotifications,
  });
}
