import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateVendorRequestSchema = z.object({
  vendorId: z.number().int().positive(),
  ceremonyId: z.number().int().positive(),
  serviceOfferingId: z.number().int().positive().optional(),
  requestTitle: z.string().min(1),
  requestDescription: z.string().optional(),
});

const VENDOR_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  companyName: true,
  serviceType: true,
  vendorApprovalStatus: true,
  avatarUrl: true,
  status: true,
  campusId: true,
  createdAt: true,
} as const;

// GET /api/admin/vendors
export async function getVendors(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;

  const vendors = await prisma.user.findMany({
    where: { role: "VENDOR", campusId },
    select: VENDOR_SELECT,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ vendors });
}

// GET /api/admin/vendors/:id
export async function getVendorById(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid vendor id" });
    return;
  }

  const vendor = await prisma.user.findUnique({
    where: { id, role: "VENDOR", campusId },
    select: {
      ...VENDOR_SELECT,
      assignedVendorRequests: {
        select: {
          id: true,
          requestTitle: true,
          requestStatus: true,
          ceremony: { select: { id: true, title: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!vendor) {
    res.status(404).json({ message: "Vendor not found" });
    return;
  }

  res.status(200).json({ vendor });
}

// PATCH /api/admin/vendors/:id/approve
export async function approveVendor(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid vendor id" });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id, role: "VENDOR", campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Vendor not found" });
    return;
  }
  if (existing.vendorApprovalStatus === "APPROVED") {
    res.status(409).json({ message: "Vendor is already approved" });
    return;
  }

  const vendor = await prisma.user.update({
    where: { id },
    data: { vendorApprovalStatus: "APPROVED" },
    select: VENDOR_SELECT,
  });

  res.status(200).json({ vendor });
}

// PATCH /api/admin/vendors/:id/reject
export async function rejectVendor(req: Request, res: Response): Promise<void> {
  const campusId = req.user!.campusId!;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: "Invalid vendor id" });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id, role: "VENDOR", campusId },
  });
  if (!existing) {
    res.status(404).json({ message: "Vendor not found" });
    return;
  }
  if (existing.vendorApprovalStatus === "REJECTED") {
    res.status(409).json({ message: "Vendor is already rejected" });
    return;
  }

  const vendor = await prisma.user.update({
    where: { id },
    data: { vendorApprovalStatus: "REJECTED" },
    select: VENDOR_SELECT,
  });

  res.status(200).json({ vendor });
}

// POST /api/admin/vendors/requests  — assign vendor to ceremony
export async function createVendorRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const adminId = req.user!.id;

  const parsed = CreateVendorRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const {
    vendorId,
    ceremonyId,
    serviceOfferingId,
    requestTitle,
    requestDescription,
  } = parsed.data;

  const vendor = await prisma.user.findUnique({
    where: {
      id: vendorId,
      role: "VENDOR",
      campusId,
      vendorApprovalStatus: "APPROVED",
    },
  });
  if (!vendor) {
    res
      .status(404)
      .json({ message: "Approved vendor not found on this campus" });
    return;
  }

  const ceremony = await prisma.ceremony.findUnique({
    where: { id: ceremonyId, campusId },
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const vendorRequest = await prisma.vendorRequest.create({
    data: {
      vendorId,
      ceremonyId,
      assignedById: adminId,
      serviceOfferingId,
      requestTitle,
      requestDescription,
    },
    select: {
      id: true,
      requestTitle: true,
      requestDescription: true,
      requestStatus: true,
      createdAt: true,
      vendor: { select: { id: true, fullName: true, companyName: true } },
      ceremony: { select: { id: true, title: true } },
    },
  });

  res.status(201).json({ vendorRequest });
}

// GET /api/admin/vendors/requests
export async function getVendorRequests(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const requests = await prisma.vendorRequest.findMany({
    where: { ceremony: { campusId } },
    select: {
      id: true,
      requestTitle: true,
      requestDescription: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      vendor: { select: { id: true, fullName: true, companyName: true } },
      ceremony: { select: { id: true, title: true } },
      serviceOffering: { select: { id: true, title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ requests });
}
