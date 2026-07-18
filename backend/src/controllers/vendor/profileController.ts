import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const UpdateProfileSchema = z.object({
  companyName: z.string().min(1).optional(),
  serviceType: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
});

// GET /api/vendor/profile
export async function getProfile(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;

  const vendor = await prisma.user.findUnique({
    where: { id: vendorId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      companyName: true,
      serviceType: true,
      vendorApprovalStatus: true,
      avatarUrl: true,
      campusId: true,
      campus: { select: { id: true, name: true, location: true } },
      selectedService: {
        select: { id: true, title: true, price: true },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!vendor) {
    res.status(404).json({ message: "Vendor not found" });
    return;
  }

  res.status(200).json({ vendor });
}

// PATCH /api/vendor/profile
export async function updateProfile(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;

  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const vendor = await prisma.user.update({
    where: { id: vendorId },
    data: parsed.data,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      companyName: true,
      serviceType: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ vendor });
}
