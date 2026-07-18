import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  quantity: z.number().int().positive().default(1),
  quality: z.string().optional(),
});

const UpdateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  quantity: z.number().int().positive().optional(),
  quality: z.string().optional(),
  isActive: z.boolean().optional(),
});

const SERVICE_SELECT = {
  id: true,
  title: true,
  description: true,
  price: true,
  quantity: true,
  quality: true,
  imageUrl: true,
  isActive: true,
  ceremonyId: true,
  createdAt: true,
  updatedAt: true,
} as const;

// POST /api/admin/ceremonies/:id/services
export async function createServiceOffering(
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
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const parsed = CreateServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const service = await prisma.ceremonyServiceOffering.create({
    data: { ...parsed.data, ceremonyId },
    select: SERVICE_SELECT,
  });

  res.status(201).json({ service });
}

// GET /api/admin/ceremonies/:id/services
export async function getServiceOfferings(
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
  });
  if (!ceremony) {
    res.status(404).json({ message: "Ceremony not found" });
    return;
  }

  const services = await prisma.ceremonyServiceOffering.findMany({
    where: { ceremonyId },
    select: {
      ...SERVICE_SELECT,
      _count: { select: { vendorRequests: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ services });
}

// PATCH /api/admin/services/:serviceId
export async function updateServiceOffering(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const serviceId = Number(req.params.serviceId);
  if (!Number.isInteger(serviceId) || serviceId < 1) {
    res.status(400).json({ message: "Invalid service id" });
    return;
  }

  const parsed = UpdateServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.ceremonyServiceOffering.findUnique({
    where: { id: serviceId },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Service offering not found" });
    return;
  }

  const service = await prisma.ceremonyServiceOffering.update({
    where: { id: serviceId },
    data: parsed.data,
    select: SERVICE_SELECT,
  });

  res.status(200).json({ service });
}

// DELETE /api/admin/services/:serviceId
export async function deleteServiceOffering(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;
  const serviceId = Number(req.params.serviceId);
  if (!Number.isInteger(serviceId) || serviceId < 1) {
    res.status(400).json({ message: "Invalid service id" });
    return;
  }

  const existing = await prisma.ceremonyServiceOffering.findUnique({
    where: { id: serviceId },
    include: { ceremony: { select: { campusId: true } } },
  });
  if (!existing || existing.ceremony.campusId !== campusId) {
    res.status(404).json({ message: "Service offering not found" });
    return;
  }

  await prisma.ceremonyServiceOffering.delete({ where: { id: serviceId } });
  res.status(200).json({ message: "Service offering deleted" });
}
