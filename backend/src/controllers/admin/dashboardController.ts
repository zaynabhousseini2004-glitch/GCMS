import { Request, Response } from "express";
import { prisma } from "../../libs/prisma";

// GET /api/admin/dashboard
export async function getDashboard(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const [
    totalStudents,
    totalCeremonies,
    upcomingCeremonies,
    totalTicketsIssued,
    totalOutfitRentals,
    totalVendors,
    recentRegistrations,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: "STUDENT", campusId },
    }),
    prisma.ceremony.count({
      where: { campusId },
    }),
    prisma.ceremony.count({
      where: { campusId, status: "UPCOMING" },
    }),
    prisma.ticket.count({
      where: {
        reservation: { ceremony: { campusId } },
      },
    }),
    prisma.outfitRental.count({
      where: { ceremony: { campusId } },
    }),
    prisma.user.count({
      where: { role: "VENDOR", campusId, vendorApprovalStatus: "APPROVED" },
    }),
    prisma.studentCeremonyRegistration.findMany({
      where: { ceremony: { campusId } },
      orderBy: { registeredAt: "desc" },
      take: 5,
      select: {
        id: true,
        registeredAt: true,
        registrationStatus: true,
        user: { select: { id: true, fullName: true, email: true } },
        ceremony: { select: { id: true, title: true } },
      },
    }),
  ]);

  res.status(200).json({
    stats: {
      totalStudents,
      totalCeremonies,
      upcomingCeremonies,
      totalTicketsIssued,
      totalOutfitRentals,
      totalVendors,
    },
    recentRegistrations,
  });
}
